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

import type { DataTableTypesBase } from "../types";

import { RegistryImpl } from "../registry";

import type {
  CommandContext,
  CommandDefinition,
  CommandExecuteArguments,
  CommandMap,
  CommandPayload,
  CommandRegistry,
  RuntimeCommand,
  RuntimeCommandMap,
} from "./types";

/**
 * Runtime implementation of the strongly typed command registry.
 *
 * Publicly, this class preserves:
 *
 *     command key -> command payload
 * Internally, commands are normalized into RuntimeCommand
 * objects before being stored.
 *
 * This separation is important because TypeScript cannot
 * maintain dependent relationships between a generic command
 * key and independently stored runtime values.
 *
 * The generic RegistryImpl provides the storage mechanism.
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
   * The public API remains fully strongly typed.
   *
   * The command is normalized into a RuntimeCommand before
   * being stored.
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
   * Convert a public command definition into its normalized
   * runtime representation.
   *
   * The important detail is that the generic payload
   * relationship is resolved HERE, at registration time.
   *
   * After this method returns, the runtime registry no longer
   * needs to know the payload type.
   */
  private createRuntimeCommand<
    TPayload extends CommandDefinition<
      TTypes,
      CommandPayload
    > extends CommandDefinition<TTypes, infer _TPayload>
      ? _TPayload
      : never,
  >(command: TPayload): RuntimeCommand<TTypes> {
    return {
      invoke: (context, args) => {
        this.invokeCommand(command, context, args);
      },
    };
  }

 /**
   * Invoke a concrete command definition.
   *
   * This method is the only place where the normalized
   * runtime argument array is converted back into the
   * command's actual argument tuple.
   */
  private invokeCommand<
    TPayload extends CommandPayload
  >(
    command:
      CommandDefinition<
        TTypes,
        TPayload
      >,

    context:
      CommandContext<TTypes>,

    args:
      readonly unknown[],
  ): void
  {
    if (
      [TPayload] extends [void]
    )
    {
      command.execute(
        context,
      );

      return;
    }


    const payload =
      args[0];


    if (
      payload === undefined
    )
    {
      throw new Error(
        "Command payload is required.",
      );
    }


    command.execute(
      context,
      payload as TPayload,
    );
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
