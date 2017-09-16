FROM node:boron

ADD https://github.com/krallin/tini/releases/download/v0.13.0/tini /tini

WORKDIR /var/www/app

RUN chmod +x /tini

COPY package.json .

RUN npm install

COPY . .

RUN mkdir config

EXPOSE 8080

ENTRYPOINT ["/tini", "--"]

CMD ["npm", "start"]
