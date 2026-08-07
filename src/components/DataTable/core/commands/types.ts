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
 */
export type CommandPayload = void | object;

/**
 * Context available to every command handlers.
 *
 * This is the low-level command context.
 *
 * This is intentionally generic.
 *
 * The complete DataTableContext will be introduced when
 * the command system is integrated into the runtime.
 */
export interface CommandContext<TTypes extends DataTableTypesBase> {
  readonly table: TTypes;
}

/**
 * Converts a payload type into the argument tuple
 * required by a command.
 *
 * No payload:
 *
 *     []
 *
 * Payload:
 *
 *     [payload]
 */
export type CommandArguments<TPayload extends CommandPayload> = [
  TPayload,
] extends [void]
  ? []
  : [payload: TPayload];

/**
 * A command handler.
 *
 * The important part here is that the payload is represented
 * as a tuple rather than as an optional parameter.
 *
 * This preserves the difference between:
 *
 *     execute(context)
 *
 * and:
 *
 *     execute(context, payload)
 *
 * Commands with a payload receive:
 *
 *   context
 *   payload
 *
 * Commands whose payload is `void` receive only:
 *
 *   context
 */
// export type CommandHandler<
//   TTypes extends DataTableTypesBase,
//   TPayload extends CommandPayload,
// > = [TPayload] extends [void]
//   ? (context: CommandContext<TTypes>) => void
//   : (
//       context: CommandContext<TTypes>,

//       payload: TPayload,
//     ) => void;
export type CommandHandler<
  TTypes extends DataTableTypesBase,
  TPayload extends CommandPayload,
> = (
  context: CommandContext<TTypes>,

  ...args: CommandArguments<TPayload>
) => void;

/**
 * Definition of one command.
 *
 * The payload type is permanently associated with
 * the command definition.
 */
export interface CommandDefinition<
  TTypes extends DataTableTypesBase,
  TPayload extends CommandPayload = void,
> {
  readonly execute: CommandHandler<TTypes, TPayload>;
}

/**
 * Converts a command definition into the arguments
 * accepted by CommandRegistry.execute().
 *
 * No payload:
 *
 *   []
 *
 * Payload:
 *
 *   [payload]
 */
// export type CommandExecuteArguments<TCommand> =
//   TCommand extends CommandDefinition<infer _TTypes, infer TPayload>
//     ? [TPayload] extends [void]
//       ? []
//       : [payload: TPayload]
//     : never;

/**
 * Extracts the payload type from a command definition.
 */
export type CommandPayloadOf<TCommand> =
  TCommand extends CommandDefinition<infer _TTypes, infer TPayload>
    ? TPayload
    : never;

/**
 * Convert a command definition into its execution
 * argument tuple.
 */
export type CommandExecuteArguments<TCommand> =
  TCommand extends CommandDefinition<infer _TTypes, infer TPayload>
    ? CommandArguments<TPayload>
    : never;

/**
 * A map of command names to command definitions.
 *
 * The exact key -> command relationship is preserved.
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
 */
export type CommandMap<TTypes extends DataTableTypesBase> = Record<
  PropertyKey,
  CommandDefinition<TTypes, CommandPayload>
>;

/**
 * Internal runtime command.
 *
 * This is the crucial abstraction that removes the
 * generic correlation problem from command execution.
 *
 * The runtime registry doesn't need to know whether a
 * command has a payload.
 *
 * The command itself already knows how to invoke its
 * handler.
 */
export interface RuntimeCommand<TTypes extends DataTableTypesBase> {
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
  TTypes extends DataTableTypesBase,
  TCommands extends CommandMap<TTypes>,
> = {
  [K in keyof TCommands]: RuntimeCommand<TTypes>;
};

/**
 * Strongly typed command registry.
 */
export interface CommandRegistry<
  TTypes extends DataTableTypesBase,
  TCommands extends CommandMap<TTypes>,
> {
  /**
   * Register a command.
   */
  register<K extends keyof TCommands>(key: K, command: TCommands[K]): void;

  /**
   * Execute a command that accepts a payload.
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

// /**
//  * Every command can optionally
//  * receive a payload.
//  */
// export type CommandHandler<TTypes extends DataTableTypesBase, TPayload> = (
//   context: DataTableContext<TTypes>,

//   payload: TPayload,
// ) => void;

// /**
//  * Command definition.
//  */
// export interface CommandDefinition<
//   TTypes extends DataTableTypesBase,
//   TPayload,
// > {
//   execute: CommandHandler<TTypes, TPayload>;
// }

// export type CommandRegistryMap = Record<
//   PropertyKey,
//   CommandDefinition<DataTableTypesBase, object>
// >;

// export interface CommandRegistry<
//   TTypes extends DataTableTypesBase,
//   TCommands extends CommandRegistryMap,
// > {
//   register<K extends keyof TCommands>(key: K, command: TCommands[K]): void;

//   execute<K extends keyof TCommands>(
//     key: K,
//     payload: Parameters<TCommands[K]["execute"]>[1],
//   ): void;

//   has<K extends keyof TCommands>(key: K): boolean;
// }
