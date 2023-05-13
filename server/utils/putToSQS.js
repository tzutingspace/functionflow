import { SQSClient, SendMessageCommand } from '@aws-sdk/client-sqs';
import dotenv from 'dotenv';

dotenv.config();

export const putToSQS = async (msg) => {
  const client = new SQSClient({
    region: process.env.AWS_REGION_NAME,
  });

  const input = {
    QueueUrl: process.env.QUEUE_URL_MANUAL_TRIGGER,
    MessageBody: msg,
    DelaySeconds: Number('30'),
  };

  try {
    const command = new SendMessageCommand(input);
    const response = await client.send(command);
    console.debug('SQS server response', response);
  } catch (error) {
    const { requestId, cfId, extendedRequestId } = error.$$metadata;
    console.error('SQS Error message', { requestId, cfId, extendedRequestId });
  }
};
