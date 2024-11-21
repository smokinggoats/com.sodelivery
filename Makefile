.PHONY: start-directus start-web build build-docker build-web install publish-docker

publish-docker:
	@docker push smokinggoats/com.sodelivery

install:
	@npm ci

build: build-web build-docker

build-web:
	@npm run build

build-docker:
	@docker-compose build --no-cache

start-directus:
	@docker-compose -f container/directus/docker-compose.yaml --env-file ./.env up

start-web:
	@npm run dev
