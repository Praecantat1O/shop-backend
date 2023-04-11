import { getItemById } from '../helpers/helpers';
import { productsList } from '../assets/products';
import { APIGatewayProxyEvent } from 'aws-lambda';


export async function getProductsById(event: APIGatewayProxyEvent): Promise<any> {
  const { id } = event.pathParameters;
  const product = getItemById(productsList, id);

  return {
    statusCode: 200,
    body: JSON.stringify(product),
    headers: {
      "Access-Control-Allow-Methods": "*",
      "Access-Control-Allow-Headers": "*",
      "Access-Control-Allow-Origin": "*",
    }
  };
}
