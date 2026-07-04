import "dotenv/config";

import { randomUUID } from "node:crypto";
import { PrismaPg } from "@prisma/adapter-pg";

import { hashPassword } from "@/lib/password";
import { PrismaClient, UserRole } from "./generated/prisma/client";

const prisma = new PrismaClient({
  adapter: new PrismaPg({
    connectionString: process.env.DATABASE_URL,
  }),
});

async function seedUser(params: {
  firstName: string;
  lastName: string;
  phone: string;
  username: string;
  password: string;
  role: UserRole;
}) {
  await prisma.$executeRaw`
    INSERT INTO "users" (
      "id",
      "firstName",
      "lastName",
      "phone",
      "username",
      "password",
      "role",
      "isActive",
      "createdAt",
      "updatedAt"
    )
    VALUES (
      ${randomUUID()},
      ${params.firstName},
      ${params.lastName},
      ${params.phone},
      ${params.username},
      ${params.password},
      ${params.role},
      true,
      NOW(),
      NOW()
    )
    ON CONFLICT ("username")
    DO UPDATE SET
      "firstName" = EXCLUDED."firstName",
      "lastName" = EXCLUDED."lastName",
      "phone" = EXCLUDED."phone",
      "password" = EXCLUDED."password",
      "role" = EXCLUDED."role",
      "isActive" = TRUE,
      "updatedAt" = NOW();
  `;
}

async function main() {
  const adminPassword = await hashPassword("Admin1234!");
  const staffPassword = await hashPassword("Staff1234!");

  await seedUser({
    firstName: "System",
    lastName: "Admin",
    phone: "0000000000",
    username: "admin",
    password: adminPassword,
    role: UserRole.ADMIN,
  });

  await seedUser({
    firstName: "Floor",
    lastName: "Staff",
    phone: "0000000001",
    username: "staff",
    password: staffPassword,
    role: UserRole.STAFF,
  });

  console.log("Seeded admin and staff users.");
  console.log("Admin username: admin");
  console.log("Admin password: Admin1234!");
  console.log("Staff username: staff");
  console.log("Staff password: Staff1234!");
}

main()
  .catch((error) => {
    console.error("Seed failed:", error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
