FROM node
ADD . /app
WORKDIR /app
RUN npm install
CMD node main.js
EXPOSE 80
