.PHONY: help install build start dev clean

help:
	@echo "Commands: make install, make build, make start, make dev, make clean"

install:
	npm install
	cd frontend && npm install

build:
	cd frontend && npm run build

start:
	npx start-server -s ./frontend/dist

dev:
	cd frontend && npm run dev

clean:
	rm -rf frontend/dist
	rm -rf frontend/node_modules
	rm -rf node_modules