import { auth } from "@/lib/auth";
import { db } from "@/db";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function getCurrentUser() {
  const session = await auth();
  const user = session?.user ?? null;

  // Ensure user is synced to DB (handles case where JWT exists but DB row doesn't)
  if (user?.email && !user.id) {
    const dbUser = await db.query.users.findFirst({
      where: eq(users.email, user.email),
    });

    if (dbUser) {
      user.id = dbUser.id;
    } else {
      const [created] = await db
        .insert(users)
        .values({
          email: user.email,
          name: user.name ?? null,
          image: user.image ?? null,
        })
        .onConflictDoUpdate({
          target: users.email,
          set: { name: user.name ?? null, image: user.image ?? null },
        })
        .returning({ id: users.id });
      user.id = created.id;
    }
  }

  return user;
}

export async function requireCurrentUser() {
  const user = await getCurrentUser();
  if (!user?.id) {
    throw new Error("Authentication required");
  }
  return user;
}
