FROM node:20.11.1-alpine
WORKDIR /opt/readme-blog
COPY dist/apps/blog/package.json .
RUN npm install --omit=dev
COPY dist/apps/blog .
CMD ["node", "./main.js"]
