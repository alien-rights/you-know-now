#!/bin/bash

# Server details
SERVER="ssh.bashdev.com"
USER="root"
REMOTE_DIR="/Yunona/youknownow.nl/"

# Local directory (current directory)
LOCAL_DIR="."

# SFTP batch commands file
SFTP_COMMANDS=$(mktemp)

# Add server's host key to known_hosts
ssh-keyscan -H $SERVER >> ~/.ssh/known_hosts 2>/dev/null

# Function to generate SFTP commands for a directory
generate_sftp_commands() {
    local dir="$1"
    local remote_base="$2"
    
    # Try to create the remote directory, but don't fail if it already exists
    echo "-mkdir ${remote_base}${dir#$LOCAL_DIR}" >> "$SFTP_COMMANDS"
    
    # Upload files in the current directory
    find "$dir" -maxdepth 1 -type f -print0 | while IFS= read -r -d '' file; do
        echo "put \"$file\" \"${remote_base}${file#$LOCAL_DIR}\"" >> "$SFTP_COMMANDS"
    done
    
    # Recurse into subdirectories
    find "$dir" -mindepth 1 -type d -print0 | while IFS= read -r -d '' subdir; do
        generate_sftp_commands "$subdir" "$remote_base"
    done
}

# Generate SFTP commands
generate_sftp_commands "$LOCAL_DIR" "$REMOTE_DIR"

# Execute SFTP commands
sftp -o StrictHostKeyChecking=no -b "$SFTP_COMMANDS" "${USER}@${SERVER}"

# Start youknownow.service on the server
ssh -o StrictHostKeyChecking=no "${USER}@${SERVER}" "systemctl start youknownow.service"

# Clean up
rm "$SFTP_COMMANDS"

echo "Upload complete and service started!"