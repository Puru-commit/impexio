import mysql from "mysql2/promise";

// One shared connection pool. The global keeps it alive across dev reloads.
const g = globalThis as unknown as { __impexioPool?: mysql.Pool };

export const db =
  g.__impexioPool ??
  mysql.createPool({
    host: process.env.DB_HOST ?? "127.0.0.1",
    port: Number(process.env.DB_PORT ?? 3306),
    user: process.env.DB_USER ?? "root",
    password: process.env.DB_PASSWORD ?? "",
    database: process.env.DB_NAME ?? "impexio",
    waitForConnections: true,
    connectionLimit: 5,
    charset: "utf8mb4",
  });

if (process.env.NODE_ENV !== "production") g.__impexioPool = db;
