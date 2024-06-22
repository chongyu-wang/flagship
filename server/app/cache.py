voice_systems_cache = {}
messages_cache = {}

def update_user_voice_system(username, voice_system):
    voice_systems_cache[username] = voice_system

def update_messages(username, messages):
    messages_cache[username] = messages

def append_cache_messages(username, message, user_sent_this):
    if user_sent_this:
        cur_message = {"role": "user", "content": message}
        messages_cache[username].append(cur_message)
    else:
        cur_message = {"role": "assistant", "content": message}
        messages_cache[username].append(cur_message)

def get_cache_messages(username):
    return messages_cache[username]

def get_cache_voice_system(username):
    return voice_systems_cache[username]
