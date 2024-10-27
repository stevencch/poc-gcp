import { Test, TestingModule } from '@nestjs/testing';
import { MssqlService } from './mssql.service';
import { InternalServerErrorException } from '@nestjs/common';
import { VAULT_SECRETS } from '@poc-gcp/vault';

const mockInput = jest.fn();
const mockExecute = jest.fn();
const mockSuccessRequest = jest.fn(() => ({
  input: mockInput,
  execute: mockExecute,
  on: jest.fn((event: string, listener: (arg?: any) => void) => {
    if (event === 'row') {
      listener({
        PRODUCT_CODE: 1,
        SOH: 9,
        StoreId: 1,
        DateStamp: '14/04/24 09:50:16',
      });
      listener({
        PRODUCT_CODE: 2,
        SOH: 10,
        StoreId: 1,
        DateStamp: '14/04/24 09:50:16',
      });
      return;
    }

    if (event === 'done') {
      listener();
    }
  }),
}));
const mockFailureRequest = jest.fn(() => ({
  execute: mockExecute,
  on: jest.fn((event: string, listener: (arg?: any) => void) => {
    if (event === 'error') {
      listener(new Error('Test error'));
    }
    return;
  }),
}));
const mockConnection = jest.fn();
const mockPool = { connect: mockConnection };
jest.mock('mssql', () => ({
  ConnectionPool: jest.fn(() => mockPool),
}));

const originalEnv = process.env;

describe('MssqlService', () => {
  let service: MssqlService;

  beforeEach(async () => {
    process.env = {
      ...originalEnv,
      MSSQL_CONNECTION_STRING: 'test-string',
    };
    jest.clearAllMocks();
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MssqlService,
        {
          provide: VAULT_SECRETS,
          useValue: {
            mssql_connection_string: 'test_connection_string',
          },
        },
      ],
    }).compile();

    service = module.get<MssqlService>(MssqlService);
    jest.spyOn(service['logger'], 'error').mockImplementation();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should execute stored procedure successfully', async () => {
    mockConnection.mockImplementation(
      jest.fn(() => ({ request: mockSuccessRequest }))
    );

    await service.executeStoredProc('myStoredProcedure');

    expect(mockPool).toBeDefined();
    expect(mockInput).not.toHaveBeenCalled();
    expect(mockExecute).toHaveBeenCalledWith('myStoredProcedure');
  });

  it('should execute stored procedure with parameters', async () => {
    mockConnection.mockImplementation(
      jest.fn(() => ({ request: mockSuccessRequest }))
    );

    await service.executeStoredProc('myStoredProcedure', {
      foo: 'bar',
      baz: 'qux',
    });

    expect(mockPool).toBeDefined();
    expect(mockInput).toHaveBeenCalledTimes(2);
    expect(mockInput).toHaveBeenCalledWith('foo', 'bar');
    expect(mockInput).toHaveBeenCalledWith('baz', 'qux');
    expect(mockExecute).toHaveBeenCalledWith('myStoredProcedure');
  });

  it('should throw InternalServerErrorException if request emits error', async () => {
    mockConnection.mockImplementation(
      jest.fn(() => ({ request: mockFailureRequest }))
    );

    await expect(
      service.executeStoredProc('myStoredProcedure')
    ).rejects.toThrow(InternalServerErrorException);
  });

  it('should throw InternalServerErrorException on error', async () => {
    mockConnection.mockImplementation(
      jest.fn(() => {
        throw new Error('Connection error');
      })
    );
    await expect(
      service.executeStoredProc('myStoredProcedure')
    ).rejects.toThrow(InternalServerErrorException);

    mockConnection.mockImplementation(
      jest.fn(() => {
        throw 'Connection error';
      })
    );
    await expect(
      service.executeStoredProc('myStoredProcedure')
    ).rejects.toThrow(InternalServerErrorException);
  });
});
