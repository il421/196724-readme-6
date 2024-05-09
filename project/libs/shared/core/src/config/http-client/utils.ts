import { GLOBAL_PREFIX } from '@project/core';

export const getServiceUrl = (host: string, port: string, service: string) =>
  `http://${host}:${port}/${GLOBAL_PREFIX}/${service}`;
