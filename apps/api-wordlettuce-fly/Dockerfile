# syntax = docker/dockerfile:1

# Adjust BUN_VERSION as desired
ARG BUN_VERSION=1.2.2
ARG PNPM_VERSION=10.4.1
ARG NODE_VERSION=22

FROM node:${NODE_VERSION}-slim AS base
# FROM oven/bun:${BUN_VERSION}-slim as base

LABEL fly_launch_runtime="Bun"

# Bun app lives here
WORKDIR /app

# Set production environment
ENV NODE_ENV="production"

# Throw-away build stage to reduce size of final image
FROM base AS build

# Install packages needed to build node modules
RUN apt-get update -qq && \
    apt-get install --no-install-recommends -y build-essential node-gyp pkg-config python-is-python3

RUN apt-get update -qq && \
    apt-get install -y ca-certificates && \
    update-ca-certificates

RUN corepack enable

# Copy application code
COPY --link . .
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --frozen-lockfile
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm packages build
# RUN bun install --ignore-scripts

# Final stage for app image
FROM oven/bun:${BUN_VERSION}-slim AS app

# Copy built application
COPY --from=build /app /app
COPY --from=build /etc/ssl/certs/ca-certificates.crt /etc/ssl/certs/

# Start the server by default, this can be overwritten at runtime
EXPOSE 3000
CMD [ "bun", "/app/apps/api-wordlettuce-fly/src/index.ts" ]