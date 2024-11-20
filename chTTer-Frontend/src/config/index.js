import { env } from "./EnviormentConfig";

export const server = env.BASE_URL;
export const API_BASE_URL = env.API_ENDPOINT_URL + "/api/v1";
