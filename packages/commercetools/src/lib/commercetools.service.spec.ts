import * as nock from 'nock';
import { Test, TestingModule } from '@nestjs/testing';
import { VAULT_SECRETS } from '@poc-gcp/vault';
import { CommercetoolsService } from './commercetools.service';
import { CommercetoolsConfig } from './commercetools.config';
import { ApiRoot, Order, Payment, Transaction, TransactionType } from '@commercetools/platform-sdk';
import { InternalServerErrorException } from '@nestjs/common';

const originalEnv = process.env;

type MockProjectApiRoot = {
  orders: jest.Mock;
  withId: jest.Mock;
  post: jest.Mock;
  execute: jest.Mock;
};

describe('CommercetoolsService', () => {
  let service: CommercetoolsService;
  let apiScope: nock.Scope;
  let mockProjectApiRoot:jest.Mocked<Partial<ApiRoot>> & MockProjectApiRoot;
  let consoleErrorSpy: jest.SpyInstance;

  beforeEach(async () => {
    mockProjectApiRoot = {
      orders: jest.fn().mockReturnThis(),
      withId: jest.fn().mockReturnThis(),
      post: jest.fn().mockReturnThis(),
      execute: jest.fn(),
    };

    process.env = {
      ...originalEnv,
      CT_API_URL: 'http://api.commercetools.com/',
      CT_AUTH_URL: 'http://auth.commercetools.com/',
      CT_PROJECT_KEY: 'project',
    };

    jest.resetAllMocks();
    nock.cleanAll();

    nock('http://auth.commercetools.com')
      .post('/oauth/token')
      .reply(200, {
        access_token: 'access_token',
      })
      .persist();

    apiScope = nock('http://api.commercetools.com');

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CommercetoolsService,
        {
          provide: CommercetoolsConfig.KEY,
          useValue: CommercetoolsConfig(),
        },
        {
          provide: VAULT_SECRETS,
          useValue: {
            ct_client_id: 'foo',
            ct_client_secret: 'bar',
            ct_scopes: 'manage_orders:project',
          },
        },
        {
          provide: 'PROJECT_API_ROOT',
          useValue: mockProjectApiRoot,
        },
      ],
    }).compile();

    service = module.get<CommercetoolsService>(CommercetoolsService);
    service.onModuleInit();
    consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('onModuleInit', () => {
    it('should log an error if ct_client_id is missing', () => {
      const loggerSpy = jest.spyOn(service['logger'], 'error');
      
      Object.defineProperty(service, 'secrets', {
        get: jest.fn().mockReturnValue({
          ct_client_secret: 'bar',
          ct_scopes: 'manage_orders:project',
        }),
      });

      service.onModuleInit();

      expect(loggerSpy).toHaveBeenCalledWith('Missing required ct_client_id secret');
    });

    it('should log an error if ct_client_secret is missing', () => {
      const loggerSpy = jest.spyOn(service['logger'], 'error');
      
      Object.defineProperty(service, 'secrets', {
        get: jest.fn().mockReturnValue({
          ct_client_id: 'foo',
          ct_scopes: 'manage_orders:project',
        }),
      });

      service.onModuleInit();

      expect(loggerSpy).toHaveBeenCalledWith('Missing required ct_client_secret secret');
    });

    it('should log an error if ct_scopes is missing', () => {
      const loggerSpy = jest.spyOn(service['logger'], 'error');
      
      Object.defineProperty(service, 'secrets', {
        get: jest.fn().mockReturnValue({
          ct_client_id: 'foo',
          ct_client_secret: 'bar',
        }),
      });

      service.onModuleInit();

      expect(loggerSpy).toHaveBeenCalledWith('Missing required ct_scopes secret');
    });
  });

  describe('getOrderByOrderNumber', () => {
    it('should return true when order exists', async () => {
      // Mocking a successful API response
      const createRequestInterceptor = apiScope
        .get('/project/orders/order-number=CWAUMAXGKJC') // Adjusted to mock GET request for an existing order
        .reply(200, {
          id: '231afe31-9b56-49d1-9a39-fd38a3ab741c',
          version: 1,
          key: 'key-123',
        });

      // Call the method
      const result = await service.getOrderByOrderNumber('CWAUMAXGKJC');

      // Assertions
      expect(result).toEqual({
        id: '231afe31-9b56-49d1-9a39-fd38a3ab741c',
        version: 1,
        key: 'key-123',
      });
      expect(createRequestInterceptor.isDone()).toBeTruthy(); // Ensure the mock was called
    });

    it('should log an error and return null if the order does not exist (404 error)', async () => {
      const orderNumber = 'nonexistent-order';
      const apiScope = nock('http://api.commercetools.com')
        .get(`/project/orders/order-number=${orderNumber}`)
        .reply(404, {
          statusCode: 404,
          message: 'Not Found',
          name: 'HttpError',
          code: 'NotFound',
          status: 404,
        });

      const loggerSpy = jest.spyOn(service['logger'], 'error');

      const result = await service.getOrderByOrderNumber(orderNumber);

      expect(result).toBeNull();
      expect(loggerSpy).toHaveBeenCalledWith(`Order with orderNumber '${orderNumber}' does not exist in commercetools.`);
      expect(apiScope.isDone()).toBeTruthy();
    });

    it('should set message from HTTP error', async () => {
      const orderNumber = 'order-number';
      const error: Error = {
        message: 'Internal Server Error',
        name: 'HttpError',
        stack: 'stack trace',
      };

      // Mock the API call to simulate an HTTP error
      const apiScope = nock('http://api.commercetools.com')
        .get(`/project/orders/order-number=${orderNumber}`)
        .reply(500, error);

      const loggerSpy = jest.spyOn(service['logger'], 'error');

      await expect(service.getOrderByOrderNumber(orderNumber)).rejects.toThrow(
        InternalServerErrorException
      );

      expect(loggerSpy).toHaveBeenCalledWith(error.message);
      expect(apiScope.isDone()).toBeTruthy();
    });
  });

  
});
