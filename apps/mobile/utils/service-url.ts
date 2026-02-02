import * as Device from "expo-device";

import { getServiceEndPoint } from "@repo/utils/server";

export const withServiceUrl = (url: string) => {
  const prefixedUrl = getServiceEndPoint(undefined, {
    clientEnvPrefix: "EXPO_PUBLIC_",
    baseUrl:
      Device.osName === "Android" && __DEV__
        ? "http://10.0.2.2:3001/api/v1"
        : undefined,
  });
  const urlWithStartSlash = url.startsWith("/") ? url : `/${url}`;
  return `${prefixedUrl}${urlWithStartSlash}`;
};
