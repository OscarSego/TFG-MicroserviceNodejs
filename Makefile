build:
        docker build -f Dockerfile -t nebrija/microservice-login:latest .

run:
        docker run -p 3000:3000 nebrija/microservice-login:latest