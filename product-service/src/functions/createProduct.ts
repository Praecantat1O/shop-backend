import { addProductToDB } from '../helpers/addProductToDB';
import { errorResponse, successfulResponse } from '../helpers/responses';
import { APIGatewayProxyEvent, Context } from 'aws-lambda';

export const createProduct = async (event: APIGatewayProxyEvent, context: Context) => {
  console.log('Event: ', event)
  const { title, description, price, count } = JSON.parse(event.body);

  const isDataValid = (!!title && !!description && !!price && !!count);

  if (!isDataValid) {
    return errorResponse('Product data is invalid', 400);
  }

  const productId = context.awsRequestId;
  console.log('Generated productId: ', productId)

  try {
    const response = await addProductToDB(event.body, productId);

    return successfulResponse(response);
  } catch (e) {
    return errorResponse(e, 500);
  }
}
