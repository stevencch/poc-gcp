import { Injectable } from '@nestjs/common';
import { BigQuery } from '@google-cloud/bigquery';

@Injectable()
export class BigQueryService {
  private bigQueryClient: BigQuery;

  constructor() {
    this.bigQueryClient = new BigQuery({
      projectId: '<YOUR_PROJECT_ID>', // Your Google Cloud project ID
      keyFilename: '<PATH_TO_YOUR_SERVICE_ACCOUNT_KEY_JSON>',
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
        createdAt: new Date().toISOString(),
      },
    ];

    try {
      await this.bigQueryClient
        .dataset(datasetId)
        .table(tableId)
        .insert(rows);

      console.log('Data inserted successfully');
    } catch (error) {
      console.error('Error inserting data:', error);
    }
  }
}