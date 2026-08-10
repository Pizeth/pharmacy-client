// import type { DataTableContext, DataTableTypesBase } from "../types";

// import type {
//   CommandDefinition,
//   CommandRegistry,
//   CommandRegistryMap,
// } from "./types";

// export class CommandRegistryImpl<
//   TTypes extends DataTableTypesBase,
//   TCommands extends CommandRegistryMap,
// > implements CommandRegistry<TTypes, TCommands> {
//   private readonly commands: Partial<TCommands> = {};

//   constructor(private readonly context: DataTableContext<TTypes>) {}

//   register<K extends keyof TCommands>(key: K, command: TCommands[K]): void {
//     this.commands[key] = command;
//   }

//   execute<K extends keyof TCommands>(
//     key: K,
//     payload: Parameters<TCommands[K]["execute"]>[1],
//   ): void {
//     const command = this.commands[key];

//     if (!command) {
//       throw new Error(`Command '${String(key)}' is not registered`);
//     }

//     command.execute(this.context, payload);
//   }

//   has<K extends keyof TCommands>(key: K): boolean {
//     return key in this.commands;
//   }
// }

import { RegistryImpl } from "../registry/registryImpl";
import type { DataTableTypesBase } from "../types";

// import { RegistryImpl } from "../registry";

import type {
  CommandContext,
  CommandDefinition,
  CommandExecuteArguments,
  CommandMap,
  CommandPayload,
  CommandRegistry,
  PayloadCommand,
  RuntimeCommand,
  RuntimeCommandMap,
} from "./types";

/**
 * Runtime implementation of CommandRegistry.
 *
 * The important architectural distinction is:
 *
 * PUBLIC
 *
 *     command key -> strongly typed command
 *
 * INTERNAL
 *
 *     command key -> RuntimeCommand
 *
 * Commands are normalized when registered. This prevents
 * the runtime execution path from having to correlate:
 *
 *     TCommands[K]
 *
 * with:
 *
 *     CommandExecuteArguments<TCommands[K]>
 *
 * which TypeScript cannot reliably narrow after the values
 * have been separated.
 *
 * This class adds command-specific behavior:
 *
 *   - command registration
 *   - command execution
 *   - command existence checks
 *   - command removal
 */
export class CommandRegistryImpl<
  TTypes extends DataTableTypesBase,
  TCommands extends CommandMap<TTypes>,
> implements CommandRegistry<TTypes, TCommands> {
  /**
   * Runtime command storage.
   *
   * Notice that the underlying registry is now storing
   * RuntimeCommand objects rather than the public command
   * definitions.
   */
  private readonly registry: RegistryImpl<RuntimeCommandMap<TTypes, TCommands>>;

  /**
   * Command execution context.
   *
   * This will eventually become the full DataTableContext.
   */
  private readonly context: CommandContext<TTypes>;

  constructor(context: CommandContext<TTypes>) {
    this.context = context;
    this.registry = new RegistryImpl<RuntimeCommandMap<TTypes, TCommands>>();
  }

  /**
   * Register a command.
   *
   * The caller receives the fully typed command API.
   *
   * Internally the command is immediately normalized into
   * a runtime invoker.
   */
  register<K extends keyof TCommands>(key: K, command: TCommands[K]): void {
    const runtimeCommand = this.createRuntimeCommand(command);

    this.registry.register(key, runtimeCommand);
  }

  /**
   * Execute a registered command.
   *
   * The public API signature preserves the key -> payload relationship.
   */
  execute<K extends keyof TCommands>(
    key: K,
    ...args: CommandExecuteArguments<TCommands[K]>
  ): void {
    const command = this.registry.get(key);

    if (!command) {
      throw new Error(`Command "${String(key)}" is not registered.`);
    }

    command.invoke(this.context, args);
  }

  /**
   * Normalize a public command into a runtime command.
   *
   * Notice that we do NOT attempt to inspect TPayload here.
   *
   * TPayload is a type and therefore does not exist at runtime.
   *
   * Instead, the command's `hasPayload` property is used.
   */
  private createRuntimeCommand<TPayload extends CommandPayload>(
    command: CommandDefinition<TTypes, TPayload>,
  ): RuntimeCommand<TTypes> {
    return {
      invoke: (context, args) => {
        this.invokeCommand(command, context, args);
      },
    };
  }

  /**
   * Invoke a normalized command.
   *
   * `hasPayload` is a real runtime discriminant, so TypeScript
   * can safely narrow the command here.
   */
  private invokeCommand<TPayload extends CommandPayload>(
    command: CommandDefinition<TTypes, TPayload>,
    context: CommandContext<TTypes>,
    args: readonly unknown[],
  ): void {
    if (!command.hasPayload) {
      command.execute(context);
      return;
    }

    this.invokePayloadCommand(command, context, args);
  }

  /**
   * Invoke a command that explicitly requires a payload.
   *
   * Because this method only accepts PayloadCommand, TypeScript
   * knows that `execute()` requires the second argument.
   */
  private invokePayloadCommand<TPayload extends object>(
    command: PayloadCommand<TTypes, TPayload>,
    context: CommandContext<TTypes>,
    args: readonly unknown[],
  ): void {
    const payload = args[0];

    if (
      payload === undefined ||
      typeof payload !== "object" ||
      payload === null
    ) {
      throw new Error("Command payload must be a non-null object.");
    }

    command.execute(context, payload as TPayload);
  }

  /**
   * Determine whether a command exists.
   */
  has<K extends keyof TCommands>(key: K): boolean {
    return this.registry.has(key);
  }

  /**
   * Remove a command.
   */
  remove<K extends keyof TCommands>(key: K): void {
    this.registry.remove(key);
  }

  /**
   * Return all registered command keys.
   */
  keys(): Array<keyof TCommands> {
    return this.registry.keys();
  }
}
