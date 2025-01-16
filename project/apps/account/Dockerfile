FROM node:20.11.1-alpine
WORKDIR /opt/readme-account
COPY dist/apps/account .
RUN npm install --omit=dev
CMD ["node", "./main.js"]
