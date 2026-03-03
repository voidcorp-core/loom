import { NextResponse } from "next/server";
import { eq, and, sql } from "drizzle-orm";
import { db } from "@/db";
import { resources, users } from "@/db/schema";

export async function POST(req: Request) {
  let body: { slug?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  if (!body.slug) {
    return NextResponse.json({ error: "slug is required" }, { status: 400 });
  }

  // Find the public marketplace resource by slug
  const row = await db
    .select({
      id: resources.id,
      type: resources.type,
      slug: resources.slug,
      title: resources.title,
      content: resources.content,
      metadata: resources.metadata,
      files: resources.files,
      authorName: users.name,
    })
    .from(resources)
    .leftJoin(users, eq(resources.ownerId, users.id))
    .where(and(eq(resources.slug, body.slug), eq(resources.isPublic, true)))
    .then((rows) => rows[0]);

  if (!row) {
    return NextResponse.json(
      { error: "Resource not found in marketplace" },
      { status: 404 }
    );
  }

  // Increment install count (fire-and-forget)
  db.update(resources)
    .set({ installCount: sql`${resources.installCount} + 1` })
    .where(eq(resources.id, row.id))
    .then(() => {});

  return NextResponse.json({
    resource: {
      id: row.id,
      type: row.type,
      slug: row.slug,
      title: row.title,
      content: row.content,
      metadata: row.metadata,
      files: row.files,
      authorName: row.authorName,
    },
  });
}
