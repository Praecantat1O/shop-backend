'use strict';

import productsList from '../assets/products.js';

export async function getProductsList(event) {
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
