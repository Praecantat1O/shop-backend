import { productsList } from '../assets/products';

export async function getProductsList(event: any) {
  return {
    statusCode: 200,
    body: JSON.stringify(
      productsList
    ),
    headers: {
      'Access-Control-Allow-Origin': '*'
    }
  };
}
