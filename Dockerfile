FROM node:16.6.0

# Create a working directory
RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

# Install app dependencies
COPY package.json package-lock.json ./
RUN npm install

# Copy app source code
COPY . .

# Expose port and start application
EXPOSE 3000
CMD ["npm", "start"]