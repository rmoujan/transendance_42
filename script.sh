#!/bin/bash

# ANSI color codes
GREEN="\033[32m"
YELLOW="\033[33m"
BLUE="\033[34m"
RESET="\033[0m"

function check_docker_status() {
  # Check if Docker daemon is running
  if [ "$(docker info >/dev/null 2>&1 && echo 0 || echo 1)" -eq 0 ]; then
    echo -e "Docker is already running."
    return 0
  else
    return 1
  fi
}

function install_docker() {
  echo -e "Docker Installation Script"

  # Check if Docker is already running
  if check_docker_status; then
    return
  fi

  # Prompt the user for the installation folder
  read -p "Choose a destination folder to install Docker (press Enter to use goinfre, recommended): " docker_destination

  # Use the default installation location if no folder is specified
  if [ -z "$docker_destination" ]; then
    docker_destination="/goinfre/$USER/docker"
  fi

  # Provide clear instructions for Docker installation
  # echo -e "Please install Docker through the ${BLUE}åManaged Software Center${RESET} and then press Enter to continue."
  # open -a "Managed Software Center"
  # read -n 1 -s -r -p "Press Enter to continue..."

  # Check if Docker is already installed
  if check_docker_status; then
    return
  fi

  # Clean up previous configurations
  echo -e "Cleaning up old Docker configurations..."
  rm -rf ~/Library/Containers/com.docker.{docker,helper} ~/.docker > /dev/null 2>&1

  # Create the Docker destination folder and link
  echo -e "Installing Docker to $docker_destination..."
  mkdir -p "$docker_destination"/{com.docker.{docker,helper},.docker} > /dev/null 2>&1
  ln -sf "$docker_destination"/com.docker.docker ~/Library/Containers/com.docker.docker > /dev/null 2>&1
  ln -sf "$docker_destination"/com.docker.helper ~/Library/Containers/com.docker.helper > /dev/null 2>&1
  ln -sf "$docker_destination"/.docker ~/.docker > /dev/null 2>&1

  # Provide confirmation message
  echo -e "Docker installed in ${GREEN}$docker_destination${RESET}"

  # Open Docker
  open -g -a Docker
}

function run_docker_compose() {
  # Change directory to 'back-end'
  cd back-end

  # Run docker-compose
  echo -e "Running 'docker-compose' in the 'back-end' directory..."
  docker-compose up -d

  if [ $? -eq 0 ]; then
    echo -e "docker-compose executed in the 'back-end' directory."
  else
    echo -e "docker-compose failed. Prisma commands not executed."
    return
  fi

  # Run Prisma migrate dev
  echo -e "Running 'npx prisma migrate dev'..."
  npx prisma migrate dev

  # Check if the migration was successful
  if [ $? -eq 0 ]; then
    # Migrate successful, now run Prisma Studio
    echo -e "Migrate successful. Running 'npx prisma studio'..."
    npx prisma studio
  else
    echo -e "Migration failed. Prisma Studio not executed."
  fi

  # Return to the original directory
  cd ..
}

# Call the install_docker function
install_docker

# Prompt the user to run Docker Compose and Prisma commands
read -p "Press Enter to run 'docker-compose' in the 'back-end' directory and execute Prisma commands: " run_docker_prisma

if [ -z "$run_docker_prisma" ]; then
  run_docker_compose
else
  echo -e "Docker Compose and Prisma commands not executed."
fi
