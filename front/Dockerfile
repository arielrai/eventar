FROM node
COPY . /
RUN npm install --global yo gulp-cli bower
RUN npm install && bower install --allow-root && gulp
CMD gulp serve:dist