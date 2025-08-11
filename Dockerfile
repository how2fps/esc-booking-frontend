    # Use a Node.js base image
    FROM node:22-alpine

    RUN apk add --no-cache git

    # Set the working directory inside the container
    WORKDIR /usr/src/app
    # Copy package.json and package-lock.json to install dependencies
    COPY . .
    # Install dependencies
    RUN npm i
    EXPOSE 8080
    RUN npm run build
    CMD ["npm", "run", "start"]

