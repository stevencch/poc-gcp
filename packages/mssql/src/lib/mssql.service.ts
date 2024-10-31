import {
  Inject,
  InternalServerErrorException,
  Logger,
  OnModuleInit,
} from '@nestjs/common';
import { MssqlSecrets } from '../config';
import { ConnectionPool } from 'mssql';
import EventEmitter = require('node:events');
import { VAULT_SECRETS } from '@poc-gcp/vault';

export class MssqlService implements OnModuleInit {
  private pool?: ConnectionPool;
  private readonly logger = new Logger(MssqlService.name);
  constructor(
    @Inject(VAULT_SECRETS)
    private readonly secrets: MssqlSecrets
  ) {}

  onModuleInit() {
    if (!this.secrets.mssql_connection_string) {
      throw new Error('Missing required mssql_connection_string secret');
    }
  }

  async getConnection() {
    if (!this.pool) {
      const { mssql_connection_string } = this.secrets;
      this.pool = new ConnectionPool(mssql_connection_string);
    }
    return await this.pool.connect();
  }

  async getItems(query: string): Promise<any[]> {
    const connection = await this.getConnection();
    const result = await connection.request().query(query);
    return result.recordset;
  }

  async executeStoredProc(procName: string, inputParams: object = {}) {
    try {
      const connection = await this.getConnection();
      const request = connection.request();
      request.stream = true;

      Object.entries(inputParams).forEach(([key, value]) =>
        request.input(key, value)
      );

      request.execute(procName);

      const resultStream = new EventEmitter();
      request.on('row', (row: { [key: string]: any }) => {
        resultStream.emit('row', row);
      });

      request.on('done', () => {
        resultStream.emit('finish');
      });

      request.on('error', (error) => {
        resultStream.emit('error', error);
      });

      return resultStream;
    } catch (e) {
      const message = e instanceof Error ? e.message : undefined;
      this.logger.error(
        `Failed to execute stored procedure "${procName}". Error: ${message}`
      );
      throw new InternalServerErrorException(
        `Failed to execute stored procedure "${procName}".`,
        { cause: e, description: message }
      );
    }
  }
}
