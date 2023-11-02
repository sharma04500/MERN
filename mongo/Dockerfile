FROM mongo:latest
ENV MONGO_INITDB_DATABASE=admin
COPY script.js /docker-entrypoint-initdb.d/
COPY mongod.conf /etc/mongo  
