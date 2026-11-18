import type { RowDataPacket } from "mysql2";
import { db } from "@/lib/db";

export type Role = "user" | "admin";

type UserRow = RowDataPacket & { id: number; role: Role };

/** Creates the user on first Google sign-in, updates them on later ones. */
export async function upsertGoogleUser(p: {
  googleId: string;
  email: string;
  name?: string | null;
  image?: string | null;
}): Promise<{ id: number; role: Role }> {
  await db.execute(
    `INSERT INTO users (google_id, email, name, image_url, last_login_at)
     VALUES (?, ?, ?, ?, NOW())
     ON DUPLICATE KEY UPDATE
       email = VALUES(email),
       name = VALUES(name),
       image_url = VALUES(image_url),
       last_login_at = NOW()`,
    [p.googleId, p.email, p.name ?? null, p.image ?? null],
  );

  const [rows] = await db.execute<UserRow[]>(
    "SELECT id, role FROM users WHERE google_id = ? LIMIT 1",
    [p.googleId],
  );
  const user = rows[0];

  // Every user starts on the free plan.
  await db.execute("INSERT IGNORE INTO subscriptions (user_id) VALUES (?)", [
    user.id,
  ]);

  return { id: user.id, role: user.role };
}
