FROM node:12.18.3

WORKDIR /app

COPY ["package.json", "package-lock.json*", ".env", "./"]

COPY . .
RUN npm install
RUN npm run build
#RUN npm run start

CMD [ "npm", "run", "start" ]
