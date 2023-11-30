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

# Copy the rest of the application code to the container

# Build the Vite project
#RUN npm run build

# Specify the command to run your application
CMD ["npm", "run", "dev", "--", "--host"]
# FROM node:18.13.0-buster

# USER node
# EXPOSE 5173
# WORKDIR /home/front

# COPY . ./

# COPY ./start.sh ./

# USER root
# RUN npm install --prefix /home/front

# CMD ["bash", "+x", "/home/front/start.sh"]