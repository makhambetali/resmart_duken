.PHONY: up down build logs shell migrate collectstatic test

up:
	docker-compose up -d

down:
	docker-compose down

build:
	docker-compose build --no-cache

logs:
	docker-compose logs -f

backend-logs:
	docker-compose logs -f backend

shell:
	docker-compose exec backend python manage.py shell

migrate:
	docker-compose exec backend python manage.py migrate

makemigrations:
	docker-compose exec backend python manage.py makemigrations

collectstatic:
	docker-compose exec backend python manage.py collectstatic --noinput

test:
	docker-compose exec backend python manage.py test

celery-logs:
	docker-compose logs -f celery

celery-beat-logs:
	docker-compose logs -f celery-beat