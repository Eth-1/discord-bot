FROM mhart/alpine-node:latest
WORKDIR /app
COPY . /app
RUN npm install && npm run build && npm prune --production && rm -rf /app/src
CMD ["npm", "start"]