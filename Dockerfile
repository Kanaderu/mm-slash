FROM node:alpine AS builder
WORKDIR build/

COPY ./package.json .
RUN npm install

COPY . .
RUN npm run build

FROM node:alpine
WORKDIR app/
COPY --from=builder /build/package.json .
COPY --from=builder /build/dist ./dist
COPY --from=builder /build/node_modules ./node_modules

EXPOSE 80
CMD ["npm", "run", "start"]
