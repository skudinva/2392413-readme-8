FROM node:20.11.1-slim
RUN apt-get update && apt-get install -y openssl libssl-dev
WORKDIR /opt/readme-blog
COPY dist/apps/blog/package.json .
RUN npm install --omit=dev
COPY dist/apps/blog/assets/prisma/schema.prisma ./schema.prisma
RUN npx prisma generate --schema schema.prisma
RUN cp -R ../../node_modules/.prisma ./node_modules && rm -Rf ../node_modules
COPY dist/apps/blog .
CMD ["node", "./main.js"]
