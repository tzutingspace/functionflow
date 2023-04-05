import os
import json
import boto3
from botocore.exceptions import ClientError


def put_to_sqs(job, queuename):
    print(f"預計加入sqs的內容: {job}")
    if os.environ.get('ENV') != None and os.environ['ENV'] == 'lambda':
        client = boto3.client('sqs', region_name="ap-northeast-1")
        response = client.send_message(
            QueueUrl=f"https://sqs.ap-northeast-1.amazonaws.com/700360503662/{queuename}",
            MessageBody=json.dumps(job)
        )
        print('put_to_sqs Response: ', response)
        return response
    else:
        return 'develop...假裝放進queue'
