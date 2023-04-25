import { Context, S3Event } from 'aws-lambda';
import { GetObjectCommand } from '@aws-sdk/client-s3';

import { errorResponse, successfulResponse } from '../helpers/responses.helper';
import { s3client } from '../helpers/s3.helper';
import { getSSMParameter } from '../helpers/ssm.helper';
import { Readable } from 'stream';

import csv from 'csv-parser';

export const importFileParser = async (event: S3Event, context: Context) => {
  console.log('Event: ', event)
  const bucketName = await getSSMParameter('/system/api/IMPORT_SERVICE_BUCKET_NAME');
  const fileName = event.Records[0].s3.object.key;
  const s3Params = {
    Bucket: bucketName,
    Key: fileName,
  }

  const results = [];

  const getObjectCommand = new GetObjectCommand(s3Params);

  try {
    const s3item = await s3client.send(getObjectCommand);

    if (s3item.Body) {
      const stream = s3item.Body as Readable;

      stream
        .pipe(csv({
          separator: ';'
        }))
        .on('data', async (data) => results.push(data))
        .on('end', () => {
          console.log('CSV Results: ', results);
        })
    }

    return successfulResponse({
      message: 'importFileParser fired!'
    });
  } catch (e) {
    return errorResponse(e, 404);
  }

}
