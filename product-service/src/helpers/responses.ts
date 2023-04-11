const headers = {
  "Access-Control-Allow-Methods": "*",
  "Access-Control-Allow-Headers": "*",
  "Access-Control-Allow-Origin": "*",
};

export function successfulResponse(body) {
  return {
    statusCode: 200,
    headers,
    body: JSON.stringify(body)
  }
}

export function errorResponse(error) {
  console.error('Error: ', error);

  return {
    statusCode: 404,
    headers,
    body: JSON.stringify(error? error: 'Error: Something is wrong')
  }
}
