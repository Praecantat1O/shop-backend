'use strict';

import productsList from '../assets/products.js';
import {getItemById} from '../helpers/helpers.js';

export async function getProductsById(event) {
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
