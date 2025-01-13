FROM oven/bun as builder
WORKDIR /app
COPY bun.lockb . 
COPY package.json .
# Install dependencies
RUN bun install --frozen-lockfile
COPY src ./src 
RUN bun build ./src/index.ts --compile --outfile bot

# Runtime
FROM ubuntu:22.04
WORKDIR /app
COPY --from=builder /app/bot /app/bot
CMD ["/app/bot"]