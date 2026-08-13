import { RegistryImpl } from "../registry/registryImpl";
import type { DataTableTypesBase } from "../types";

import type {
  AnyCommandDefinition,
  CommandContext,
  CommandExecuteArguments,
  CommandMap,
  CommandRegistry,
  PayloadCommand,
  RuntimeCommand,
  RuntimeCommandMap,
} from "./types";

/**
 * Runtime implementation of CommandRegistry.
 *
 * The architecture deliberately separates:
 *
 * PUBLIC
 *
 *     command key -> strongly typed command definition
 *
 * INTERNAL
 *
 *     command key -> normalized RuntimeCommand
 *
 * This prevents the runtime execution layer from having
 * to maintain the relationship between:
 *
 *     TCommands[K]
 *
 * and:
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
  // TTypes extends DataTableTypesBase,
  TContext extends object,
  TCommands extends CommandMap<TContext>,
> implements CommandRegistry<TContext, TCommands> {
  /**
   * Internal runtime registry.
   *
   * The public Ccmmands are normalized into RuntimeCommand objects before
   * storage.
   *
   * Notice that the underlying registry is now storing
   * RuntimeCommand objects rather than the public command
   * definitions.
   *
   * That lets the public API remain strongly typed while the
   * internal dispatch mechanism has one consistent shape.
   */
  private readonly registry: RegistryImpl<
    RuntimeCommandMap<TContext, TCommands>
  >;

  /**
   * Context supplied to every command.
   *
   * This will eventually become the full DataTableContext.
   */
  private readonly context: CommandContext<TContext>;

  constructor(context: CommandContext<TContext>) {
    this.context = context;
    this.registry = new RegistryImpl<RuntimeCommandMap<TContext, TCommands>>();
  }

  /**
   * Register a command.
   *
   * The public API preserves the exact relationship:
   *
   *   key -> TCommands[K]
   *
   * Internally the command is normalized into a RuntimeCommand.
   */
  register<K extends keyof TCommands>(key: K, command: TCommands[K]): void {
    const runtimeCommand = this.createRuntimeCommand(command);

    this.registry.register(key, runtimeCommand);
  }

  /**
   * Execute a registered command.
   *
   * The command key determines the payload type at the
   * public API level.
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
   * Notice that we intentionally do not attempt to inspect
   * generic types at runtime.
   *
   * Generic types such as:
   *
   *   TPayload
   *
   * do not exist at runtime.
   *
   * Instead, `hasPayload` is used as the runtime and
   * compile-time discriminant.
   */
  private createRuntimeCommand(
    command: AnyCommandDefinition<TContext>,
  ): RuntimeCommand<TContext> {
    return {
      invoke: (context, args) => {
        this.invokeCommand(command, context, args);
      },
    };
  }

  /**
   * Invoke a command using its runtime discriminant.
   *
   * `hasPayload` is a real property, so TypeScript can
   * safely narrow:
   *
   *   false -> NoPayloadCommand
   *   true  -> PayloadCommand
   */
  private invokeCommand(
    command: AnyCommandDefinition<TContext>,
    context: CommandContext<TContext>,
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
   *
   * Compile-time callers already receive exact payload typing,
   * but JavaScript callers or unsafe external boundaries can
   * still reach runtime with malformed values.
   */
  // private invokePayloadCommand<TPayload extends object>(
  //   command: PayloadCommand<TContext, TPayload>,
  //   context: CommandContext<TContext>,
  //   args: readonly unknown[],
  private invokePayloadCommand(
    command: PayloadCommand<TContext, object>,
    context: CommandContext<TContext>,
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

    command.execute(context, payload);
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
