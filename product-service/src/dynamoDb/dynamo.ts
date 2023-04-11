import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { SSM } from "@aws-sdk/client-ssm";
import {
  DynamoDBDocumentClient,
  ScanCommand,
  PutCommand,
  GetCommand,
  DeleteCommand,
} from "@aws-sdk/lib-dynamodb";


const ssm = new SSM({});

export const ddbClient = new DynamoDBClient({region: 'us-east-1'});

export const ddbDocumentClient = DynamoDBDocumentClient.from(ddbClient);

export async function getSSMParameter(name: string): Promise<string> {
  const parameter = await ssm.getParameter({
    Name: name,
  });

  return parameter.Parameter.Value;
}
