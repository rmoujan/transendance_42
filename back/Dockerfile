FROM node:18.13.0-buster

RUN apt-get update && apt-get install -y postgresql-client

EXPOSE 3000

USER node
WORKDIR /home/back

COPY . ./

COPY  ./start.sh ./

USER root
RUN npm install --prefix /home/back

CMD ["bash", "+x", "/home/back/start.sh"]