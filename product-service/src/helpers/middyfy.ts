import middy, { MiddyfiedHandler } from '@middy/core';
import httpErrorHandler from '@middy/http-error-handler';
import httpHeaderNormalizer from '@middy/http-header-normalizer';

export function middyfy(func): MiddyfiedHandler {
  return middy(func)
    .use(httpHeaderNormalizer())
    .use(httpErrorHandler())
}