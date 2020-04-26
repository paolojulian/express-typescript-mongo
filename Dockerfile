FROM node:latest

WORKDIR /usr/src/app

COPY package.json .
COPY package-lock.json .

RUN npm install

ADD . /usr/src/app

RUN npm run build

EXPOSE 8081

CMD ["npm", "start"]