FROM node:23.3.0 AS prod
WORKDIR /usr/src
COPY package*.json ./
COPY prod.json ./
RUN ["npm", "i"]
COPY . .
CMD ["npm", "run", "prod"]