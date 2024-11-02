import {
  Inject,
  Injectable,
  Logger,
  OnModuleDestroy,
  OnModuleInit,
} from '@nestjs/common';
import databaseConfig from './database.config';
import { ConfigType } from '@nestjs/config';
import { knex, Knex } from 'knex';
import { AuthTypes, Connector, IpAddressTypes } from '@google-cloud/cloud-sql-connector';
import { isRunningLocally } from '@poc-gcp/vault';
import { join } from 'node:path';
import 'pg';
@Injectable()
export class DatabaseService implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(DatabaseService.name);
  private primaryDatabase!: Knex;
  private replicaDatabase!: Knex;
  private connector: Connector;

  constructor(
    @Inject(databaseConfig.KEY)
    private readonly config: ConfigType<typeof databaseConfig>
  ) {
    this.connector = new Connector();
  }
  async onModuleDestroy() {
    this.logger.log('Closing database connections');

    try {
      await this.closeDatabases();
      this.logger.log('Database connections closed successfully');
    } catch (error) {
      this.logger.error('Error closing database connections', error);
    }
  }
  async onModuleInit() {
    this.logger.log('Initializing database service...');
    
    try {
      if (isRunningLocally()) {
        this.logger.debug('Connecting to local database instance');
        await this.setupLocalDatabase();

        // @todo (post build) - perform migration on startup of database service OR we remove this code and perform migration in separate unrelated process.
        //                      Uncomment if we decide to perform schema migration/seed on db service startup
        // await this.migrateDatabaseSchema(this.primaryDatabase);
        // await this.seedDatabaseIfEmpty(this.primaryDatabase);
      } else {
        return;
        this.logger.debug('Connecting to Cloud SQL database instance');
        await this.setupCloudDatabases();

        // @todo (post build) - perform migration on startup of database service OR we remove this code and perform migration in separate unrelated process.
        //                      Uncomment if we decide to perform schema migration/seed on db service startup
        // await this.migrateDatabaseSchema(this.primaryDatabase);
      }

      this.logger.log('Database connections established successfully');
    } catch (error) {
      this.logger.error('Error establishing database connections', error);
      throw new Error('Failed to establish database connections');
    }
  }

  private async closeDatabases(): Promise<void> {
    try {
      await Promise.all([this.primaryDatabase?.destroy(), this.replicaDatabase?.destroy(), this.connector.close()]);
    } catch (error) {
      this.logger.error('Error during database shutdown', error);
      throw new Error('Database shutdown failed');
    }
  }

  private async setupLocalDatabase(): Promise<void> {
    this.primaryDatabase = knex({
      client: 'pg',
      // @todo (post build) - Get connection from .env file. As this is localhost we don't anticipate this changing much (if at all) for local dev.
      connection: 'postgres://admin:admin@localhost:5432/shipping-ms',
      pool: { min: 0, max: 10 },
      migrations: {
        directory: join(__dirname, 'migrations'),
      },
      seeds: {
        directory: join(__dirname, 'seeds'),
      },
    });

    // In local setup, use the primary database for read and write operations
    this.replicaDatabase = this.primaryDatabase;
    await this.verifyConnection(this.primaryDatabase);

    this.logger.log('Connected to local database instance');
  }

  private async verifyConnection(db: Knex): Promise<void> {
    try {
      await db.raw('SELECT 1');
      this.logger.debug('Database connection verified.');
    } catch (error) {
      this.logger.error('Failed to verify database connection', error);
      throw new Error('Database connection verification failed');
    }
  }

  private async setupCloudDatabases(): Promise<void> {
    await Promise.all([this.setupDatabase('primary')]);
  }

  private async setupDatabase(type: 'primary' | 'replica'): Promise<void> {
    const instanceConnectionName =
      type === 'primary' ? this.config.primaryInstanceConnectionName : this.config.replicaInstanceConnectionName;

    const db_ip=process.env['DB_IP'];
    const db_pw=process.env['DB_PW'];
    const databaseConfig = {
      client: 'pg',
      connection: {
        host: db_ip,          // Public IP of the PostgreSQL server
        port: 5432,                       // Default PostgreSQL port
        user: 'postgres',            // Username for PostgreSQL
        password: db_pw ,       // Password for PostgreSQL
        database: 'shipping-ms',   // Database name
      },
      pool: { min: 0, max: 10 },
    //   migrations: {
    //     directory: join(__dirname, 'migrations'),
    //   },
    //   seeds: {
    //     directory: join(__dirname, 'seeds'),
    //   },
    };

    if (type === 'primary') {
      this.primaryDatabase = knex(databaseConfig);
      await this.verifyConnection(this.primaryDatabase);
      this.logger.log('Connected to primary database instance');
    } else {
      this.replicaDatabase = knex(databaseConfig);
      await this.verifyConnection(this.replicaDatabase);
      this.logger.log('Connected to replica database instance');
    }
    this.replicaDatabase = this.primaryDatabase;
  }

  private async getCloudSqlOptions(instanceConnectionName: string) {
    return this.connector.getOptions({
      instanceConnectionName,
      ipType: IpAddressTypes.PRIVATE,
      authType: AuthTypes.IAM,
    });
  }

  async select<T>(sql: string, params: unknown[] = []): Promise<T[]> {
    return this.rawQuery<T>(sql, params, true);
  }

  async insert<T>(sql: string, params: unknown[] = [], isolationLevel?: Knex.IsolationLevels): Promise<T[]> {
    return this.runQueryWithTransaction<T>(sql, params, isolationLevel);
  }

  async upsert<T>(sql: string, params: unknown[] = [], isolationLevel?: Knex.IsolationLevels): Promise<T[]> {
    return this.runQueryWithTransaction<T>(sql, params, isolationLevel);
  }

  async update<T>(sql: string, params: unknown[] = [], isolationLevel?: Knex.IsolationLevels): Promise<T[]> {
    return this.runQueryWithTransaction<T>(sql, params, isolationLevel);
  }

  private async rawQuery<T>(sql: string, params: unknown[] = [], isReadOnly = false): Promise<T[]> {
    const db = isReadOnly ? this.replicaDatabase : this.primaryDatabase;

    try {
      const startTime = Date.now();
      const result = await db.raw(sql, params);
      const duration = Date.now() - startTime;

      this.logger.debug(`Query executed in ${duration}ms`);

      return result.rows as T[];
    } catch (error) {
      this.logger.error(`Query execution failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
      throw new Error('Query execution failed');
    }
  }

  async bulkUpsert<T>(
    table: string,
    newItems: T[],
    idColumn: string,
    updateColumns?: string[],
    isolationLevel?: Knex.IsolationLevels,
  ): Promise<number[]> {
    const db = this.primaryDatabase;
    const trx = await db.transaction({ isolationLevel });

    try {
      const result = await trx(table).insert(newItems).onConflict(idColumn).merge(updateColumns);
      await trx.commit();
      return result;
    } catch (error) {
      await trx.rollback();

      this.logger.error(`Transaction execution failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
      throw new Error('Transaction execution failed');
    }
  }

  async delete<T>(sql: string, params: unknown[] = [], isolationLevel?: Knex.IsolationLevels): Promise<T[]> {
    return this.runQueryWithTransaction<T>(sql, params, isolationLevel);
  }

  private async runQueryWithTransaction<T>(
    sql: string,
    params: unknown[] = [],
    isolationLevel: Knex.IsolationLevels = 'read committed',
  ): Promise<T[]> {
    const db = this.primaryDatabase;
    const trx = await db.transaction({ isolationLevel });

    try {
      const result = await trx.raw(sql, params);
      await trx.commit();
      return result.rows as T[];
    } catch (error) {
      await trx.rollback();

      this.logger.error(`Transaction execution failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
      throw new Error('Transaction execution failed');
    }
  }
}
