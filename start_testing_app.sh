#!/bin/bash
# Store the current directory
CURRENT_DIR=$(pwd)

# Open a new terminal for the client script
echo "Opening a new terminal for the client script..."
open -a Terminal "$CURRENT_DIR/client/scripts/run_client.sh"

# Open a new terminal for the server script and activate the virtual environment
echo "Opening a new terminal for the server script..."
open -a Terminal "$CURRENT_DIR/server/venv/bin/activate && cd $CURRENT_DIR/server/scripts && ./run_server.sh"

# Success message
echo "Successfully started both client and server scripts in new terminals"