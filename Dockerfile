FROM node:18-alpine as frontend-builder
WORKDIR /app/frontend
COPY frontend/package*.json ./
RUN npm install
COPY frontend/ .
RUN npm run build

FROM node:18-alpine as backend-builder
WORKDIR /app/backend
COPY backend/package*.json ./
RUN npm install
COPY backend/ .

FROM node:18

# Install Java, Nginx and other dependencies
RUN apt-get update && apt-get install -y \
    default-jre \
    nginx \
    curl \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Create necessary directories and set up nginx
RUN mkdir -p data dynamodb /var/log/nginx /run/nginx && \
    chown -R www-data:www-data /var/log/nginx /run/nginx && \
    rm -f /etc/nginx/sites-enabled/default  # Remove default nginx config

# Copy backend and frontend
COPY --from=backend-builder /app/backend ./
COPY --from=frontend-builder /app/frontend/dist /usr/share/nginx/html/

# Install production dependencies
RUN npm ci --only=production

# Download and setup DynamoDB Local
RUN curl -L -o dynamodb_local_latest.tar.gz https://s3.us-west-2.amazonaws.com/dynamodb-local/dynamodb_local_latest.tar.gz && \
    tar -xzf dynamodb_local_latest.tar.gz -C dynamodb && \
    rm dynamodb_local_latest.tar.gz

# Copy Nginx configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Fix permissions
RUN chown -R www-data:www-data /usr/share/nginx/html && \
    chmod -R 755 /usr/share/nginx/html && \
    chown -R node:node /app

# Create startup script
RUN echo '#!/bin/bash\n\
mkdir -p /run/nginx\n\
nginx -g "daemon off;" &\n\
cd /app/dynamodb\n\
java -Djava.library.path=./DynamoDBLocal_lib -jar DynamoDBLocal.jar -sharedDb -dbPath /app/data &\n\
cd /app\n\
sleep 5\n\
NODE_ENV=development node scripts/createTables.js\n\
npm start\n' > /usr/local/bin/start.sh && \
    chmod +x /usr/local/bin/start.sh

EXPOSE 80 3000 8000

CMD ["/usr/local/bin/start.sh"]