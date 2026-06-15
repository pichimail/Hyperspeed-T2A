import { PrismaClient } from "@prisma/client";
import { PrismaNeon } from "@prisma/adapter-neon";
import { Pool } from "@neondatabase/serverless";
import { cache } from "react";

function shouldUseNeonAdapter(connectionString?: string) {
  if (!connectionString) return false;

  try {
    const { hostname } = new URL(connectionString);
    return hostname.includes("neon.tech");
  } catch {
    return false;
  }
}

export const getPrisma = cache(() => {
  if (shouldUseNeonAdapter(process.env.DATABASE_URL)) {
    const neon = new Pool({ connectionString: process.env.DATABASE_URL });
    const adapter = new PrismaNeon(neon);
    return new PrismaClient({ adapter });
  }

  return new PrismaClient();
});
