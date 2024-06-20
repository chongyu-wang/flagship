import redis
import os
from dotenv import load_dotenv

load_dotenv()

class RedisManager:
    def __init__(self):
        self.client = redis.StrictRedis(
            host=os.getenv('REDIS_HOST', 'localhost'),
            port=int(os.getenv('REDIS_PORT', 6379)),
            db=int(os.getenv('REDIS_DB', 0)),
            decode_responses=True
        )

    def set_user_data(self, username, data):
        user_key = f"user:{username}"
        self.client.hmset(user_key, data)

    def get_user_data(self, username):
        user_key = f"user:{username}"
        return self.client.hgetall(user_key)

    def append_user_message(self, username, message):
        user_key = f"user:{username}:messages"
        self.client.rpush(user_key, message)

    def get_user_messages(self, username):
        user_key = f"user:{username}:messages"
        return self.client.lrange(user_key, 0, -1)

