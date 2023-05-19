# PyDF-Diff Dockerfile
# Build the Frontend
FROM node:latest AS uibuilder

WORKDIR /uibuild

COPY ./frontend /uibuild

RUN yarn install
RUN npm audit fix || true
RUN npm run build

# Build the Running Application
FROM ubuntu:latest

RUN apt-get update && apt-get upgrade -y

RUN apt-get install python3 python3-pip python3-lxml poppler-utils -y

COPY ./backend /server

# Copy React Files
COPY --from=uibuilder /backend /server

WORKDIR /server

RUN pip3 install -r /server/requirements.txt

# Run Server
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "80"]
