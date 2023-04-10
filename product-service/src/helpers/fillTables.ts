import { BatchWriteItemCommand, BatchWriteItemCommandInput, DynamoDBClient, PutRequest, WriteRequest } from "@aws-sdk/client-dynamodb"
import { productsList } from '../assets/products';

const tableName = 'Products_Table';

const convertedItems: WriteRequest[] = productsList.map(item => {
  const putItem: PutRequest = {
    Item: {
      "id": {"S": item.id},
      "count": {"N": String(item.count)},
      "price": {"N": String(item.price)},
      "title": {"S": item.title},
      "description": {"S": item.description}
    }
  }

  return {
    PutRequest: putItem
  }
})

const params: BatchWriteItemCommandInput = {
  RequestItems: {
    [tableName]: [
      ...convertedItems
    ]
  }
};


(async () => {
  const client = new DynamoDBClient({ region: "us-east-1" });
  const command = new BatchWriteItemCommand(params);

  try {
    const response = await client.send(command);

    console.log('response: ', response);
  } catch (err) {
    console.error(err);
  }
})();
