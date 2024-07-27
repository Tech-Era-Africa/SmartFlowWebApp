
# Use the official lightweight Node.js 18 image.
# https://hub.docker.com/_/node
FROM node:19-alpine

# Create and change to the app directory.
WORKDIR /usr/src/app

# Install app dependencies
COPY package*.json ./
RUN npm install -D rollup oxc-parser
RUN npm install

# Bundle app source
COPY . .

# Build the app
RUN npm run build

# Expose the port
EXPOSE 3000

# Command to run the application
CMD ["node", ".output/server/index.mjs"]