FROM node:18 AS development
WORKDIR /app
# Copy all json files
COPY *.json ./
# Copy jest config file
COPY jest.config.ts ./
# Install all dependencies
RUN npm install
# Copy the source code
COPY ./src .
# Expose port (if needed)
EXPOSE 3000
CMD ["npm", "run", "dev"]

# Production stage
FROM node:18 AS production
WORKDIR /app
# Copy package.json and package-lock.json
COPY package.json ./
# Install only production dependencies
RUN npm install --only=production
# Copy built code from the development stage
COPY ./dist .
# Expose port (if needed)
EXPOSE 3000
CMD ["node", "server.js"]
