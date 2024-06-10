import socket
import os
from dotenv import load_dotenv, set_key

def get_local_ip():
    try:
        # Create a temporary socket
        s = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
        # Connect to an external IP (does not actually connect, just helps get the local IP)
        s.connect(("8.8.8.8", 80))
        # Get the local IP address
        local_ip = s.getsockname()[0]
    except Exception as e:
        print(f"Error occurred: {e}")
        local_ip = "127.0.0.1"  # Default to localhost if there's an error
    finally:
        s.close()
    return local_ip

def write_ip_to_env(ip_address):
    # Get the path to the parent directory
    parent_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), '..'))
    # Path to the .env file in the parent directory
    env_path = os.path.join(parent_dir, '.env')
    
    # Load existing environment variables
    load_dotenv(env_path)
    
    # Set the SERVER_IP in the .env file
    set_key(env_path, 'SERVER_IP', ip_address)

if __name__ == "__main__":
    local_ip = get_local_ip()
    print(f"Local IP Address: {local_ip}")
    write_ip_to_env(local_ip)
