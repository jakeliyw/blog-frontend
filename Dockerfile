FROM node as build_vue

ARG NPM_REGISTRY=https://registry.npm.taobao.org

ADD . /build

WORKDIR /build

RUN yarn install --registry $NPM_REGISTRY && \
    yarn run build

FROM nginx

COPY --from=build_vue /build/dist /static
