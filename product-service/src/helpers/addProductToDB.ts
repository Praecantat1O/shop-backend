import { TransactWriteCommand } from '@aws-sdk/lib-dynamodb';
import { ddbDocumentClient, getSSMParameter } from '../dynamoDb/dynamo';
import { IProductPut, IStockPut } from '../interfaces/interfaces';

async function getCreateProductTransact(body, productId: string) {
  try {
    const { title, description, price, count } = JSON.parse(body);

    const productItem: IProductPut = {
      id: productId,
      title,
      description,
      price
    }

    console.log('productItem: ', productItem);

    const stockItem: IStockPut = {
      product_id: productId,
      count,
    }

    console.log('stockItem: ', stockItem);

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

      return transact;
  } catch (e) {
    console.error('getCreateProductTransact: ', e);
  }
}

export async function addProductToDB(body, productId: string) {
  try {
    const transact = await getCreateProductTransact(body, productId);
    await ddbDocumentClient.send(transact);
  } catch (e) {
    console.error('addProductToDB: ', e)
  }
}
