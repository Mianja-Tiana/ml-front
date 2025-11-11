FROM node:22-alpine AS builder

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci

# Copy all source files
COPY . .

# Build the Next.js app
RUN npm run build

# Production image, use a lightweight Node.js runtime
FROM node:22-alpine AS runner

WORKDIR /app

# Copy only the necessary files from builder
COPY --from=builder /app/package*.json ./
#COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/.next ./.next
COPY --from=builder app/public ./public
COPY --from=builder app/next.config.mjs ./

# Install only production dependencies
RUN npm install --omit=dev

# Expose the port Next.js runs on (default 3000)
EXPOSE 3000

# Start the Next.js production server
CMD ["npm", "start"]
