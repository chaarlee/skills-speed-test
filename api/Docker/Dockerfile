FROM node:slim

ENV NODE_ENV development

WORKDIR /app

COPY . .

RUN npm install

CMD [ "npm", "run", "serve" ]

EXPOSE 5432
