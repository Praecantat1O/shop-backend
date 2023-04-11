import { BatchWriteItemCommand, BatchWriteItemCommandInput, DynamoDBClient, PutRequest, WriteRequest } from "@aws-sdk/client-dynamodb"
import { productsList } from '../assets/products';
import { DynamoDBDocumentClient } from '@aws-sdk/lib-dynamodb';

const productsTableName = 'Products_Table';
const stockTableName = 'Stocks_Table';

const convertedProductItems: WriteRequest[] = productsList.map(item => {
  const putItem: PutRequest = {
    Item: {
      "id": {"S": item.id},
      "price": {"N": String(item.price)},
      "title": {"S": item.title},
      "description": {"S": item.description}
    }
  }

  return {
    PutRequest: putItem
  }
})

const productParams: BatchWriteItemCommandInput = {
  RequestItems: {
    [productsTableName]: [
      ...convertedProductItems
    ]
  }
};

const convertedStockItems: WriteRequest[] = productsList.map(item => {
  const putItem: PutRequest = {
    Item: {
      "product_id": {"S": item.id},
      "count": {"N": String(item.count)},
    }
  }

  return {
    PutRequest: putItem
  }
});


const stockParams: BatchWriteItemCommandInput = {
  RequestItems: {
    [stockTableName]: [
      ...convertedStockItems
    ]
  }
};


(async () => {
  const client = new DynamoDBClient({ region: "us-east-1" });
  const ddbDocClient = DynamoDBDocumentClient.from(client);
  const fillProducts = new BatchWriteItemCommand(productParams);
  const fillStock = new BatchWriteItemCommand(stockParams);

  try {
    const productsResponse = await ddbDocClient.send(fillProducts);
    const stockResponse = await ddbDocClient.send(fillStock);

    console.log('productsResponse: ', productsResponse);
    console.log('stockResponse: ', stockResponse);
  } catch (err) {
    console.error(err);
  }
})();
