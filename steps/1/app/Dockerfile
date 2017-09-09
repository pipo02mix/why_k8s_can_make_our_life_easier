FROM node:boron

WORKDIR /var/www/app

COPY package.json .

RUN npm install

COPY . .

RUN mkdir config

EXPOSE 8080

CMD ["npm", "start"]
