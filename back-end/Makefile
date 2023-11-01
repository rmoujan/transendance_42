COMPOSE_FILE := docker-compose.yml

.PHONY: up down clean

up:
	docker-compose -f $(COMPOSE_FILE) up -d --build

down:
	docker-compose -f $(COMPOSE_FILE) down

clean:
	#docker-compose -f $(COMPOSE_FILE) down --volumes --remove-orphans
	docker stop $$(docker ps -qa);\
 	docker rm $$(docker ps -qa);\
 	docker rmi -f $$(docker images -qa);\
 	docker volume rm $$(docker volume ls -q);\
 	docker network rm $$(docker network ls -q);\