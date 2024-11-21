// istanbul ignore file
import { Inject, Injectable, Logger } from '@nestjs/common';
import fetch from 'node-fetch';
import * as https from 'https';
import { v4 as uuidv4 } from 'uuid';
import {
  type Client,
  ClientBuilder,
  MiddlewareRequest,
  Next,
} from '@commercetools/ts-client';
import { createApiBuilderFromCtpClient } from '@commercetools/platform-sdk';
import { CommercetoolsVaultSecrets } from './ct.types';
import { ByProjectKeyRequestBuilder } from '@commercetools/platform-sdk/dist/declarations/src/generated/client/by-project-key-request-builder';
import { isRunningLocally } from '@poc-gcp/common';
import { ctLoggerMiddlewareOptions } from './utils';
@Injectable()
export class CtService {
  private readonly logger = new Logger(CtService.name);

  constructor(

  ) {}

  // Custom fetch function to keep the connection persistent
  customFetch() {
    const keepAliveAgent = new https.Agent({
      keepAlive: true,
    });

    return (url: string, options = {}) => {
      return fetch(url, { ...options, agent: keepAliveAgent });
    };
  }

  mockMiddleware() {
    return (next: Next) => async (request: MiddlewareRequest) => {
      const url = process.env.FUNCTIONAL_TESTS_ENABLED
        ? 'https://api.australia-southeast1.gcp.commercetools.com/cwr-au-dev/graphql'
        : 'https://api.australia-southeast1.gcp.commercetools.com/cwr-au-dev/graphql';
      if (request.body == undefined) {
        return next({ ...request });
      }

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const bodyString = request.body as any;
      const fetchOptions = {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          query: bodyString.query,
          variables: bodyString.variables,
        }),
      };

      try {
        const res = await fetch(url, fetchOptions);
        const data = await res.json();
        return next({ response: { body: data }, ...request });
      } catch (error) {
        console.error('Error:', error);
        throw error;
      }
    };
  }

  async getClient(): Promise<ByProjectKeyRequestBuilder> {
    const scopeslist="manage_orders:cwr-au-dev";

    const customFetch = this.customFetch();


    const  scopes = scopeslist.split(' ');


    const authMiddlewareOptions = {
      host: `https://auth.australia-southeast1.gcp.commercetools.com`,
      projectKey: "cwr-au-dev",
      credentials: {
        clientId: "j9MAmmivxtXsk9we3dxR1By-",
        clientSecret: "CzP3TjmZw-xSsCDmBAuLy9LhOKKmQ1Tn",
      },
      scopes,
      httpClient: customFetch,
    };

    const httpMiddlewareOptions = {
      host: `https://api.australia-southeast1.gcp.commercetools.com`,
      httpClient: customFetch,
    };

    const ctpClient: Client = new ClientBuilder()
      .withClientCredentialsFlow(authMiddlewareOptions)
      .withLoggerMiddleware(ctLoggerMiddlewareOptions)
      .withCorrelationIdMiddleware({
        generate: () => uuidv4(),
      })
      .withHttpMiddleware(httpMiddlewareOptions)
      .withConcurrentModificationMiddleware()
      .build();

    const ctpApiBuilder = createApiBuilderFromCtpClient(
      ctpClient
    ).withProjectKey({ projectKey: "cwr-au-dev" });

    return ctpApiBuilder;
  }
}
