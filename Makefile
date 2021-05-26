all: lint test

bundle:
	npx webpack

run:
	npx webpack
	python manage.py runserver 

lint:
	npm run lint

test:
	make run & sleep 5 && npm run test
	
migrate:
	python manage.py makemigrations	
	python manage.py migrate

docker-build:
	docker build . -t docker-django

docker-run: docker-build
	docker run -p 8000:8000 docker-django
