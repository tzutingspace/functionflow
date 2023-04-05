import json
import os
from datetime import datetime, timedelta, timezone

import requests
from put_to_sqs import put_to_sqs
from update_db_job_status import update_db_job_status
from update_db_job_status import get_now_time


def get_weather(job_info):
    url = 'https://opendata.cwb.gov.tw/api/v1/rest/datastore/F-C0032-001'
    headers = {'user-agent': 'Mozilla/5.0'}
    params = {
        'Authorization': os.getenv("OPENAPIKEY"),
        'format': 'JSON',
        'locationName': job_info['config']['city'],
        'sort': 'time',
        'limit': 1,
        'offset': 0,
        'elementName': 'MinT,MaxT'
    }
    response = requests.get(url, params=params, headers=headers)
    if response.status_code != 200 or response.headers['Content-Type'] != 'application/json;charset=utf-8':
        print('取得天氣資料發生錯誤', response.status_code)
        return False
    data = response.json()
    if len(data['records']['location']) == 0:
        print('此筆天氣資料為空', data['records'])
        return False
    weatherElement = data['records']['location'][0]['weatherElement']
    return weatherElement


def check_condition(weatherstatuses, job_info):
    condition, setting_temp = job_info['config']["condition"].split(",")
    setting_temp = int(setting_temp)
    for element in weatherstatuses:
        if element['elementName'] == condition:
            forecasttemp = int(element['time'][0]
                               ['parameter']['parameterName'])
            break
    if (condition == 'MinT' and forecasttemp <= setting_temp) or (condition == 'MaxT' and forecasttemp >= setting_temp):
        print(
            f"通知用戶, 條件: {condition}, 目前溫度: {forecasttemp}, 提醒溫度: {setting_temp}")
        return True
    else:
        print(
            f"不符合條件, 條件: {condition}, 目前溫度: {forecasttemp}, 提醒溫度: {setting_temp}")
        return False


def lambda_handler(event, context):
    print('開始EVENT', event)
    start_time = get_now_time()
    body = json.loads(event['Records'][0]['body'])
    job_info = body['transfer_job_info']
    job_info['config'] = json.loads(body['transfer_job_info']['config'])
    job_info['start_time'] = start_time

    # 取得天氣資訊
    weatherstatuses = get_weather(job_info)

    # 取得天氣失敗
    if not weatherstatuses:
        job_info['job_run_status'] = 'Failed'

    # 取得天氣成功
    else:
        result = check_condition(weatherstatuses, job_info)
        # 確認是否達通知標準
        if not result:
            job_info['job_run_status'] = 'unfulfilled'
        else:
            job_info['job_run_status'] = 'scucess'
    # 更新DB資訊
    body['transfer_job_info'] = update_db_job_status(job_info)
    # 寫回queue
    put_to_sqs(body, 'mytestqueue')
