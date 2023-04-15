FROM node:lts-alpine
ENV NODE_ENV production
WORKDIR /app
COPY package.json ./
COPY ./build/ ./
RUN npm install --production
EXPOSE 3214
CMD ["npm", "run", "remote:prod"]
