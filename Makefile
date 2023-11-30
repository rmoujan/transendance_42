.PHONY: all up up-d down build rebuild clean ps logs logs-f restart prune prune-a

all: up

up:
	docker-compose up

up-d:
	docker-compose up -d

down:
	docker-compose down

build:
	docker-compose up -d --build

rebuild:
	docker-compose build --no-cache

clean:
	docker-compose down --rmi all --volumes
stop:
	docker-compose stop



stop-clean:
	docker stop $(docker ps -aq)
	docker rm  $(docker ps -aq)

ps:
	docker-compose ps

logs:
	docker-compose logs

logs-f:
	docker-compose logs -f

# Restart is commented out as it doesn't have a corresponding service name in your example.
# Uncomment and modify if needed.
# restart:
#	docker-compose restart

prune:
	docker system prune

prune-a:
	docker system prune -af --volumes
