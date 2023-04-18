import { APIGatewayProxyEvent, Context } from 'aws-lambda';

export const importProductsFile = async (event: APIGatewayProxyEvent, context: Context) => {
  console.log('Event: ', event)
}
