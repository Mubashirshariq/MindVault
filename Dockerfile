From node:22-alpine


WORKDIR /app/backend
COPY backend/ .
RUN npm install


WORKDIR /app/frontend
COPY  /Frontend .
RUN npm install

EXPOSE 4000 5173

CMD ["sh", "-c", "cd /app/backend && npm run dev & cd /app/frontend && npm run dev"]
