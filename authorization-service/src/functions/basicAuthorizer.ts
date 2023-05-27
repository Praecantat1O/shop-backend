import { APIGatewayTokenAuthorizerEvent } from 'aws-lambda'

const headers = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Credentials': true,
  'Access-Control-Allow-Headers': '*'
};

const unauthResp = {
  statusCode: 401,
  body: 'Unauthorized',
  headers
}

const forbiddenResp = {
  statusCode: 403,
  body: 'Forbidden',
  headers
}

export const basicAuthorizer = async (event: APIGatewayTokenAuthorizerEvent ) => {
  console.log('basicAuthorizer event: ', event)
  try {
    if (event?.type !== 'TOKEN') return unauthResp;

    const { authorizationToken, methodArn } = event;
    const token = authorizationToken.split(' ')[1];
    const [login, password] = Buffer.from(token, 'base64').toString('utf-8').split(':');

    const isAuthorized = process.env[login] === password && password;

    const authResult = isAuthorized? 'Allow' : 'Deny';

    return {
      principalId: authorizationToken,
      policyDocument: {
          Version: '2012-10-17',
          Statement: [
              {
                  Action: 'execute-api:Invoke',
                  Effect: authResult,
                  Resource: [methodArn],
              }
          ]
      }
  }

  } catch (e) {
    return forbiddenResp;
  }

}
