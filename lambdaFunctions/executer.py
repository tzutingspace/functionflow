import datetime
import json
import os
from datetime import datetime, timedelta, timezone

import pymysql
from database import Database
from put_to_sqs import put_to_sqs
from update_db_job_status import update_db_job_status


def set_workflow_instance_success(body):
    connection = Database().connection
    with connection.cursor() as cursor:
        sql = f"UPDATE workflows_instances SET workflows_instance_state = 'success' WHERE id = %s"
        cursor.execute(sql, (body['wf_instance_id']))
        result = cursor.rowcount
    if result == 0:
        print(f'未更新成功， 請確認{ body["wf_instance_id"]} workflow 狀況')
    connection.commit()
    connection.close()


def set_workflow_instance_failed(body):
    connection = Database().connection
    with connection.cursor() as cursor:
        sql = f"UPDATE workflows_instances SET workflows_instance_state = 'Failed' WHERE id = %s"
        cursor.execute(sql, (body['wf_instance_id']))
        result = cursor.rowcount
    if result == 0:
        print(f'未更新成功， 請確認{ body["wf_instance_id"]} workflow 狀況')
    connection.commit()
    connection.close()


def update_workflow_next_execute_time(body):
    connection = Database().connection
    with connection.cursor() as cursor:
        sql = f"SELECT * FROM workflows WHERE id = %s"
        cursor.execute(sql, (body['id']))
        workflow_details = [dict((cursor.description[i][0], value)
                                 for i, value in enumerate(row)) for row in cursor.fetchall()][0]
        # 處理下次時間
        interval = timedelta(minutes=int(
            workflow_details['trigger_interval_minutes']))
        execute_time = workflow_details['next_execute_time']
        next_time = (execute_time + interval).strftime('%Y-%m-%d %H:%M:%S')

        sql = f"UPDATE workflows SET next_execute_time = %s WHERE id = %s"
        cursor.execute(sql, (next_time, body['id']))
    connection.commit()
    connection.close()


def get_jobs(body):
    wf_instance_id = body['wf_instance_id']
    connection = Database().connection
    with connection.cursor() as cursor:
        sql = f"SELECT\
                jbi.id as job_instance_id,\
                jbi.job_name,\
                jbi.funciton_id,\
                jbi.function_name,\
                jbi.config,\
                jbi.workflow_instance_id,\
                jbi.job_run_status,\
                jbi.job_priority\
              FROM workflows_instances as wfi\
              INNER JOIN jobs_instances as jbi ON wfi.id = jbi.workflow_instance_id\
              WHERE\
                wfi.id = %s\
                AND jbi.job_run_status = 'waiting'\
              ORDER BY job_priority"
        cursor.execute(sql, (wf_instance_id))
        job_details = [dict((cursor.description[i][0], value)
                            for i, value in enumerate(row)) for row in cursor.fetchall()]
    connection.close()
    return job_details


def executer(body, job_details):
    if len(job_details) == 0:
        print('無等待工作事項, 更新 wf 狀態即可( 下次時間 & instance 成功)')
        set_workflow_instance_success(body)
        update_workflow_next_execute_time(body)
        return False
    if body.get('transfer_job_info'):
        upstream_result = body['transfer_job_info']['job_run_status']
        print('判斷上一個job結果')
        if upstream_result != 'scucess':
            print('停止queue')
            # 更新workflow_instance failed
            set_workflow_instance_failed(body)
            update_workflow_next_execute_time(body)
            # 更新所以後續 job instance > skipped
            for job_detail in job_details:
                job_detail['job_run_status'] = 'skipped'
                job_detail['start_time'] = None
                job_detail['end_time'] = None
                update_db_job_status(job_detail)
            return False

    # 將下一個任務放的queue
    job_details[0]['job_run_status'] = 'queued'
    body['transfer_job_info'] = job_details[0]
    put_to_sqs(body, job_details[0]['function_name'])
    return True


def lambda_handler(event, context):
    print('Start EVENT', event)
    body = json.loads(event['Records'][0]['body'])
    print('Boby', body)
    job_details = get_jobs(body)
    result = executer(body, job_details)
    return result


if __name__ == '__main__':
    event = {'Records': [{'messageId': '1', 'receiptHandle': '1',
                          'body': '{"id": 1, "trigger_type": "scheduled", "next_execute_time": "2023-04-05 14:40:25", "wf_instance_id": 12, "job_instance": [{"id": 1, "workflow_id": 1, "job_name": "get_weather_temp", "function_id": 1, "job_priority": 1, "depends_job_id": null, "config": "{\\"city\\": \\"\\u6f8e\\u6e56\\u7e23\\", \\"condition\\": \\"MinT, 22\\"}", "function_name": "get_weather_temp", "function_type": "function", "job_instance_id": 26}, {"id": 2, "workflow_id": 1, "job_name": "send_message_discord", "function_id": 2, "job_priority": 2, "depends_job_id": 2, "config": "{\\"user_message\\": \\"\\u5929\\u6c23\\u904e\\u65bc\\u4f4e\\u6eab\\uff0c\\u8acb\\u591a\\u7a7f\\u8863\\u670d\\uff0c(DB)\\", \\"user_channel_ID\\": \\"1091690518016163842\\"}", "function_name": "send_message_discord", "function_type": "function", "job_instance_id": 27}]}'}]}
    context = 'testing...'
    lambda_handler(event, context)
