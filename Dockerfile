# --- Build stage ---
FROM oven/bun:1 AS build
WORKDIR /app

# PUBLIC_ vars are baked into the static output at build time.
ARG PUBLIC_SANITY_PROJECT_ID
ARG PUBLIC_SANITY_DATASET="production"
ARG PUBLIC_SANITY_API_VERSION="2024-06-10"
ENV PUBLIC_SANITY_PROJECT_ID=$PUBLIC_SANITY_PROJECT_ID \
    PUBLIC_SANITY_DATASET=$PUBLIC_SANITY_DATASET \
    PUBLIC_SANITY_API_VERSION=$PUBLIC_SANITY_API_VERSION

COPY package.json bun.lock ./
RUN bun install --frozen-lockfile
COPY . .
RUN bun run build

# --- Serve stage ---
FROM nginx:alpine AS serve
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 80
