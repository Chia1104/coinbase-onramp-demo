export interface ErrorResponse {
  status?: number;
  code: string;
  errors?:
    | {
        field: string;
        message: string;
        code?: string;
      }[]
    | null;
}

export const errorConfig = {
  400: "Bad Request",
  401: "Unauthorized",
  403: "Forbidden",
  404: "Not Found",
  405: "Method Not Allowed",
  408: "Request Timeout",
  429: "Too Many Requests",
  500: "Internal Server Error",
  501: "Not Implemented",
  503: "Service Unavailable",
} as const;

export function errorGenerator(
  statusCode: number,
  errors?: ErrorResponse["errors"]
): ErrorResponse {
  if (!(statusCode in errorConfig)) {
    return {
      code: "Unknown",
      status: statusCode,
      errors,
    };
  }
  return {
    code: errorConfig[statusCode as keyof typeof errorConfig] ?? "Unknown",
    status: statusCode,
    errors,
  };
}

export class ParsedJSONError extends Error {
  constructor(public error: ErrorResponse) {
    super("Parsed JSON error");
  }
}

export const getClientIP = (request: Request): string => {
  return (
    request.headers.get("CF-Connecting-IP") ??
    request.headers.get("X-Forwarded-For")?.split(",")[0] ??
    request.headers.get("X-Real-IP") ??
    "anonymous"
  );
};

const getInternalEnv = () => {
  if (process.env.ENV) {
    return process.env.ENV;
  }
  if (process.env.NEXT_PUBLIC_ENV) {
    return process.env.NEXT_PUBLIC_ENV;
  }
  if (process.env.NEXT_PUBLIC_VERCEL_ENV) {
    return process.env.NEXT_PUBLIC_VERCEL_ENV;
  }
  if (process.env.RAILWAY_ENVIRONMENT_NAME) {
    return process.env.RAILWAY_ENVIRONMENT_NAME === "production"
      ? "railway-prod"
      : "railway-dev";
  }
  if (process.env.ZEABUR_ENVIRONMENT_NAME) {
    return process.env.ZEABUR_ENVIRONMENT_NAME === "production"
      ? "zeabur-prod"
      : "zeabur-dev";
  }
};

export const getEnv = (env?: string) =>
  env ??
  process.env.VERCEL_ENV ??
  getInternalEnv() ??
  process.env.NODE_ENV ??
  "local";

export const switchEnv = <TResult = unknown>(
  env: string | undefined,
  {
    prod,
    beta,
    local,
  }: {
    prod: () => TResult;
    beta: () => TResult;
    local: () => TResult;
  }
) => {
  switch (getEnv(env)) {
    case "railway-prod":
    case "zeabur-prod":
    case "production":
    case "prod": {
      return prod();
    }
    case "railway-dev":
    case "zeabur-dev":
    case "preview":
    case "beta": {
      return beta();
    }
    case "test":
    case "development":
    case "local": {
      return local();
    }
    default:
      throw new Error(`Unknown env: ${env}`);
  }
};

function removeEndSlash(url: string) {
  return url.replace(/\/$/, "");
}

function switchServiceVersion(version: ServiceVersion, url: string) {
  switch (version) {
    case "v1":
      return removeEndSlash(url) + "/api/v1";
    default:
      return removeEndSlash(url);
  }
}

type ServiceVersion = "v1";

export interface GetServiceEndPointOptions {
  proxyEndpoint?: string;
  version?: ServiceVersion;
  isInternal?: boolean;
  clientEnvPrefix?: string;
  baseUrl?: string;
}

/**
 * the url of the service endpoint (including the protocol)
 * @param env
 * @param options {proxyEndpoint, version, isInternal}
 * @default version = "v1"
 * if you are use `v1` version, the url path will be `/api/v1` (e.g. `https://example.com/api/v1`)
 */
export const getServiceEndPoint = (
  env?: string,
  options?: GetServiceEndPointOptions
) => {
  const isServer =
    typeof (globalThis as { window?: unknown }).window === "undefined";
  const {
    proxyEndpoint = process.env.NEXT_PUBLIC_SERVICE_PROXY_ENDPOINT,
    version = "v1",
    isInternal,
    clientEnvPrefix = "NEXT_PUBLIC_",
    baseUrl,
  } = options ?? {};

  if (baseUrl) {
    return baseUrl;
  }

  return switchEnv(env, {
    prod: () => {
      if (isServer || isInternal) {
        if (!process.env.INTERNAL_SERVICE_ENDPOINT)
          throw new Error("Missing env variables INTERNAL_SERVICE_ENDPOINT");
        return switchServiceVersion(
          version,
          process.env.INTERNAL_SERVICE_ENDPOINT
        );
      }
      if (proxyEndpoint) {
        return switchServiceVersion(version, proxyEndpoint);
      }
      if (!process.env[`${clientEnvPrefix}SERVICE_ENDPOINT`])
        throw new Error(
          `Missing env variables ${clientEnvPrefix}SERVICE_ENDPOINT`
        );
      return switchServiceVersion(
        version,
        process.env[`${clientEnvPrefix}SERVICE_ENDPOINT`] ?? ""
      );
    },
    beta: () => {
      if (isServer || isInternal) {
        if (!process.env.INTERNAL_SERVICE_ENDPOINT)
          throw new Error("Missing env variables INTERNAL_SERVICE_ENDPOINT");
        return switchServiceVersion(
          version,
          process.env.INTERNAL_SERVICE_ENDPOINT
        );
      }
      if (!process.env[`${clientEnvPrefix}SERVICE_ENDPOINT`])
        throw new Error(
          `Missing env variables ${clientEnvPrefix}SERVICE_ENDPOINT`
        );
      return switchServiceVersion(
        version,
        process.env[`${clientEnvPrefix}SERVICE_ENDPOINT`] ?? ""
      );
    },
    local: () => {
      if (isServer || isInternal) {
        if (!process.env.INTERNAL_SERVICE_ENDPOINT)
          throw new Error("Missing env variables INTERNAL_SERVICE_ENDPOINT");
        return switchServiceVersion(
          version,
          process.env.INTERNAL_SERVICE_ENDPOINT
        );
      }
      if (!process.env[`${clientEnvPrefix}SERVICE_ENDPOINT`])
        throw new Error(
          `Missing env variables ${clientEnvPrefix}SERVICE_ENDPOINT`
        );
      return switchServiceVersion(
        version,
        process.env[`${clientEnvPrefix}SERVICE_ENDPOINT`] ?? ""
      );
    },
  });
};
