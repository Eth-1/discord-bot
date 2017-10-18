FROM leopotam/alpine-node:latest
COPY . /app
WORKDIR /app
RUN npm install && npm run build && npm prune --production && rm -rf /app/src
CMD ["npm", "start"]