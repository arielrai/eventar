FROM maven
COPY . /
RUN mvn clean install
CMD java -jar target/eventar-1.0.0.jar