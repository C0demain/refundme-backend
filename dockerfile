FROM node:22-alpine

WORKDIR /usr/src/app

COPY package.json package-lock.json ./

RUN npm install 

COPY  . .

RUN npm run build 

EXPOSE 3000

CMD [ "npm", "run", "start:dev"]