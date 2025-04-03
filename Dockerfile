# Use the latest LTS version of Node.js
FROM node:23.10.0

# Set the working directory inside the container
WORKDIR /src/app

# Copy package.json and yarn.lock
COPY package.json yarn.lock ./

# Install dependencies
RUN yarn install

# Copy the rest of your application files
COPY . .

# Expose the port your app runs on
EXPOSE 3000

# Define the command to run your app
CMD ["yarn", "start"]