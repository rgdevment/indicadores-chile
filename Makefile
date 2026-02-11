# ─────────────────────────────────────────────
# Makefile — indicadores-chile
# ─────────────────────────────────────────────
APP_NAME      := indicadores-chile
COMPOSE       := docker compose
COMPOSE_DEV   := $(COMPOSE) -f docker-compose.dev.yml
COMPOSE_PROD  := $(COMPOSE) -f docker-compose.yml

# ─────────────────────────────────────────────
# Development
# ─────────────────────────────────────────────
.PHONY: dev dev-build dev-down dev-logs dev-restart

## Start dev environment (hot-reload, debugger on :9229)
dev:
	$(COMPOSE_DEV) up

## Rebuild & start dev environment
dev-build:
	$(COMPOSE_DEV) up --build

## Stop dev environment
dev-down:
	$(COMPOSE_DEV) down

## Follow dev logs
dev-logs:
	$(COMPOSE_DEV) logs -f $(APP_NAME)-dev

## Restart the app container
dev-restart:
	$(COMPOSE_DEV) restart $(APP_NAME)-dev

# ─────────────────────────────────────────────
# Production
# ─────────────────────────────────────────────
.PHONY: prod prod-build prod-down prod-logs prod-restart

## Start production environment
prod:
	$(COMPOSE_PROD) up -d

## Rebuild & start production environment
prod-build:
	$(COMPOSE_PROD) up -d --build

## Stop production environment
prod-down:
	$(COMPOSE_PROD) down

## Follow production logs
prod-logs:
	$(COMPOSE_PROD) logs -f $(APP_NAME)

## Restart only the app container
prod-restart:
	$(COMPOSE_PROD) restart $(APP_NAME)

# ─────────────────────────────────────────────
# Infrastructure — not needed (SQLite embedded)
# ─────────────────────────────────────────────

# ─────────────────────────────────────────────
# Quality & Tests
# ─────────────────────────────────────────────
.PHONY: test test-cov lint lint-fix format

test:
	npm test

test-cov:
	npm run test:cov

lint:
	npm run lint

lint-fix:
	npm run lint:fix

format:
	npm run format

# ─────────────────────────────────────────────
# Docker image (standalone)
# ─────────────────────────────────────────────
.PHONY: docker-build docker-run docker-size

## Build production image
docker-build:
	docker build --target production -t $(APP_NAME):latest .

## Run standalone production container
docker-run:
	docker run --rm -p 3000:3000 --env-file .env $(APP_NAME):latest

## Show image size
docker-size:
	@docker images $(APP_NAME):latest --format "{{.Repository}}:{{.Tag}} — {{.Size}}"

# ─────────────────────────────────────────────
# Cleanup
# ─────────────────────────────────────────────
.PHONY: clean clean-all

## Remove stopped containers, dangling images, build cache
clean:
	docker system prune -f

## Remove everything including volumes (⚠️ destroys DB data)
clean-all:
	$(COMPOSE_DEV) down -v
	docker system prune -af --volumes

# ─────────────────────────────────────────────
# Help
# ─────────────────────────────────────────────
.PHONY: help
help:
	@echo ""
	@echo "  $(APP_NAME) — Available commands"
	@echo "  ────────────────────────────────────────"
	@echo ""
	@echo "  Development:"
	@echo "    make dev            Start dev (hot-reload + debugger)"
	@echo "    make dev-build      Rebuild & start dev"
	@echo "    make dev-down       Stop dev"
	@echo "    make dev-logs       Follow dev logs"
	@echo "    make dev-restart    Restart app container only"
	@echo ""
	@echo "  Production:"
	@echo "    make prod           Start production (detached)"
	@echo "    make prod-build     Rebuild & start production"
	@echo "    make prod-down      Stop production"
	@echo "    make prod-logs      Follow production logs"
	@echo "    make prod-restart   Restart app container only"
	@echo ""
	@echo "  Infrastructure:"
	@echo "    (SQLite integrado, sin servicios externos)"
	@echo ""
	@echo "  Quality:"
	@echo "    make test           Run tests"
	@echo "    make test-cov       Run tests with coverage"
	@echo "    make lint           Run linter"
	@echo "    make lint-fix       Run linter (auto-fix)"
	@echo "    make format         Format code"
	@echo ""
	@echo "  Docker:"
	@echo "    make docker-build   Build production image"
	@echo "    make docker-run     Run standalone container"
	@echo "    make docker-size    Show image size"
	@echo ""
	@echo "  Cleanup:"
	@echo "    make clean          Prune stopped containers"
	@echo "    make clean-all      Remove everything + volumes"
	@echo ""

.DEFAULT_GOAL := help
