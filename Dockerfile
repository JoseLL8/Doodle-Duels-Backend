FROM node:26-alpine AS builder

#RUN apk add --no-cache python3 make g++

#node25 and forward dont include corepack
RUN npm install -g corepack@latest

RUN corepack enable && corepack prepare pnpm@latest --activate

WORKDIR /app

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./

#freeze versions for replicability
RUN pnpm install --frozen-lockfile

COPY . .

RUN pnpm run build

FROM node:26-alpine AS runner

# reinstalamos herramientas
#RUN apk add --no-cache python3 make g++

RUN npm install -g corepack@latest

RUN corepack enable && corepack prepare pnpm@latest --activate

WORKDIR /app

#enable prod
ENV NODE_ENV=production

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
RUN pnpm install --prod --frozen-lockfile

#dist is compiled from previous stage
COPY --from=builder /app/dist ./dist

#todo get from env
EXPOSE 8000

CMD ["node", "dist/main"]