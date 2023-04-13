import { ScanCommand } from '@aws-sdk/lib-dynamodb';
import { ddbDocumentClient, getSSMParameter } from '../dynamoDb/dynamo';
import { errorResponse, successfulResponse } from '../helpers/responses';
import { IProduct } from '../interfaces/product.interface';

export const getProductsList = async () => {
  const productsTableName = await getSSMParameter('/system/api/DATA_DDB_PRODUCTS_TABLE_NAME')
  const stocksTableName = await getSSMParameter('/system/api/DATA_DDB_STOCKS_TABLE_NAME')

  const productsScan = new ScanCommand({TableName: productsTableName});
  const stocksScan = new ScanCommand({TableName: stocksTableName});

  try {
    const productsOutput = await ddbDocumentClient.send(productsScan);
    const stocksOutput = await ddbDocumentClient.send(stocksScan);

    const mergedProducts = productsOutput.Items.map(product => {
      const count = stocksOutput.Items.find(stockItem => stockItem.product_id === product.id).count;

      return {...product, count} as IProduct;
    })

    return successfulResponse(mergedProducts);
  } catch (e) {
    return errorResponse(e);
  }

}
