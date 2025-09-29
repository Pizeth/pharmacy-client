// in src/components/AdminApp.tsx
"use client"; // remove this line if you choose Pages Router

// import * as React from "react";
// import {
//   Admin,
//   Resource,
//   ListGuesser,
//   EditGuesser,
//   fetchUtils,
// } from "react-admin";
// import postgrestRestProvider, {
//   IDataProviderConfig,
//   defaultPrimaryKeys,
//   defaultSchema,
// } from "@raphiniert/ra-data-postgrest";

// const config: IDataProviderConfig = {
//   apiUrl: "/api/admin",
//   httpClient: fetchUtils.fetchJson,
//   defaultListOp: "eq",
//   primaryKeys: defaultPrimaryKeys,
//   schema: defaultSchema,
// };

// const dataProvider = postgrestRestProvider(config);

// const AdminApp = () => (
//   <Admin dataProvider={dataProvider}>
//     <Resource
//       name="users"
//       list={ListGuesser}
//       edit={EditGuesser}
//       recordRepresentation="name"
//     />
//     <Resource
//       name="posts"
//       list={ListGuesser}
//       edit={EditGuesser}
//       recordRepresentation="title"
//     />
//     <Resource name="comments" list={ListGuesser} edit={EditGuesser} />
//   </Admin>
// );

// export default AdminApp;

import {
  Admin,
  Resource,
  localStorageStore,
  StoreContextProvider,
} from "react-admin";
// import { Layout } from "./Layout";

// import { authProvider } from "./authProvider";
// import { PostList, PostEdit, PostCreate } from "./posts";
// import { UserShow } from "./userDetail";
// import PostIcon from "@mui/icons-material/Book";
import UserIcon from "@mui/icons-material/Group";
import { Layout } from "./CustomComponents/Layout";
import { dataProvider } from "../lib/dataProvider";
import { Dashboard } from "./Dashboard";
import { i18nProvider } from "@/i18n/i18nProvider";
import { darkTheme, lightTheme } from "@/theme/razeth";
import { UserCreate } from "./Users/userCreate";
import { UserShow } from "./Users/userDetail";
import { UserEdit } from "./Users/userEdit";
import { UserList } from "./Users/users";
import { LoginPage } from "./LoginPage";

const store = localStorageStore(undefined, "ECommerce");

// const theme = {
//   ...defaultTheme,
//   components: {
//     ...defaultTheme.components,
//     MuiTextField: {
//       defaultProps: {
//         variant: "outlined",
//       },
//     },
//     MuiFormControl: {
//       defaultProps: {
//         variant: "outlined",
//       },
//     },
//   },
// };

export const AdminApp = () => {
  // const [themeName] = useStore<ThemeName>("themename", "soft");
  // const lightTheme = themes.find((theme) => theme.name === themeName)?.light;
  // const darkTheme = themes.find((theme) => theme.name === themeName)?.dark;
  return (
    <Admin
      i18nProvider={i18nProvider}
      layout={Layout}
      dataProvider={dataProvider}
      loginPage={LoginPage}
      // authProvider={authProvider}
      disableTelemetry
      // theme={theme}
      lightTheme={lightTheme}
      darkTheme={darkTheme}
      defaultTheme="dark"
      dashboard={Dashboard}
      store={store}
    >
      {/* <Resource name="posts" list={ListGuesser} /> */}
      {/* <Resource name="users" list={UserList} show={UserShow} icon={UserIcon} /> */}
      <Resource
        name="user"
        list={UserList}
        // list={PostList}
        // create={PostCreate}
        edit={UserEdit}
        // edit={PostEdit}
        show={UserShow}
        create={UserCreate}
        icon={UserIcon}
      />
    </Admin>
  );
};

const AppWrapper = () => (
  <StoreContextProvider value={store}>
    <AdminApp />
  </StoreContextProvider>
);

export default AppWrapper;
