
import { errorResponse, successfulResponse } from '../helpers/responses';
import { SQSEvent, Context } from 'aws-lambda';
import { addProductToDB } from '../helpers/addProductToDB';

export const catalogBatchProcess = async (event: SQSEvent, context: Context) => {
  console.log('Event: ', event)
  console.log('Records: ', event.Records);

  try {
    const responses = await Promise.all(event.Records.map(async (record) => {
      const { title, description, price, count } = JSON.parse(record.body);
      const isDataValid = (!!title && !!description && !!price && !!count);

      if (!isDataValid) {
        return errorResponse('Product data is invalid', 400);
      }

      const productId = context.awsRequestId;

      return await addProductToDB(record.body, productId);
    }))

    console.log('result: ', responses);
    return successfulResponse(`Items added to table from SQS event: ${responses.length}`);
  } catch (e) {
    return errorResponse(e);
  }

}
