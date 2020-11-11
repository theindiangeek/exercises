FROM node:12.18.3

WORKDIR /app

COPY ["package.json", "package-lock.json*", ".env", "./"]

RUN npm install

COPY . .

EXPOSE 8081:8081

CMD [ "node", "server.js" ]
