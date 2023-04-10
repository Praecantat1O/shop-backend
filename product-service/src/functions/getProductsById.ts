import { getItemById } from '../helpers/helpers';
import { productsList } from '../assets/products';


export async function getProductsById(event: any): Promise<any> {
  const { id } = event;
  const product = getItemById(productsList, id);

  return {
    statusCode: 200,
    body: JSON.stringify(
      product
    ),
    headers: {
      'Access-Control-Allow-Origin': '*'
    }
  };
}
