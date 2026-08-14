import { RegistryImpl } from "../registry/registryImpl";

import type {
  CommandContext,
  CommandExecuteArguments,
  CommandMap,
  CommandRegistry,
  NoPayloadCommand,
  PayloadCommand,
  RuntimeCommand,
  RuntimeCommandMap,
} from "./types";

/**
 * Runtime payload command shape.
 *
 * Erased payload-command view used only after runtime
 * discrimination.
 *
 * The strongly typed public API prevents an invalid payload from
 * reaching this point through normal registry execution.
 */
interface RuntimePayloadCommand<TContext extends object> {
  readonly hasPayload: true;
  readonly execute: (
    context: CommandContext<TContext>,
    payload: object,
  ) => void;
}

/**
 * Runtime command registry.
 *
 * Commands are normalized when registered and retrieve their
 * context lazily when executed.
 *
 * The context getter is critical for React integration because
 * the ReactTable view may change while the command registry
 * itself should remain stable.
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
 *
 * The context getter is critical for React integration because
 * the ReactTable view may change while the command registry
 * itself should remain stable.
 */
export class CommandRegistryImpl<
  TContext extends object,
  TCommands extends CommandMap<TContext, TCommands>,
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
  private readonly registry = new RegistryImpl<
    RuntimeCommandMap<TContext, TCommands>
  >();

  // /**
  //  * Context supplied to every command.
  //  *
  //  * This will eventually become the full DataTableContext.
  //  */
  // private readonly context: CommandContext<TContext>;

  // constructor(context: CommandContext<TContext>) {
  //   this.context = context;
  //   this.registry = new RegistryImpl<RuntimeCommandMap<TContext, TCommands>>();
  // }

  /**
   * Runtime context resolver.
   *
   * Do NOT replace this with an immutable context field.
   *
   * This is intentionally a getter instead of storing one
   * immutable context object.
   *
   * React adapters may need the latest table projection while
   * keeping this registry alive for the lifetime of the table.
   */
  private readonly getContext: () => CommandContext<TContext>;

  constructor(getContext: () => CommandContext<TContext>) {
    this.getContext = getContext;
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
    this.registry.register(key, this.createRuntimeCommand(command));
  }

  /**
   * Execute a registered command.
   *
   * The command key determines the payload type at the
   * public API level.
   */
  execute<K extends keyof TCommands>(
    key: K,
    ...args: CommandExecuteArguments<TContext, TCommands[K]>
  ): void {
    const command = this.registry.get(key);

    if (!command) {
      throw new Error(`Command "${String(key)}" is not registered.`);
    }

    command.invoke(this.getContext(), args);
  }

  /**
   * Normalize a strongly typed command into the uniform
   * runtime invocation shape.
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
  // private createRuntimeCommand<K extends keyof TCommands>(
  //   command: TCommands[K],
  // ): RuntimeCommand<TContext> {
  private createRuntimeCommand<K extends keyof TCommands>(
    command: TCommands[K],
  ): RuntimeCommand<TContext> {
    if (command.hasPayload) {
      /**
       * Runtime payload erasure occurs exactly once here.
       *
       * `register()` already guarantees that `command` belongs
       * to TCommands[K], so its concrete payload is known by the
       * public API.
       *
       * The registry stores heterogeneous commands uniformly,
       * therefore the concrete payload generic must be erased
       * at this boundary.
       */
      const payloadCommand =
        command as unknown as RuntimePayloadCommand<TContext>;

      return {
        invoke(context, args) {
          const payload = args[0];

          if (payload === null || typeof payload !== "object") {
            throw new TypeError(
              "Payload command requires a non-null object payload.",
            );
          }

          payloadCommand.execute(context, payload);
        },
      };
    }

    /**
     * `hasPayload: false` narrows the public command shape to
     * the no-payload execution form.
     *
     * The mapped generic constraint does not retain the full
     * discriminated union relationship after indexed access,
     * therefore we restore the no-payload command view here.
     */
    const noPayloadCommand = command as NoPayloadCommand<TContext>;

    return {
      invoke(context) {
        noPayloadCommand.execute(context);
      },
    };

    // return {
    //   invoke: (context, args) => {
    //     this.invokeCommand(command, context, args);
    //   },
    // };
  }

  // /**
  //  * Runtime dispatch boundary.
  //  *
  //  * Public callers cannot supply an invalid payload because
  //  * execute() is typed through CommandExecuteArguments.
  //  *
  //  * At runtime, however, the generic payload type has been
  //  * erased. The command's `hasPayload` discriminant restores
  //  * which execution form must be used.
  //  */
  // private invokeCommand<TCommand extends CommandBase>(
  //   command: TCommand,
  //   context: CommandContext<TContext>,
  //   args: readonly unknown[],
  // ): void {
  //   // if (!command.hasPayload) {
  //   //   command.execute(context);
  //   //   return;
  //   // }

  //   // this.invokePayloadCommand(command, context, args);

  //   if (command.hasPayload) {
  //     this.invokePayloadCommand(command, context, args);
  //     return;
  //   }
  //   const noPayloadCommand = command as NoPayloadCommand<TContext>;

  //   noPayloadCommand.execute(context);
  // }

  // /**
  //  * Invoke a command that explicitly requires a payload.
  //  *
  //  * Because this method only accepts PayloadCommand, TypeScript
  //  * knows that `execute()` requires the second argument.
  //  *
  //  * Compile-time callers already receive exact payload typing,
  //  * but JavaScript callers or unsafe external boundaries can
  //  * still reach runtime with malformed values.
  //  */
  // /**
  //  * Invoke a payload command after validating the runtime
  //  * payload boundary.
  //  */
  // private invokePayloadCommand<K extends keyof TCommands>(
  //   command: TCommands[K],
  //   context: CommandContext<TContext>,
  //   args: readonly unknown[],
  // ): void {
  //   const payload = args[0];

  //   // if (
  //   //   payload === undefined ||
  //   //   typeof payload !== "object" ||
  //   //   payload === null
  //   // ) {
  //   //   throw new Error("Command payload must be a non-null object.");
  //   // }

  //   // command.execute(context, payload);

  //   if (payload === null || typeof payload !== "object") {
  //     throw new TypeError(
  //       "Payload command requires a non-null object payload.",
  //     );
  //   }

  //   /**
  //    * The public generic API already guarantees the exact
  //    * payload type for this command.
  //    *
  //    * At this point TypeScript no longer knows which concrete
  //    * TPayload belonged to TCommands[K], because runtime
  //    * dispatch erased that generic relationship.
  //    *
  //    * Keep that assertion here and nowhere else.
  //    */
  //   const payloadCommand =
  //     command as unknown as RuntimePayloadCommand<TContext>;

  //   payloadCommand.execute(context, payload);
  // }

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
