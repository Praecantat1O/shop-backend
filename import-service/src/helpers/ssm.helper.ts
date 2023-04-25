import { SSM } from '@aws-sdk/client-ssm';

const ssm = new SSM({region: 'us-east-1'});

export async function getSSMParameter(name: string): Promise<string> {
  try {
    const parameter = await ssm.getParameter({
      Name: name,
    });

    return parameter.Parameter.Value;

  } catch (e) {
    return e;
  }
}

