# Dockerfile to deploy Nest.js

# Base image
FROM node:18-alpine

# Create app directory
WORKDIR /app

# Install app dependencies
COPY package.json yarn.lock ./

# Install dependencies
RUN yarn install --production

# Copy app source code
COPY . .

# Build app
RUN yarn build

# Expose port
EXPOSE 5000

# Start app
CMD ["yarn", "start:prod"]