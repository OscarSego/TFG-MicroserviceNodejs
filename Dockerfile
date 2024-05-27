FROM node:18

WORKDIR /app

COPY package*.json /app

RUN npm install --production

COPY dist/ /app

RUN ls /app

EXPOSE 3000

CMD ["node", "index.js"]