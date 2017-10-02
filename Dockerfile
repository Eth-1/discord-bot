FROM mhart/alpine-node:latest
RUN npm install -g pm2
WORKDIR /app
COPY . /app
RUN npm install && npm run build
RUN rm -rf /app/src
CMD ["npm", "run", "pm2-docker"]