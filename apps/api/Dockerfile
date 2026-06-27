FROM node:20-alpine AS base
RUN corepack enable

FROM base AS builder
WORKDIR /app
COPY pnpm-lock.yaml package.json ./
COPY apps/api/package.json ./apps/api/
COPY packages/shared/package.json ./packages/shared/
COPY packages/typescript-config/package.json ./packages/config/typescript/
COPY packages/eslint-config/package.json ./packages/config/eslint/
RUN pnpm install --frozen-lockfile
COPY . .
RUN pnpm turbo build --filter=api
RUN cd apps/api && npx prisma generate

FROM base AS production
WORKDIR /app
COPY --from=builder /app/apps/api/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/apps/api/prisma ./prisma
COPY --from=builder /app/apps/api/package.json ./
EXPOSE 3000
CMD ["node", "dist/main.js"]
