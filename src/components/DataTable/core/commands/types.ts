// src/components/DataTable/core/commands/types.ts

/**
 * Payload accepted by a command.
 *
 * `void` means the command does not require a payload.
 *
 * Object payloads are used for commands that require
 * structured input.
 *
 * Examples:
 *
 *   void
 *   { rowId: number }
 *   { columnId: string }
 *
 * Primitive payloads are intentionally not supported.
 * DataTable commands should use named object payloads.
 *
 * Commands may either:
 *
 * - have no payload
 * - receive one structured object payload
 *
 * We intentionally use object payloads for commands because
 * commands generally represent application actions and tend
 * to grow over time.
 */
export type CommandPayload = void | object;

/**
 * Context available to every command handlers.
 *
 * The concrete command context is supplied by the DataTable
 * runtime. Commands receive a readonly view of that context.
 *
 * Commands may call services, emit events, manipulate the
 * table, etc., but they should not replace properties on the
 * context object itself.
 *
 * Runtime command context is readonly from the command's
 * perspective.
 *
 * Services contained inside the context may themselves expose
 * mutable APIs, but the context references cannot be replaced.
 */
export type CommandContext<TContext extends object> = Readonly<TContext>;

/**
 * Convert a command payload type into the argument tuple used
 * by CommandRegistry.execute().
 *
 * No-payload command:
 *
 *   execute(context)
 *
 * Payload command:
 *
 *   execute(context, payload)
 *
 * Example:
 *
 * void
 *
 * becomes:
 *
 * []
 *
 * while:
 *
 * {
 *   id: number;
 * }
 *
 * becomes:
 *
 * [
 *   payload: {
 *     id: number;
 *   }
 * ]
 */
export type CommandArgumentsUnused<TPayload extends CommandPayload> = [
  TPayload,
] extends [void]
  ? []
  : [payload: Exclude<TPayload, void>];

/**
 * Common discriminant shared by every command definition.
 *
 * This exists so generic command infrastructure can safely
 * inspect `hasPayload` without knowing the concrete payload type.
 */
export interface CommandBase {
  readonly hasPayload: boolean;
}

/**
 * Command that does not require a payload.
 *
 * `hasPayload` is both:
 *
 * 1. a runtime value
 * 2. a TypeScript discriminant
 */

export interface NoPayloadCommand<TContext extends object> extends CommandBase {
  readonly hasPayload: false;
  readonly execute: (context: CommandContext<TContext>) => void;
}

/**
 * Command with a payload.
 *
 * `hasPayload: true` is the runtime discriminant that lets
 * the implementation safely distinguish this command from
 * a no-payload command.
 *
 * The payload is explicitly constrained to `object`.
 */
export interface PayloadCommand<
  TContext extends object,
  TPayload extends object,
> extends CommandBase {
  readonly hasPayload: true;

  readonly execute: (
    context: CommandContext<TContext>,

    payload: TPayload,
  ) => void;
}

/**
 * Public command definition.
 *
 * This is the important type-level bridge between:
 *
 *     void
 *
 * and:
 *
 *     object payload
 *
 * `Exclude<TPayload, void>` is required because
 * PayloadCommand only accepts object payloads.
 *
 * Example:
 *
 * type RefreshCommand =
 *   CommandDefinition<
 *     MyContext
 *   >;
 *
 * type DeleteCommand =
 *   CommandDefinition<
 *     MyContext,
 *     {
 *       id: number;
 *     }
 *   >;
 */
export type CommandDefinition<
  TContext extends object,
  TPayload extends CommandPayload = void,
> = [TPayload] extends [void]
  ? NoPayloadCommand<TContext>
  : PayloadCommand<TContext, Exclude<TPayload, void>>;

/**
 * Validates one command value.
 *
 * Notice that this does NOT compare a payload command against
 * `PayloadCommand<TContext, object>`.
 *
 * Doing that would lose correctness under strict function
 * parameter variance:
 *
 *   PayloadCommand<Ctx, SpecificPayload>
 *
 * is not generally assignable to:
 *
 *   PayloadCommand<Ctx, object>
 *
 * because its execute function requires the narrower payload.
 */
// export type ValidCommand<TContext extends object, TCommand> =
//   TCommand extends NoPayloadCommand<TContext>
//     ? TCommand
//     : TCommand extends PayloadCommand<TContext, infer TPayload extends object>
//       ? PayloadCommand<TContext, TPayload>
//       : never;

export type ValidCommand<TContext extends object, TCommand> =
  TCommand extends NoPayloadCommand<TContext>
    ? TCommand
    : TCommand extends PayloadCommand<TContext, infer TPayload extends object>
      ? TCommand
      : never;

/**
 * Self-mapped constraint for a concrete command map.
 *
 * Example:
 *
 * type Commands = {
 *   refresh: NoPayloadCommand<Context>;
 *   remove: PayloadCommand<Context, { id: number }>;
 * };
 *
 * No PropertyKey index signature is required.
 */
export type CommandMapConstraint<
  TContext extends object,
  TCommands extends object,
> = {
  [K in keyof TCommands]: ValidCommand<TContext, TCommands[K]>;
};

/**
 * Explicit structural constraint used by command infrastructure.
 *
 * Unlike CommandMapConstraint, this tells TypeScript directly
 * that every indexed command has the common `CommandBase`
 * discriminant.
 */
export type CommandBaseMap<TCommands extends object> = {
  [K in keyof TCommands]: CommandBase;
};

/**
 * Broad command constraint used for heterogeneous command maps.
 *
 * Structural constraint representing any valid command.
 *
 * `never` is intentionally used for the payload side of
 * PayloadCommand. Because command execution is contravariant
 * in its payload parameter, every concrete object payload
 * command is assignable to PayloadCommand<TContext, never>.
 *
 * This gives us a heterogeneous command-map constraint
 * without using `any`.
 * This is intentionally an explicit union.
 *
 * We must NOT write:
 *
 *   CommandDefinition<TContext, CommandPayload>
 *
 * because `CommandPayload` is `void | object`, and the
 * conditional type inside CommandDefinition does not
 * distribute because it uses the tuple `[TPayload]`.
 *
 * This union exists only so one registry may contain both:
 *
 * - commands without payloads
 * - commands with object payloads
 */
export type AnyCommandDefinitionUnused<TContext extends object> =
  | NoPayloadCommand<TContext>
  | PayloadCommand<TContext, object>;

/**
 * Complete constraint for a concrete command map.
 *
 * The first half gives generic infrastructure access to
 * `hasPayload`.
 *
 * The second half validates the actual context/payload
 * signatures.
 */
export type CommandMap<
  TContext extends object,
  TCommands extends object,
> = CommandBaseMap<TCommands> & CommandMapConstraint<TContext, TCommands>;

/**
 * Resolve the payload type for one command.
 */
export type CommandPayloadOf<TContext extends object, TCommand> =
  TCommand extends NoPayloadCommand<TContext>
    ? void
    : TCommand extends PayloadCommand<TContext, infer TPayload extends object>
      ? TPayload
      : never;

/**
 * Resolve the execute() arguments for one command.
 */
export type CommandExecuteArguments<TContext extends object, TCommand> =
  TCommand extends NoPayloadCommand<TContext>
    ? []
    : TCommand extends PayloadCommand<TContext, infer TPayload extends object>
      ? [payload: TPayload]
      : never;

// /**
//  * A command handler.
//  *
//  * The important part here is that the payload is represented
//  * as a tuple rather than as an optional parameter.
//  *
//  * This preserves the difference between:
//  *
//  *     execute(context)
//  *
//  * and:
//  *
//  *     execute(context, payload)
//  *
//  * Commands with a payload receive:
//  *
//  *   context
//  *   payload
//  *
//  * Commands whose payload is `void` receive only:
//  *
//  *   context
//  */
// export type CommandHandler<
//   TTypes extends DataTableTypesBase,
//   TPayload extends CommandPayload,
// > = (
//   context: CommandContext<TTypes>,
//   ...args: CommandArguments<TPayload>
// ) => void;

/**
 * Internal normalized runtime command.
 *
 * This is the crucial abstraction that removes the
 * generic correlation problem from command execution.
 *
 * The runtime registry doesn't need to know whether a
 * command has a payload.
 *
 * The command itself already knows how to invoke its
 * handler.
 *
 * unknown[] is deliberate here because this object sits at
 * the erased runtime boundary after compile-time command
 * argument validation has already occurred.
 *
 * This is the exact point where compile-time command signatures
 * cross into runtime dispatch.
 */
export interface RuntimeCommand<TContext extends object> {
  invoke(context: CommandContext<TContext>, args: readonly unknown[]): void;
}

/**
 * Internal runtime command map.
 *
 * It preserves the command key relationship while allowing
 * the runtime representation to be normalized.
 */
export type RuntimeCommandMap<
  TContext extends object,
  TCommands extends object,
> = {
  [K in keyof TCommands]: RuntimeCommand<TContext>;
};

/**
 * Erased command definition used only by runtime dispatch.
 *
 * Concrete payload typing has already been enforced by the
 * public registry API before reaching this boundary.
 */
export type RuntimeCommandDefinition<TContext extends object> =
  | NoPayloadCommand<TContext>
  | {
      readonly hasPayload: true;
      readonly execute: (
        context: CommandContext<TContext>,
        payload: object,
      ) => void;
    };

/**
 * Strongly typed command registry.
 */
export interface CommandRegistry<
  TContext extends object,
  TCommands extends CommandMap<TContext, TCommands>,
> {
  /**
   * Register a command.
   *
   * The command key determines the command definition.
   */
  register<K extends keyof TCommands>(key: K, command: TCommands[K]): void;

  /**
   * Execute a command.
   *
   * The command key determines the payload type.
   */
  execute<K extends keyof TCommands>(
    key: K,
    ...args: CommandExecuteArguments<TContext, TCommands[K]>
  ): void;

  /**
   * Determine whether a command is registered.
   */
  has<K extends keyof TCommands>(key: K): boolean;

  /**
   * Remove a command.
   */
  remove<K extends keyof TCommands>(key: K): void;

  /**
   * List registered commands.
   */
  keys(): Array<keyof TCommands>;
}
