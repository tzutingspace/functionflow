from put_to_sqs import put_to_sqs
from database import Database
import os
from datetime import datetime, timezone, timedelta
import json
import pymysql
from botocore.exceptions import ClientError
import boto3


def lambda_handler(event, context):
    scuceess_list = []
    dt0 = datetime.utcnow().replace(tzinfo=timezone.utc)
    current_date_and_time = dt0.astimezone(timezone(timedelta(hours=8)))
    # current_date_and_time = datetime.now()
    time_interval = timedelta(
        minutes=int(os.environ["MIN_TIME_INTERVAL"]))
    end_date_and_time = current_date_and_time + time_interval

    print(f'預計抓取區間 {current_date_and_time} ~ {end_date_and_time}')

    # 寫到 queue和  workflows_instances
    connection = Database().connection

    # 找出本次符合條件的 workflow
    with connection.cursor() as cursor:
        sql = f"SELECT id, trigger_type, next_execute_time FROM workflows WHERE workflow_status = 'active' AND \
                next_execute_time >= %(current_date_and_time)s AND next_execute_time <= %(end_date_and_time)s"
        cursor.execute(sql, {'current_date_and_time': current_date_and_time,
                       'end_date_and_time': end_date_and_time})
        work_flows = [dict((cursor.description[i][0], value)
                           for i, value in enumerate(row)) for row in cursor.fetchall()]
        print('本次預計跑的 workflow 有 ', work_flows)

    # 所有 work_flow 依次建立 instance(wf, jobs) 並寫進queue job 中
    for work_flow in work_flows:
        print('work_flow', work_flow)
        with connection.cursor() as cursor:
            # 存放為字串格式
            work_flow['next_execute_time'] = work_flow['next_execute_time'].strftime(
                '%Y-%m-%d %H:%M:%S')

            # 取得該筆 workflow 所有的jobs
            sql = f"SELECT * FROM jobs INNER JOIN `functions` ON jobs.function_id = `functions`.id \
                WHERE workflow_id = %(id)s"
            cursor.execute(sql, work_flow)

            job_details = [dict((cursor.description[i][0], value)
                                for i, value in enumerate(row)) for row in cursor.fetchall()]

            # 建立 workflows_instance
            sql = f"INSERT INTO workflows_instances(workflows_id, workflows_instance_state,\
                    execution_time, external_trigger, run_type)\
                    VALUES(%(id)s, 'queued', NOW(), 'f', 'scheduled')"
            cursor.execute(sql, work_flow)
            work_flow['wf_instance_id'] = cursor.lastrowid
            # connection.commit()

            # 建立 jobs_instances
            # work_flow['job_instance'] = []
            for job in job_details:
                print('job', job)
                sql = f"INSERT INTO jobs_instances (workflow_instance_id, job_name, job_run_status,\
                      funciton_id, function_type, function_name, job_priority, config ) \
                        VALUES ( {work_flow['wf_instance_id']}, %(job_name)s, 'waiting',  %(function_id)s,\
                        %(function_type)s, %(job_name)s, %(job_priority)s,\
                        %(config)s)"
                cursor.execute(sql, job)
                # job['job_instance_id'] = cursor.lastrowid
                # work_flow['job_waiting_instance'].append(job)
            connection.commit()
            # 加入queue中
            res = put_to_sqs(work_flow, 'mytestqueue')
            work_flow['sqs_res'] = res
            scuceess_list.append(work_flow)
    connection.close()
    return scuceess_list


if __name__ == '__main__':
    event = 'scheuler testing...'
    context = 'scheuler testing...'
    scuceess_list = lambda_handler(event, context)
    print('測試結果', scuceess_list)
