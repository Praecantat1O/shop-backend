import { APIGatewayProxyEvent, Context } from 'aws-lambda';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { PutObjectCommand } from '@aws-sdk/client-s3';

import { errorResponse, successfulResponse } from '../helpers/responses.helper';
import { s3client } from '../helpers/s3.helper';
import { getSSMParameter } from '../helpers/ssm.helper';

export const importProductsFile = async (event: APIGatewayProxyEvent, context: Context) => {
  console.log('Event: ', event)
  const name = event.queryStringParameters.name;
  const bucketName = await getSSMParameter('/system/api/IMPORT_SERVICE_BUCKET_NAME');

  try {
    const command = new PutObjectCommand({
      Bucket: bucketName,
      Key: `uploaded/${name}`,
      ContentType: 'text/csv',
      ACL: "public-read-write",
    });

    const url = await getSignedUrl(s3client, command, {
      expiresIn: 3600,
    });

    return successfulResponse({
        message: url,
    });
  } catch (e) {
    return errorResponse(e, 404);
  }

}
