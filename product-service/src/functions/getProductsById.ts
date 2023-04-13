import { GetCommand } from '@aws-sdk/lib-dynamodb';
import { ddbDocumentClient, getSSMParameter } from '../dynamoDb/dynamo';
import { errorResponse, successfulResponse } from '../helpers/responses';
import { APIGatewayProxyEvent } from 'aws-lambda';

export const getProductsById = async (event: APIGatewayProxyEvent) => {
  const { id } = event.pathParameters;
  const productsTableName = await getSSMParameter('/system/api/DATA_DDB_PRODUCTS_TABLE_NAME');
  const stocksTableName = await getSSMParameter('/system/api/DATA_DDB_STOCKS_TABLE_NAME');

  const getProduct = new GetCommand({
    TableName: productsTableName,
    Key: { id }
  });


  const getStock = new GetCommand({
    TableName: stocksTableName,
    Key: {
      product_id: id
    }
  });

  try {
    const productsOutput = await ddbDocumentClient.send(getProduct);
    console.log('get product works');
    console.log('productsOutput: ', productsOutput);
    console.log('productsOutputItem: ', productsOutput.Item);

    const stocksOutput = await ddbDocumentClient.send(getStock);
    console.log('get stock works');
    console.log('stocksOutput: ', stocksOutput);
    console.log('stocksOutputItem: ', stocksOutput.Item);

    const mergedProduct = { ...productsOutput.Item, count: stocksOutput.Item.count };

    return successfulResponse(mergedProduct);
  } catch (e) {
    return errorResponse(e);
  }

}
