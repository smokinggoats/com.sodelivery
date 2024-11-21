FROM node:20.18.0

WORKDIR /app

EXPOSE 5173

COPY ./ /app

RUN make install

RUN make build-web

CMD ["npm", "run", "dev"]