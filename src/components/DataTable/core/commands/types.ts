import type { DataTableTypesBase } from "../types";

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
export type CommandArguments<TPayload extends CommandPayload> = [
  TPayload,
] extends [void]
  ? []
  : [payload: Exclude<TPayload, void>];

/**
 * Command that does not require a payload.
 *
 * `hasPayload` is both:
 *
 * 1. a runtime value
 * 2. a TypeScript discriminant
 */
export interface NoPayloadCommand<TTypes extends object> {
  readonly hasPayload: false;

  readonly execute: (context: CommandContext<TTypes>) => void;
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
> {
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
export type AnyCommandDefinition<TContext extends object> =
  | NoPayloadCommand<TContext>
  | PayloadCommand<TContext, object>;

/**
 * Map of command names to command definitions.
 *
 * The map is intentionally heterogeneous:
 *
 * - some commands may have no payload
 * - some commands may have a strongly typed object payload
 *
 * `AnyCommandDefinition` provides the structural constraint
 * without widening concrete payload types to `object` or `any`.
 *
 * Concrete command maps preserve the exact payload type
 * associated with each command key.
 *
 * Example:
 *
 * type Commands = {
 *   reset:
 *     CommandDefinition<MyTypes>;
 *
 *   deleteRow:
 *     CommandDefinition<
 *       MyTypes,
 *       { rowId: number }
 *     >;
 * };
 *
 * IMPORTANT:
 *
 * TContext is the actual runtime context available to command
 * handlers.
 *
 * It is no longer tied to DataTableTypesBase.
 */
export type CommandMap<TContext extends object> = Record<
  PropertyKey,
  AnyCommandDefinition<TContext>
>;

/**
 * Extract the payload type from a command definition.
 */
export type CommandPayloadOf<TCommand> =
  TCommand extends NoPayloadCommand<object>
    ? void
    : TCommand extends PayloadCommand<object, infer TPayload>
      ? TPayload
      : never;

/**
 * Resolve arguments accepted by execute() for a specific command.
 */
export type CommandExecuteArguments<TCommand> =
  TCommand extends NoPayloadCommand<object>
    ? []
    : TCommand extends PayloadCommand<object, infer TPayload>
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
 */
export interface RuntimeCommand<TTypes extends object> {
  readonly invoke: (
    context: CommandContext<TTypes>,
    args: readonly unknown[],
  ) => void;
}

/**
 * Internal runtime command map.
 *
 * It preserves the command key relationship while allowing
 * the runtime representation to be normalized.
 */
export type RuntimeCommandMap<
  TTypes extends object,
  TCommands extends CommandMap<TTypes>,
> = {
  [K in keyof TCommands]: RuntimeCommand<TTypes>;
};

/**
 * Strongly typed command registry.
 */
export interface CommandRegistry<
  TTypes extends object,
  TCommands extends CommandMap<TTypes>,
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
    ...args: CommandExecuteArguments<TCommands[K]>
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
