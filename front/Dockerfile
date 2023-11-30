# Use the official Node image as the base image
FROM node:16-alpine

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json to the container
COPY package*.json ./

# Install project dependencies
RUN npm run install-deps

# Copy the rest of the application code to the container
COPY . .

# Build the Vite project
RUN npm run build

# Expose the port that your Vite app will run on
EXPOSE 3000

# Specify the command to run your application
CMD ["npm", "run", "serve"]
