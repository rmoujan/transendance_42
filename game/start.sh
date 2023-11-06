#!/bin/bash
echo "Building CSS..."
npm run build-css
echo "Compiling..."
npm run compile
echo "Building..."
npm run build
echo "Running the Server..."
npm run run-server
