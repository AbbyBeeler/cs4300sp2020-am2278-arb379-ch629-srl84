FROM node:lts-alpine as build-stage
RUN mkdir client
WORKDIR client
COPY client/package*.json ./
RUN npm install
COPY client .
RUN npm run build

FROM python:3.7.6 as backend-builder
RUN mkdir server
WORKDIR server
COPY server/requirements.txt .
RUN pip install -r requirements.txt
COPY server .
RUN mkdir ../client
COPY --from=build-stage client ../client

CMD ["python", "-u", "./app.py"]