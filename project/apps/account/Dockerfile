FROM node:20.11.1-alpine
WORKDIR /opt/readme-account
COPY dist/apps/account/package.json .
RUN npm install --omit=dev
COPY dist/apps/account .
CMD ["node", "./main.js"]
