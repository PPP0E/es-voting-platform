FROM node:20.12.0 as builder

ARG DATABASE_URL
ENV DATABASE_URL $DATABASE_URL
ARG AUTH_SECRET
ENV AUTH_SECRET $AUTH_SECRET

# COPY --from=builder /app/next.config.js ./
COPY package.json /tmp/package.json
RUN cd /tmp && npm install --ignore-engines
RUN mkdir -p /usr/src/app && cp -a /tmp/node_modules /usr/src/app/

WORKDIR /usr/src/app
ENV PATH /usr/src/app/node_modules/.bin:$PATH
COPY . /usr/src/app
RUN npx prisma generate
RUN npm run build
ENV NODE_ENV production
ENV PORT 3000
EXPOSE 3000
CMD ["npm", "start"]