# PyDF-Diff Dockerfile
FROM ubuntu:jammy

RUN apt-get install python3 python3-pip python3-lxml poppler-utils

RUN pip3 install \
    fastapi \
    uvicorn \
    pdf-diff \
    fastapi-utils

COPY ./backend /server