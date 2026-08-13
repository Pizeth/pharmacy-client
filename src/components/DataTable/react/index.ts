export { createDataTableReactProvider } from "./context";

export { useDataTable, useDataTableRuntime } from "./hooks";

// export type { DataTableReactContext } from "./context";

export type {
  DataTableStateSelector,
  ReactDataTableInstance,
  ReactDataTableTypes,
  UseDataTableInput,
  UseDataTableRuntimeInput,
} from "./types";

// type User = {
//   id: number;
//   firstName: string;
//   lastName: string;
// };

// const userTableFeatures = {
//   sorting: true,
//   pagination: true,
//   selection: true,
//   visibility: true,
// } as const;

// type UserTableTypes = ReactDataTableTypes<typeof userTableFeatures, User>;

// type UserTableEvents = {
//   userOpened: {
//     userId: number;
//   };

//   selectionCleared: void;
// };

// interface UserService {
//   openUser(userId: number): void;
// }

// type UserTableServices = {
//   users: UserService;
// };

// interface AuditPlugin {
//   record(action: string): void;
// }

// type UserTablePlugins = {
//   audit: AuditPlugin;
// };

// type UserRuntimeContext = DataTableRuntimeContext<
//   UserTableTypes,
//   UserTableEvents,
//   UserTableServices,
//   UserTablePlugins
// >;

// type UserTableCommands = {
//   openUser: CommandDefinition<
//     UserRuntimeContext,
//     {
//       userId: number;
//     }
//   >;

//   clearSelection: CommandDefinition<UserRuntimeContext>;
// };

// const userCommands: UserTableCommands = {
//   openUser: {
//     hasPayload: true,

//     execute(context, payload) {
//       const users = context.services.get("users");

//       users?.openUser(payload.userId);

//       context.events.emit("userOpened", {
//         userId: payload.userId,
//       });
//     },
//   },

//   clearSelection: {
//     hasPayload: false,

//     execute(context) {
//       /**
//        * Once selection APIs are part of the feature set,
//        * command handlers can use the typed table instance
//        * normally.
//        */
//       context.table.resetRowSelection();

//       context.events.emit("selectionCleared");
//     },
//   },
// };

// const {
//   Provider: UserDataTableProvider,

//   useDataTableContext: useUserDataTable,
// } = createDataTableReactProvider<
//   UserTableTypes,
//   UserTableEvents,
//   UserTableServices,
//   UserTablePlugins,
//   UserTableCommands
// >();
