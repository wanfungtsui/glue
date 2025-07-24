#!/bin/bash

# Start the Node.js backend server
echo "Starting Node.js backend server..."
cd /app
npm start &

# Wait for backend to start
echo "Waiting for backend to start..."
sleep 10

# Start the Gradio frontend
echo "Starting Gradio frontend..."
python app.py 