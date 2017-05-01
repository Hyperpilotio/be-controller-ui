FROM node:7-alpine

RUN apk add --update nginx openssl curl
RUN wget http://yarnpkg.org/latest.tar.gz && \
    tar -xzf latest.tar.gz

ENV PATH $PATH:/dist/bin

COPY . /home/app
WORKDIR /home/app

RUN yarn install && yarn build

ENV INFLUXDB_HOST influxsrv
ENV INFLUXDB_PORT 8086
ENV INFLUXDB_USER root
ENV INFLUXDB_PASS root
ENV INFLUXDB_NAME_CONTROLLER be_controller

CMD yarn run start
