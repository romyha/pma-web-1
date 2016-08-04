FROM node:latest

# Create app directory
RUN mkdir -p /usr/src/pma-web
WORKDIR /usr/src/pma-web

# Install app dependencies
COPY package.json /usr/src/pma-web
RUN npm install

# Bundle source code inside Docker image
COPY . /usr/src/pma-web

# Map port by docker daemon
EXPOSE 8000

CMD ["npm", "start"]

