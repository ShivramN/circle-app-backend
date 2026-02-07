FROM node:14.16.0-alpine

ENV TZ=Asia/Kolkata

WORKDIR /app

ADD package.json /app

ADD . /app

RUN apk add nano

RUN npm install --production

RUN apk add --update tzdata && cp /usr/share/zoneinfo/Asia/Kolkata /etc/localtime

VOLUME ["/var/log"]

CMD [ "node", "server.js" ]