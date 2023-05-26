import { SQSEvent, Context } from 'aws-lambda';
import { addProductToDB } from '../helpers/addProductToDB';
import { v4 as uuidv4 } from "uuid";
import { PublishCommand, SNSClient } from '@aws-sdk/client-sns';
import { getSSMParameter } from '../dynamoDb/dynamo';


export const catalogBatchProcess = async (event: SQSEvent, context: Context) => {
  console.log('Records: ', event.Records);

  const snsClient = new SNSClient({region: 'us-east-1'});

  try {
    const result = await Promise.all(event.Records.map(async (record) => {
      const productId = uuidv4();
      const { title, description, price, count } = JSON.parse(record.body);

      console.log(`${title} is adding...`)
      return await addProductToDB(record.body, productId);
    }))

    const topicArn = await getSSMParameter('/system/api/SNS_TOPIC_ARN');

    await snsClient.send(new PublishCommand({
      Subject: 'New products were added to DynamoDB',
      Message: `Number of products: ${result.length}`,
      TopicArn: topicArn,
    }))

    console.log('Products added: ', result?.length);
  } catch (e) {
    console.error('catalogBatchProcess: ', e);
  }

}
