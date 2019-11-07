FROM node:latest

# Workdir
WORKDIR /app

EXPOSE 8080

COPY ./package.json .
COPY ./package-lock.json .

RUN npm install 


COPY ./src ./src
COPY ./server.js .
COPY ./models.js .
COPY ./key .



CMD [ "node", "server.js" ]