import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { currentUserId } from "@/lib/session";
import { SIGNUP_COOKIE, saveSignup, type Signup } from "@/lib/signup";

// Google sends new members here after sign-in. We save the details they
// typed on the register page, then take them to the app. It never blocks login.
export async function GET() {
  const jar = await cookies();
  const raw = jar.get(SIGNUP_COOKIE)?.value;
  if (raw) {
    try {
      const userId = await currentUserId();
      if (userId) await saveSignup(userId, JSON.parse(raw) as Signup);
    } catch {
      /* ignore: the member can fill the profile later */
    }
    jar.delete(SIGNUP_COOKIE);
  }
  redirect("/app");
}
