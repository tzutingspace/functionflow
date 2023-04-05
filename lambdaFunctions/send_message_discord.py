import json
import os
from datetime import datetime, timedelta, timezone

import requests
from put_to_sqs import put_to_sqs
from update_db_job_status import update_db_job_status
from update_db_job_status import get_now_time


def send_discord_message(user_channel_ID, user_message):
    url = f'https://discord.com/api/channels/{user_channel_ID}/messages'
    headers = {'Authorization': os.environ["DISCORDBOTTOKEN"]}
    data_json = {'content': user_message}
    res = requests.post(url, json=data_json, headers=headers)
    if res.status_code != 200:
        print(
            f'Error: An error occurred while creating a Discord message in the {user_channel_ID} channel.')
        return False
    else:
        print('寄出成功', res.json())
        return True


def main(event, content):
    print('開始EVENT', event)
    start_time = get_now_time()
    body = json.loads(event['Records'][0]['body'])
    job_info = body['transfer_job_info']
    job_info['config'] = json.loads(body['transfer_job_info']['config'])
    job_info['start_time'] = start_time

    user_channel_ID = job_info['config']['user_channel_ID']
    user_message = job_info['config']['user_message']
    result = send_discord_message(user_channel_ID, user_message)

    if not result:
        job_info['job_run_status'] = 'Failed'
    else:
        job_info['job_run_status'] = 'scucess'

    # 更新DB資訊
    body['transfer_job_info'] = update_db_job_status(job_info)
    # 寫回queue
    put_to_sqs(body, 'mytestqueue')

    return result
