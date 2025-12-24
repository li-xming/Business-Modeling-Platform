import requests
import sys

try:
    response = requests.get('http://127.0.0.1:5000/api/model-table-associations?modelId=3', timeout=5)
    print(f'Status code: {response.status_code}')
    print(f'Response: {response.text}')
    sys.exit(0)
except Exception as e:
    print(f'Error: {e}')
    sys.exit(1)
