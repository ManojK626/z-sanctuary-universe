import urllib.request
import json
from time import sleep
from random import randint

def post(url, body):
    data = json.dumps(body).encode('utf-8')
    req = urllib.request.Request(url, data=data, headers={'Content-Type':'application/json'})
    with urllib.request.urlopen(req, timeout=5) as resp:
        return json.load(resp)

def get(url):
    with urllib.request.urlopen(url, timeout=5) as resp:
        return json.load(resp)

base = 'http://localhost:8008'
print('Creating challenge...')
print(post(f"{base}/challenge", {'title': 'CLI Trial'}))
for i in range(3):
    payload = {
        'challengeId': 'challenge-1',
        'user': f'cli-warrior-{i+1}',
        'value': randint(50, 150)
    }
    print('Submitting score', payload['user'])
    print(post(f"{base}/score", payload))
    sleep(0.2)
print('\nLeaderboard:')
leaderboard = get(f"{base}/leaderboard")
print(json.dumps(leaderboard, indent=2))
