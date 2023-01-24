FROM node:14

COPY ./data-generator .

RUN npm install

CMD ["npm", "start"]




