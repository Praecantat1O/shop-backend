import { GetCommand } from '@aws-sdk/lib-dynamodb';
import { ddbDocumentClient, getSSMParameter } from '../dynamoDb/dynamo';
import { errorResponse, successfulResponse } from '../helpers/responses';
import { APIGatewayProxyEvent } from 'aws-lambda';

export const getProductsById = async (event: APIGatewayProxyEvent) => {
  const { id } = event.pathParameters;
  const productsTableName = await getSSMParameter('/system/api/DATA_DDB_PRODUCTS_TABLE_NAME')
  const stocksTableName = await getSSMParameter('/system/api/DATA_DDB_STOCKS_TABLE_NAME')

  const productsScan = new GetCommand({TableName: productsTableName, Key: {
    id,
  }});
  const stocksScan = new GetCommand({TableName: stocksTableName, Key: {
    productId: id,
  }});

  try {
    const productsOutput = await ddbDocumentClient.send(productsScan);
    const stocksOutput = await ddbDocumentClient.send(stocksScan);

    const mergedProduct = { ...productsOutput.Item, count: stocksOutput.Item.count };

    return successfulResponse(mergedProduct);
  } catch (e) {
    return errorResponse(e);
  }

}
