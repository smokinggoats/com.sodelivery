FROM node:20.18.0

WORKDIR /app

EXPOSE 5173

COPY ./ /app

RUN npm ci

RUN npm run build

CMD ["npm", "run", "dev"]