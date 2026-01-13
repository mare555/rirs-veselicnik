FROM docker:latest

WORKDIR /app

COPY docker-compose.yml .
COPY backend ./backend
COPY frontend ./frontend

CMD ["docker-compose", "up"]