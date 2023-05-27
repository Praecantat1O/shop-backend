import { Context, S3Event } from 'aws-lambda';
import { CopyObjectCommand, DeleteObjectCommand, GetObjectCommand } from '@aws-sdk/client-s3';

import { errorResponse, successfulResponse } from '../helpers/responses.helper';
import { s3client } from '../helpers/s3.helper';
import { getSSMParameter } from '../helpers/ssm.helper';
import { Readable } from 'stream';
import { SQSClient, SendMessageCommand } from '@aws-sdk/client-sqs'

import csv from 'csv-parser';

export const importFileParser = async (event: S3Event, context: Context) => {
  const sqsClient = new SQSClient({region: 'us-east-1'});

  const bucketName = await getSSMParameter('/system/api/IMPORT_SERVICE_BUCKET_NAME');
  const queueUrl = await getSSMParameter('/system/api/PRODUCTS_QUEUE_URL');

  const key = event.Records[0].s3.object.key;

  try {
    const stream = (await s3client.send(new GetObjectCommand({
      Bucket: bucketName,
      Key: key,
    }))).Body as Readable;

    stream
      .pipe(csv({separator: ';'}))
      .on('data', (record) => {
        console.log('Record: ', record);
        sqsClient.send(new SendMessageCommand({
            MessageBody: JSON.stringify(record),
            QueueUrl: queueUrl,
          })
        )
      })

      try {
        await s3client.send(new CopyObjectCommand({
          CopySource: `${bucketName}/${key}`,
          Bucket: bucketName,
          Key: key.replace('uploaded', 'parsed'),
        }));

        await s3client.send(new DeleteObjectCommand({
          Bucket: bucketName,
          Key: key,
        }))

      } catch (error) {
        console.error('S3 Copy/Delete Error: ', error);
      }

      return successfulResponse({message: 'File download success'})
  } catch (e) {
    console.error(errorResponse(e, 404));
    return errorResponse(e, 404);
  }

}
