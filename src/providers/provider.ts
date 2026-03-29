import {
  axiosInstance,
  buildPrismaGetManyQueryParams,
  buildPrismaGetOneQueryParams,
  buildPrismaListQueryParams,
  transformHttpError,
} from "@/utils";
import type { DataProvider, HttpError } from "@refinedev/core";
import type { AxiosInstance } from "axios";
import { stringify } from "query-string";

export const dataProvider = (
  apiUrl: string,
  httpClient: AxiosInstance = axiosInstance
): Required<DataProvider> => ({
  getList: async ({ resource, pagination, filters, sorters, meta }) => {
    const url = `${apiUrl}/${resource}`;

    const searchParams = buildPrismaListQueryParams({
      filters,
      sorters,
      pagination,
      include: meta?.include as Record<string, unknown> | undefined,
      select: meta?.select as Record<string, unknown> | undefined,
    });
    const qs = searchParams.toString();

    const { data } = await httpClient.get(qs ? `${url}?${qs}` : url);

    if (Array.isArray(data)) {
      return {
        data,
        total: data.length,
      };
    }
    return {
      data: data.results,
      total: data.totalItems,
    };
  },

  getMany: async ({ resource, ids, meta }) => {
    const url = `${apiUrl}/${resource}`;

    const searchParams = buildPrismaGetManyQueryParams(ids, {
      include: meta?.include as Record<string, unknown> | undefined,
      select: meta?.select as Record<string, unknown> | undefined,
    });
    const qs = searchParams.toString();

    const { data } = await httpClient.get(qs ? `${url}?${qs}` : url);

    return {
      data: data.results,
      total: data.totalItems,
    };
  },

  create: async ({ resource, variables }) => {
    const url = `${apiUrl}/${resource}`;

    try {
      const { data } = await httpClient.post(url, variables);

      return {
        data,
      };
    } catch (error) {
      const httpError = transformHttpError(error);

      throw httpError;
    }
  },

  update: async ({ resource, id, variables }) => {
    const url = `${apiUrl}/${resource}/${id}`;

    try {
      const { data } = await httpClient.patch(url, variables);

      return {
        data,
      };
    } catch (error) {
      const httpError = transformHttpError(error);

      throw httpError;
    }
  },

  updateMany: async ({ resource, ids, variables }) => {
    const errors: HttpError[] = [];

    const response = await Promise.all(
      ids.map(async (id) => {
        try {
          const { data } = await httpClient.patch(
            `${apiUrl}/${resource}/${id}`,
            variables
          );
          return data;
        } catch (error) {
          const httpError = transformHttpError(error);

          errors.push(httpError);
        }
      })
    );

    if (errors.length > 0) {
      throw errors;
    }

    return { data: response };
  },

  createMany: async ({ resource, variables }) => {
    const url = `${apiUrl}/${resource}/bulk`;

    try {
      const { data } = await httpClient.post(url, { bulk: variables });

      return {
        data,
      };
    } catch (error) {
      const httpError = transformHttpError(error);

      throw httpError;
    }
  },

  getOne: async ({ resource, id, meta }) => {
    const url = `${apiUrl}/${resource}/${id}`;

    const searchParams = buildPrismaGetOneQueryParams({
      include: meta?.include as Record<string, unknown> | undefined,
      select: meta?.select as Record<string, unknown> | undefined,
    });
    const qs = searchParams.toString();

    const { data } = await httpClient.get(qs ? `${url}?${qs}` : url);

    return {
      data,
    };
  },

  deleteOne: async ({ resource, id }) => {
    const url = `${apiUrl}/${resource}/${id}`;

    const { data } = await httpClient.delete(url);

    return {
      data,
    };
  },

  deleteMany: async ({ resource, ids }) => {
    const response = await Promise.all(
      ids.map(async (id) => {
        const { data } = await httpClient.delete(`${apiUrl}/${resource}/${id}`);
        return data;
      })
    );
    return { data: response };
  },

  getApiUrl: () => {
    return apiUrl;
  },

  custom: async ({
    url,
    method,
    meta,
    filters,
    sorters,
    payload,
    query,
    headers,
  }) => {
    const searchParams = buildPrismaListQueryParams({
      filters,
      sorters,
      include: meta?.include as Record<string, unknown> | undefined,
      select: meta?.select as Record<string, unknown> | undefined,
    });
    const prismaQs = searchParams.toString();

    let requestUrl = url;
    if (prismaQs) {
      requestUrl = `${url}?${prismaQs}`;
    }
    if (query) {
      requestUrl = requestUrl.includes("?")
        ? `${requestUrl}&${stringify(query)}`
        : `${requestUrl}?${stringify(query)}`;
    }

    let axiosResponse;
    switch (method) {
      case "put":
      case "post":
      case "patch":
        axiosResponse = await httpClient[method](url, payload, {
          headers,
        });
        break;
      case "delete":
        axiosResponse = await httpClient.delete(url, {
          data: payload,
          headers: headers,
        });
        break;
      default:
        axiosResponse = await httpClient.get(requestUrl, { headers });
        break;
    }

    const { data } = axiosResponse;

    return Promise.resolve({ data });
  },
});
