# Use the official Node image as the base image
FROM node:latest

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json to the container
WORKDIR /app/game

COPY ./game .

RUN npm install

WORKDIR /app/client

COPY ./client .
# Install project dependencies
RUN npm run install-deps

# Expose the port that your Vite app will run on
EXPOSE 5173

CMD ["npm", "run", "dev", "--", "--host"]
