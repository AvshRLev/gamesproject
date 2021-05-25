all: lint test

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

