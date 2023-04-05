from datetime import datetime, timezone, timedelta
from database import Database


def get_now_time():
    dt0 = datetime.utcnow().replace(tzinfo=timezone.utc)
    return dt0.astimezone(
        timezone(timedelta(hours=8))).strftime('%Y-%m-%d %H:%M:%S')


def update_db_job_status(job_info):
    print('預計更新job_instance...', job_info)
    if job_info['job_run_status'] != 'skipped':
        end_time = get_now_time()
        job_info['end_time'] = end_time
    connection = Database().connection
    with connection.cursor() as cursor:
        sql = 'UPDATE jobs_instances SET job_run_status = %(job_run_status)s, \
                start_time = %(start_time)s, end_time = %(end_time)s WHERE id = %(job_instance_id)s'

        cursor.execute(sql, job_info)
        result = cursor.rowcount
        if result == 0:
            print(f'未更新成功， 請確認{job_info} job 狀況')
    connection.commit()
    connection.close()
    return job_info
