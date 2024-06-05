#!/bin/bash

# Change to the directory where this script is located
cd "$(dirname "$0")"

# Run the Python script to get the local IP
python3 get_ip.py

# Check for errors
if [ $? -ne 0 ]; then
    echo "Error occurred while running get_ip.py"
    exit $?
fi

# Change to the parent directory
cd ..

# Run expo
npx expo start

# Check for errors
if [ $? -ne 0 ]; then
    echo "Error occurred while running expo"
    exit $?
fi

# Success message
echo "Successfully started expo"
