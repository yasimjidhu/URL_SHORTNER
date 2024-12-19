FROM node:18

WORKDIR /app

COPY package.json package-lock.json* ./

RUN npm install

COPY . .

RUN npm install -g tsx

EXPOSE 5000

CMD ["npx", "tsx", "src/index.ts"]
