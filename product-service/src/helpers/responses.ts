export function successfulResponse(body) {
  return {
    statusCode: 200,
    headers: {
      "Access-Control-Allow-Origin": "*",
    },
    body: JSON.stringify(body)
  }
}

export function errorResponse(error, code = 404) {
  console.error('Error: ', error);

  return {
    statusCode: code,
    headers: {
      "Access-Control-Allow-Origin": "*",
    },
    body: JSON.stringify(error? error: 'Error: Something is wrong')
  }
}
