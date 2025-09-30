/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  // CreateParams,
  CreateResult,
  DataProvider,
  fetchUtils,
  Identifier,
  RaRecord,
} from "react-admin";
import { authProvider } from "./authProvider";
import { StatusCodes } from "http-status-codes";
import FormSerializer from "@/utils/formData";

// const API_URL = process.env.API_URL; // Define your API URL here
const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000/api/v1";

interface GetListParams {
  pagination?: { page: number; perPage: number };
  sort?: { field: string; order: "asc" | "desc" | "ASC" | "DESC" };
  filter?: Record<string, unknown>;
  meta?: Record<string, unknown>; // request metadata
  signal?: AbortSignal;
}

interface GetListResult {
  data: Record<string, unknown>[];
  total?: number;
  // if using partial pagination
  pageInfo?: {
    hasNextPage?: boolean;
    hasPreviousPage?: boolean;
  };
  meta?: Record<string, unknown>; // response metadata
}

interface GetManyReferenceParams extends GetListParams {
  target: string;
  id: Identifier;
}

interface CreateParams<T = any> {
  data: T;
  picture?: { rawFile: File; src?: string; title?: string };
}

interface UpdateParams<T extends RaRecord = any> {
  id: Identifier;
  data: T;
  previousData: T;
  picture?: { rawFile: File; src?: string; title?: string };
}

interface UpdateManyParams<T extends RaRecord = any> {
  ids: Identifier[];
  data: Partial<T>;
}

// const createPostFormData = <T extends RaRecord>(
//   params: CreateParams<T> | UpdateParams<T>,
// ) => {
//   const formData = new FormData();

//   // Handle special case for file upload
//   if (params.data.file?.rawFile) {
//     formData.append("file", params.data.file.rawFile);
//   }

//   // Convert all other data to FormData
//   Object.entries(params.data).forEach(([key, value]) => {
//     if (key !== "file") {
//       // Skip file as it's handled separately
//       appendFormData(formData, key, value);
//     }
//   });

//   return formData;
// };

const createPostFormData = <T extends RaRecord>(
  params: CreateParams<T> | UpdateParams<T>
): FormData => {
  const formData = new FormData();

  // Handle special case for file upload
  if (params.data.file?.rawFile) {
    formData.append("file", params.data.file.rawFile);
  }

  // Convert all other data to FormData
  Object.entries(params.data).forEach(([key, value]) => {
    if (key !== "file") {
      // Skip file as it's handled separately
      FormSerializer.serialize(value, {}, formData, key);
    }
  });
  return formData;
};

// Enhanced httpClient with automatic token handling
const httpClient = async (url: string, options: fetchUtils.Options = {}) => {
  // Get stored tokens
  const tokens = JSON.parse(localStorage.getItem("oidc_tokens") || "{}");

  if (!options.headers) {
    options.headers = new Headers({ Accept: "application/json" });
  }

  // Add authorization header if we have an access token
  if (tokens.accessToken) {
    (options.headers as Headers).set(
      "Authorization",
      `Bearer ${tokens.accessToken}`
    );
  }

  // Handle token refresh on 401
  try {
    const response = await fetchUtils.fetchJson(url, options);
    return response;
  } catch (error: any) {
    if (error.status === StatusCodes.UNAUTHORIZED) {
      // Token might be expired, let auth provider handle it
      await authProvider.checkAuth();

      // Retry the request with potentially refreshed token
      const refreshedTokens = JSON.parse(
        localStorage.getItem("oidc_tokens") || "{}"
      );
      if (refreshedTokens.accessToken) {
        (options.headers as Headers).set(
          "Authorization",
          `Bearer ${refreshedTokens.accessToken}`
        );
        return fetchUtils.fetchJson(url, options);
      }
    }
    throw error;
  }
};

export const dataProvider: DataProvider = {
  getList: async (resource: string, params: GetListParams) => {
    const { field, order } = params.sort || { field: "", order: "" };
    const { pagination } = params;
    if (!pagination) {
      throw new Error("Pagination is required");
    }
    const { page, perPage } = pagination;
    const url = `${API_URL}/${resource}?page=${page}&limit=${perPage}&sort=${field}&order=${order}`;
    const response = await httpClient(url);
    // .then(({ headers, json }) => ({
    //   data: json,
    //   total: parseInt(headers.get("X-Total-Count") || "0", 10), // Adjust based on your API
    // }));
    // const response = await fetchUtils.fetchJson(
    //   `${API_URL}/${resource}?page=${page}&limit=${perPage}&sort=${field}&order=${order}`
    // );
    const json = response.json;
    const { data, metadata } = json.data;
    return {
      data: data,
      total: parseInt(metadata.totalItems || "0", 10),
      // total: parseInt(response.headers.get("X-Total-Count") || "0", 10),
      pageInfo: {
        hasNextPage: metadata.hasNextPage,
        hasPreviousPage: metadata.hasPreviousPage,
      },
      meta: metadata, // response metadata
    };
  },
  getOne: async (resource: string, params: { id: Identifier }) => {
    // const response = await fetchUtils.fetchJson(
    //   `${API_URL}/${resource}/${params.id}`
    // );
    const response = await httpClient(`${API_URL}/${resource}/${params.id}`);
    return {
      data: response.json.data,
    };
  },
  getMany: async (resource: string, params: { ids: Identifier[] }) => {
    const query = {
      filter: JSON.stringify({ id: params.ids }),
    };
    // const response = await fetchUtils.fetchJson(
    //   `${API_URL}/${resource}?${fetchUtils.queryParameters(query)}`
    // );
    const url = `${API_URL}/${resource}?${fetchUtils.queryParameters(query)}`;
    return httpClient(url).then(({ json }) => ({
      data: json,
    }));
    // return {
    //   data: response.json,
    // };
  },
  getManyReference: async (
    resource: string,
    params: GetManyReferenceParams
  ) => {
    const { field, order } = params.sort || { field: "", order: "" };
    if (!params.pagination) {
      throw new Error("Pagination is required");
    }
    const { page, perPage } = params.pagination;
    const query = {
      ...fetchUtils.flattenObject(params.filter),
      [params.target]: params.id,
      _sort: field,
      _order: order,
      _page: page,
      _limit: perPage,
      // sort: JSON.stringify([field, order]),
      // range: JSON.stringify([(page - 1) * perPage, page * perPage - 1]),
      // filter: JSON.stringify({
      //   ...params.filter,
      //   [params.target]: params.id,
      // }),
    };
    const url = `${API_URL}/${resource}?${fetchUtils.queryParameters(query)}`;
    // const response = await fetchUtils.fetchJson(
    //   `${API_URL}/${resource}?${fetchUtils.queryParameters(query)}`
    // );
    // return {
    //   data: response.json,
    //   total: parseInt(response.headers.get("X-Total-Count") || "0", 10),
    // };
    return httpClient(url).then(({ headers, json }) => ({
      data: json,
      total: parseInt(
        (headers.get("content-range") || "0").split("/").pop() || "0",
        10
      ),
    }));
  },
  create: async <T extends RaRecord>(
    resource: string,
    params: CreateParams
  ) => {
    // return {
    //   data: { ...params.data, id: response.json.id } as T,
    // };
    const req: RequestInit = {
      method: "POST",
    };

    req.body = FormSerializer.hasFileField(params.data)
      ? createPostFormData(params)
      : JSON.stringify(params.data);

    console.log(params.data);

    return httpClient(`${API_URL}/${resource}`, req).then(({ json }) => ({
      data: json.data as T,
    }));

    // const response = await fetchUtils.fetchJson(`${API_URL}/${resource}`, req);

    // if (response.status !== 200) {
    //   throw new Error(`Error Creating ${resource}`);
    // }

    // return {
    //   data: response.json.data as T,
    // };
  },
  update: async <T extends RaRecord>(
    resource: string,
    params: UpdateParams<T>
  ) => {
    // if (
    //   resource === "user" ||
    //   resource === "category" ||
    //   resource === "subCategory" ||
    //   resource === "manufacturer" ||
    //   resource === "productType" ||
    //   resource === "product"
    // ) {
    //   const formData = createPostFormData(params);
    //   const response = await fetchUtils.fetchJson(`${API_URL}/${resource}`, {
    //     method: "PUT",
    //     body: formData,
    //   });
    //   return { data: response.json.data };
    // }
    // const response = await fetchUtils.fetchJson(`${API_URL}/${resource}`, {
    //   method: "PUT",
    //   body: JSON.stringify(params.data),
    // });
    // return {
    //   data: response.json.data,
    // };
    const req: RequestInit = {
      method: "PUT",
    };

    req.body = FormSerializer.hasFileField(params.data)
      ? createPostFormData(params)
      : JSON.stringify(params.data);

    return httpClient(`${API_URL}/${resource}`, req).then(({ json }) => ({
      data: json.data as T,
    }));

    // const response = await fetchUtils.fetchJson(`${API_URL}/${resource}`, req);

    // if (response.status !== 200) {
    //   throw new Error(`Error updating ${resource}`);
    // }

    // return {
    //   data: response.json.data,
    // };
  },
  updateMany: async <T extends RaRecord>(
    resource: string,
    params: UpdateManyParams<T>
  ) => {
    const responses = await Promise.all(
      params.ids.map((id) =>
        // fetchUtils.fetchJson(`${API_URL}/${resource}/${id}`, {
        //   method: "PUT",
        //   body: JSON.stringify(params.data),
        // })
        httpClient(`${API_URL}/${resource}/${id}`, {
          method: "PUT",
          body: JSON.stringify(params.data),
        })
      )
    );
    return {
      data: responses.map((response) => response.json.id),
    };
  },
  delete: async (resource: string, params: { id: Identifier }) => {
    return httpClient(`${API_URL}/${resource}/${params.id}`, {
      method: "DELETE",
    }).then(({ json }) => ({ data: json }));
    // const response = await fetchUtils.fetchJson(
    //   `${API_URL}/${resource}/${params.id}`,
    //   {
    //     method: "DELETE",
    //   }
    // );
    // return {
    //   data: response.json,
    // };
  },
  deleteMany: async (resource: string, params: { ids: Identifier[] }) => {
    const responses = await Promise.all(
      params.ids.map((id) =>
        // fetchUtils.fetchJson(`${API_URL}/${resource}/${id}`, {
        //   method: "DELETE",
        // })
        httpClient(`${API_URL}/${resource}/${id}`, {
          method: "DELETE",
        })
      )
    );
    return {
      data: responses.map((response) => response.json.id),
    };
  },
};

// export const dataProvider: DataProvider = {
//   ...baseDataProvider,
//   create: (resource, params) => {
//     if (resource === "posts") {
//       const formData = createPostFormData(params);
//       return fetchUtils
//         .fetchJson(`${endpoint}/${resource}`, {
//           method: "POST",
//           body: formData,
//         })
//         .then(({ json }) => ({ data: json }));
//     }
//     return baseDataProvider.create(resource, params);
//   },
//   update: (resource, params) => {
//     if (resource === "posts") {
//       const formData = createPostFormData(params);
//       formData.append("id", params.id);
//       return fetchUtils
//         .fetchJson(`${endpoint}/${resource}`, {
//           method: "PUT",
//           body: formData,
//         })
//         .then(({ json }) => ({ data: json }));
//     }
//     return baseDataProvider.update(resource, params);
//   },
// };

// export const dataProvider: DataProvider = {
//   getList: (resource, params) => {
//     const { page, perPage } = params.pagination;
//     const { field, order } = params.sort;
//     const query = {
//       sort: JSON.stringify([field, order]),
//       range: JSON.stringify([(page - 1) * perPage, page * perPage - 1]),
//       filter: JSON.stringify(params.filter),
//     };
//     const url = `${apiUrl}/${resource}?${stringify(query)}`;

//     return httpClient(url).then(({ headers, json }) => ({
//       data: json,
//       total: parseInt(
//         (headers.get("content-range") || "0").split("/").pop() || "0",
//         10
//       ),
//     }));
//   },

//   getOne: (resource, params) =>
//     httpClient(`${apiUrl}/${resource}/${params.id}`).then(({ json }) => ({
//       data: json,
//     })),

//   getMany: (resource, params) => {
//     const query = {
//       filter: JSON.stringify({ id: params.ids }),
//     };
//     const url = `${apiUrl}/${resource}?${stringify(query)}`;
//     return httpClient(url).then(({ json }) => ({ data: json }));
//   },

//   getManyReference: (resource, params) => {
//     const { page, perPage } = params.pagination;
//     const { field, order } = params.sort;
//     const query = {
//       sort: JSON.stringify([field, order]),
//       range: JSON.stringify([(page - 1) * perPage, page * perPage - 1]),
//       filter: JSON.stringify({
//         ...params.filter,
//         [params.target]: params.id,
//       }),
//     };
//     const url = `${apiUrl}/${resource}?${stringify(query)}`;

//     return httpClient(url).then(({ headers, json }) => ({
//       data: json,
//       total: parseInt(
//         (headers.get("content-range") || "0").split("/").pop() || "0",
//         10
//       ),
//     }));
//   },

//   update: (resource, params) =>
//     httpClient(`${apiUrl}/${resource}/${params.id}`, {
//       method: "PUT",
//       body: JSON.stringify(params.data),
//     }).then(({ json }) => ({ data: json })),

//   updateMany: (resource, params) => {
//     const query = {
//       filter: JSON.stringify({ id: params.ids }),
//     };
//     return httpClient(`${apiUrl}/${resource}?${stringify(query)}`, {
//       method: "PUT",
//       body: JSON.stringify(params.data),
//     }).then(({ json }) => ({ data: json }));
//   },

//   create: (resource, params) =>
//     httpClient(`${apiUrl}/${resource}`, {
//       method: "POST",
//       body: JSON.stringify(params.data),
//     }).then(({ json }) => ({
//       data: { ...params.data, id: json.id },
//     })),

//   delete: (resource, params) =>
//     httpClient(`${apiUrl}/${resource}/${params.id}`, {
//       method: "DELETE",
//     }).then(({ json }) => ({ data: json })),

//   deleteMany: (resource, params) => {
//     const query = {
//       filter: JSON.stringify({ id: params.ids }),
//     };
//     return httpClient(`${apiUrl}/${resource}?${stringify(query)}`, {
//       method: "DELETE",
//     }).then(({ json }) => ({ data: json }));
//   },
// };

export default dataProvider;
