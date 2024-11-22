import { Inject, Injectable, Logger } from '@nestjs/common';
import { BigQuery } from '@google-cloud/bigquery';
import { BigQueryConfig } from './bigquery.config';
import { ConfigType } from '@nestjs/config';

@Injectable()
export class BigQueryService {
  private bigQueryClient: BigQuery;
  private readonly logger = new Logger(BigQueryService.name);
  constructor(
    @Inject(BigQueryConfig.KEY)
    private readonly config: ConfigType<typeof BigQueryConfig>,
  ) {
    this.bigQueryClient = new BigQuery({

        projectId: config.projectId
      });
  }

  // Method to insert data into BigQuery table
  async insertData(firstName: string, lastName: string) {
    const datasetId = 'your_dataset_id';  // BigQuery dataset ID
    const tableId = 'your_table_id';      // BigQuery table ID

    const rows = [
      {
        firstName,
        lastName,
      },
    ];

    try {
      await this.bigQueryClient
        .dataset(datasetId)
        .table(tableId)
        .insert(rows);

      this.logger.log('Data inserted successfully');
    } catch (error) {
        this.logger.error('Error inserting data:', error);
    }
  }
}