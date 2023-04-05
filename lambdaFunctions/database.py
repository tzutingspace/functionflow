import pymysql
import os

import importlib
# from get_secret import get_secret

if os.environ.get('ENV') == None:
    module = importlib.import_module('dotenv')
    module.load_dotenv()

if os.environ['ENV'] == 'lambda':
    db_settings = {
        "host": os.environ["MYSQL_HOST"],
        "port": 3306,
        "user": os.environ["MYSQL_USER"],
        "password": os.environ["MYSQL_PASSWORD"],
        "db": os.environ['MYSQL_DATABASE']
    }
else:
    db_settings = {
        "host": os.environ["MYSQL_HOST"],
        "port": 3306,
        "user": os.environ["MYSQL_USER"],
        "password": os.environ["MYSQL_PASSWORD"],
        "db": os.environ['MYSQL_DATABASE']
    }


class Database:
    def __init__(self):
        self.connection = pymysql.connect(**db_settings)

    def close(self):
        self.connection.close()


if __name__ == '__main__':
    connection = Database().connection
    with connection.cursor() as cursor:
        # 找出本次符合條件的 workflow
        sql = f" SELECT * FROM workflows"
        cursor.execute(sql)
        # 取得所有資料
        result = [dict((cursor.description[i][0], value)
                       for i, value in enumerate(row)) for row in cursor.fetchall()]
    connection.close()
    print('測試database連線：', result)
