import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { SSM } from '@aws-sdk/client-ssm';
import {
  DynamoDBDocumentClient,
} from "@aws-sdk/lib-dynamodb";

const ssm = new SSM({region: 'us-east-1'});

export const ddbClient = new DynamoDBClient({region: 'us-east-1'});

export const ddbDocumentClient = DynamoDBDocumentClient.from(ddbClient);

export async function getSSMParameter(name: string): Promise<string> {
  try {
    const parameter = await ssm.getParameter({
      Name: name,
    });

    return parameter.Parameter.Value;

  } catch (e) {
    return e;
  }
}

