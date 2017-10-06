FROM mhart/alpine-node:latest
WORKDIR /app
COPY . /app
RUN npm install && npm run build
RUN rm -rf /app/src
CMD ["npm", "start"]