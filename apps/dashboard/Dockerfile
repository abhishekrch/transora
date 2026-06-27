FROM node:20-alpine AS base
RUN corepack enable

FROM base AS builder
WORKDIR /app
COPY pnpm-lock.yaml package.json ./
COPY apps/dashboard/package.json ./apps/dashboard/
COPY packages/shared/package.json ./packages/shared/
COPY packages/ui/package.json ./packages/ui/
COPY packages/typescript-config/package.json ./packages/config/typescript/
COPY packages/eslint-config/package.json ./packages/config/eslint/
RUN pnpm install --frozen-lockfile
COPY . .
RUN pnpm turbo build --filter=dashboard

FROM nginx:alpine AS production
COPY --from=builder /app/apps/dashboard/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
