# syntax=docker/dockerfile:experimental
#
# This Dockerfile is used in conjunction with the Makefile to perform
# Multi-stage Docker builds (https://docs.docker.com/develop/develop-images/multistage-build/)
# It is most optimal if it's run using docker with buildkit support (https://docs.docker.com/develop/develop-images/build_enhancements/)
#

# Creates the container for linting the Dockerfile (this file)
# Also runs the linter
FROM ebnexus02.devlab2k.testnet.rim.net:8216/hadolint/hadolint:v1.18.0-6-ga0d655d-alpine AS lint
COPY Dockerfile .
RUN ["hadolint", "Dockerfile"]

# Build the code in an appropriately versioned environment
FROM ebnexus02.devlab2k.testnet.rim.net:8216/library/node:14-alpine AS build
USER node

WORKDIR /build

ENV NODE_EXTRA_CA_CERTS=/build/.yarn-registry.crt

# main
COPY --chown=node:node package.json yarn.lock *.crt ./
# libs
COPY --chown=node:node ./libs/theme/package.json ./libs/theme/package.json
COPY --chown=node:node ./libs/hooks/package.json ./libs/theme/package.json
COPY --chown=node:node ./libs/icons/package.json ./libs/icons/package.json
COPY --chown=node:node ./libs/pwa/package.json ./libs/pwa/package.json
COPY --chown=node:node ./libs/assets/package.json ./libs/assets/package.json
# apps
COPY --chown=node:node ./apps/mssp/package.json ./apps/mssp/package.json
COPY --chown=node:node ./apps/mtd/package.json ./apps/mtd/package.json

# RUN --mount=type=bind,target=/build,rw \
#     --mount=type=cache,target=/home/node/.cache \
#     echo 'Building' \
#   && yarn install  --pure-lockfile \
#   && yarn prod \
#   && mv ./prod /app

RUN --mount=type=cache,id=yarn-cache,target=/home/node/.cache,uid=1000,gid=1000 \
    --mount=type=cache,id=node-modules,target=/build/node_modules,uid=1000,gid=1000 \
    --mount=type=cache,id=node-cache,target=/build/node_modules/.cache,uid=1000,gid=1000 \
  ["yarn", "--prefer-offline", "--frozen-lockfile"]

COPY --chown=node:node . ./

RUN --mount=type=cache,id=yarn-cache,target=/home/node/.cache,uid=1000,gid=1000 \
    --mount=type=cache,id=node-modules,target=/build/node_modules,uid=1000,gid=1000 \
    --mount=type=cache,id=node-cache,target=/build/node_modules/.cache,uid=1000,gid=1000 \
    --mount=type=cache,id=build-cache,target=/build/tmp,uid=1000,gid=1000 \
    --mount=type=cache,id=tsc-cache,target=/build/tsc-out,uid=1000,gid=1000 \
  export NODE_ENV=production \
  && yarn nx template dsm --no-cache \
  && yarn nx run-many --parallel --maxParallel=4 --target=build --all --prod

# create a Docker in Docker image where to run the unit tests
# and package the jar
FROM build AS test
WORKDIR /build
ENTRYPOINT ["sh", "true"]

# package the application jar in to a JRE image for publication
# this is the final resulting image from the build
# Security guidance is that deployed runtime images should be
# pinned to a specific digest
#
# openjdk:11-jre-slim-buster
FROM scratch AS package
WORKDIR /app
COPY --from=build /build/prod/* /app/
