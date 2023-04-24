import { SQSClient, SendMessageCommand } from '@aws-sdk/client-sqs';
import dotenv from 'dotenv';

dotenv.config();

export const putToSQS = async (msg) => {
  const client = new SQSClient({
    region: process.env.AWS_REGION_NAME,
  });

  const input = {
    // SendMessageRequest
    QueueUrl: process.env.QUEUE_URL_MANUAL_TRIGGER, // required
    MessageBody: msg, // required
    DelaySeconds: Number('30'),
  };
  try {
    // console.log('insqs input', input);
    const command = new SendMessageCommand(input);
    // console.log('command', command);
    const response = await client.send(command);
    console.log('SQS回傳的結果', response);
    // process data.
  } catch (error) {
    // error handling.
    const { requestId, cfId, extendedRequestId } = error.$$metadata;
    console.log('SQS錯誤訊息', { requestId, cfId, extendedRequestId });
  }
};
