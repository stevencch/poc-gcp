import { Inject, Injectable, InternalServerErrorException, Logger } from "@nestjs/common";
import { CommercetoolsConfig, CommercetoolsSecrets } from "./commercetools.config";
import { VAULT_SECRETS } from "@poc-gcp/vault";
import { ConfigType } from "@nestjs/config";
import { createApiBuilderFromCtpClient, ByProjectKeyRequestBuilder, Order } from "@commercetools/platform-sdk";
import { ClientBuilder, HttpErrorType } from "@commercetools/sdk-client-v2";

@Injectable()
export class CommercetoolsService {
    constructor(
        @Inject(CommercetoolsConfig.KEY)
        private readonly config: ConfigType<typeof CommercetoolsConfig>,
        @Inject(VAULT_SECRETS)
        private readonly secrets: CommercetoolsSecrets
      ) {}
      private readonly logger = new Logger(CommercetoolsService.name);
      private projectApiRoot!: ByProjectKeyRequestBuilder;
      onModuleInit() {
        if (!this.secrets?.ct_client_id) {
          //TODO throw error
          //throw new Error('Missing required ct_client_id secret');
          this.logger.error('Missing required ct_client_id secret');
        }
    
        if (!this.secrets?.ct_client_secret) {
          //TODO throw error
          //throw new Error('Missing required ct_client_secret secret');
          this.logger.error('Missing required ct_client_secret secret');
        }
    
        if (!this.secrets?.ct_scopes) {
          //TODO throw error
          //throw new Error('Missing required ct_scopes secret');
          this.logger.error('Missing required ct_scopes secret');
        }
    
        this.projectApiRoot = createApiBuilderFromCtpClient(
          new ClientBuilder()
            .withClientCredentialsFlow({
              host: this.config.authUrl,
              projectKey: this.config.projectKey,
              credentials: {
                clientId: this.secrets?.ct_client_id || "",
                clientSecret: this.secrets?.ct_client_secret || "",
              },
              scopes: this.secrets?.ct_scopes ? this.secrets.ct_scopes.split(' ') : [],
            })
            .withHttpMiddleware({ host: this.config.apiUrl })
            .build()
        ).withProjectKey({ projectKey: this.config.projectKey });
    
        this.logger.log('Loaded configuration for commercetools SDK client.');
      }

      async getOrderByOrderNumber(
        orderNumber: string
      ): Promise<Order | null> {
        this.logger.log(`Retrieving CT Order for '${orderNumber}'`);
        
        try {
          const clientResponse = await this.projectApiRoot
            .orders()
            .withId({ ID: orderNumber })
            .get()
            .execute();
          return clientResponse.body;
        } catch (error) {
          return this.handleOrderRetrievalError(error, orderNumber);
        }
      }

      private handleOrderRetrievalError(error: unknown, orderNumber: string): null {
        let message: string;
      
        if (CommercetoolsService.isHttpErrorType(error) && error.statusCode === 404) {
          message = `Order with orderNumber '${orderNumber}' does not exist in commercetools.`;
          this.logger.error(message);
          return null;
        }
      
        message = error instanceof Error ? error.message : 'An unknown error occurred';
        this.logger.error(message);
      
        throw new InternalServerErrorException(
          'Request to commercetools Get OrderEntry API failed',
          { cause: error, description: message }
        );
      }

      private static isHttpErrorType(
        obj: unknown
      ): obj is HttpErrorType {
        return (
          typeof obj === 'object' && 
          obj !== null &&
          'name' in obj &&
          'message' in obj &&
          'code' in obj &&
          'status' in obj &&
          'statusCode' in obj &&
          'originalRequest' in obj
        );
      }
}