DOCKER_COMPOSE := docker-compose
PNPM := $(shell command -v pnpm 2> /dev/null)

default: dev

### Main ###

.PHONY: docker-compose
docker-compose: docker-compose.override.yaml
	@echo COMPOSE_FILE=${COMPOSE_FILE}

.PHONY: prerequisites
prerequisites:
ifndef PNPM
	$(error "pnpm is not available please install pnpm, refer to https://pnpm.io/installation")
endif

.PHONY: dev ## Development on local environment
dev: prerequisites .env
	$(PNPM) install
	$(DOCKER_COMPOSE) up -d --remove-orphans
	@echo "Waiting for database to be ready..."
	@while ! docker inspect -f '{{.State.Health.Status}}' my-app-db | grep -q "^healthy$$"; do sleep 1; echo "Waiting..."; done
	$(PNPM) run db:push
	$(PNPM) run dev

.PHONY: stop
stop:
	$(DOCKER_COMPOSE) down -v --remove-orphans

.PHONY: db-seed
db-seed:
	$(PNPM) run db:seed

### Resources ###

docker-compose.override.yaml: docker-compose.override.yaml.dist
	@echo ">>> File '$@' doesn't exist or it is older than '$?'. Trying to override..."
	cp -i $? $@ && touch $@

.env: .env.local
	@echo ">>> File '$@' doesn't exist or it is older than '$?'. Trying to override..."
	cp -i $? $@ && touch $@
