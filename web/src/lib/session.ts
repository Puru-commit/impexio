import { auth } from "@/auth";

/** The signed-in user's id, or null. */
export async function currentUserId(): Promise<number | null> {
  const session = await auth();
  const id = Number(session?.user?.id);
  return Number.isInteger(id) && id > 0 ? id : null;
}
