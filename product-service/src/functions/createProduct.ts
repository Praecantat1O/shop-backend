import { TransactWriteCommand } from '@aws-sdk/lib-dynamodb';
import { ddbDocumentClient, getSSMParameter } from '../dynamoDb/dynamo';
import { errorResponse, successfulResponse } from '../helpers/responses';
import { APIGatewayProxyEvent, Context } from 'aws-lambda';
import { IProductPut, IStockPut } from '../interfaces/interfaces';

export const createProduct = async (event: APIGatewayProxyEvent, context: Context) => {
  console.log('Event: ', event)

  const { title, description, price, count } = JSON.parse(event.body);
  const isDataValid = (!!title && !!description && !!price && !!count);
  console.log('IsDataValid: ', isDataValid);

  if (!isDataValid) {
    return errorResponse('Product data is invalid', 400);
  }

  const productId = context.awsRequestId;
  console.log('Generated productId: ', productId)

  const productItem: IProductPut = {
    id: productId,
    title,
    description,
    price
  }

  const stockItem: IStockPut = {
    product_id: productId,
    count,
  }

  try {
    const productsTableName = await getSSMParameter('/system/api/DATA_DDB_PRODUCTS_TABLE_NAME');
    const stocksTableName = await getSSMParameter('/system/api/DATA_DDB_STOCKS_TABLE_NAME');

    const transact = new TransactWriteCommand({
      TransactItems: [
        {
          Put: {
            TableName: productsTableName,
            Item: productItem
          }
        },
        {
          Put: {
            TableName: stocksTableName,
            Item: stockItem,
          }
        }
      ]
    })

   const response = await ddbDocumentClient.send(transact);

    return successfulResponse(response);
  } catch (e) {
    return errorResponse(e, 500);
  }
}
