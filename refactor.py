import os
import shutil

# Define the root directory and the new client directory
root_directory = os.path.dirname(os.path.abspath(__file__))
client_directory = os.path.join(root_directory, 'client')

# Create the client directory if it does not exist
if not os.path.exists(client_directory):
    os.makedirs(client_directory)
    print(f"Created directory: {client_directory}")
else:
    print(f"Directory already exists: {client_directory}")

# Define the directories to exclude
exclude_directories = {'server', 'client'}

# Move files and directories to the client directory
for item in os.listdir(root_directory):
    item_path = os.path.join(root_directory, item)
    if item not in exclude_directories and os.path.basename(item_path) != os.path.basename(__file__):
        print(f"Moving {item_path} to {client_directory}")
        shutil.move(item_path, client_directory)

print("All items except 'scripts' and 'server' have been moved to the 'client' directory.")
