FROM mysql:5.7.15

MAINTAINER me

ENV  MYSQL_ROOT_PASSWORD=example

ADD ./schema.sql /docker-entrypoint-initdb.d

EXPOSE 3306