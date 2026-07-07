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

type CategorySeed = {
  name: string;
};

type UnitSeed = {
  name: string;
  symbol?: string;
};

type ProductSeed = {
  sku: string;
  name: string;
  categoryName: string;
  unitName: string;
  cost: string;
  reorderPoint: string;
  currentStock: string;
};

const categorySeeds: CategorySeed[] = [
  { name: "Coffee Beans" },
  { name: "Dairy" },
  { name: "Plant-Based Milk" },
  { name: "Syrups" },
  { name: "Sweeteners" },
  { name: "Tea & Matcha" },
  { name: "Dry Goods" },
  { name: "Bakery" },
  { name: "Packaging" },
];

const unitSeeds: UnitSeed[] = [
  { name: "kilogram", symbol: "kg" },
  { name: "gram", symbol: "g" },
  { name: "piece", symbol: "pc" },
  { name: "box" },
  { name: "bottle" },
  { name: "pack" },
  { name: "bag" },
  { name: "carton" },
];

const productSeeds: ProductSeed[] = [
  {
    sku: "CB-ESP-001",
    name: "House Espresso Blend Beans",
    categoryName: "Coffee Beans",
    unitName: "kilogram",
    cost: "18.50",
    reorderPoint: "5.00",
    currentStock: "24.00",
  },
  {
    sku: "CB-COL-002",
    name: "Single-Origin Colombia Beans",
    categoryName: "Coffee Beans",
    unitName: "kilogram",
    cost: "22.00",
    reorderPoint: "5.00",
    currentStock: "18.00",
  },
  {
    sku: "CB-DEC-003",
    name: "Decaf Espresso Beans",
    categoryName: "Coffee Beans",
    unitName: "kilogram",
    cost: "20.75",
    reorderPoint: "4.00",
    currentStock: "12.00",
  },
  {
    sku: "DAI-001",
    name: "Whole Milk",
    categoryName: "Dairy",
    unitName: "carton",
    cost: "3.45",
    reorderPoint: "15.00",
    currentStock: "60.00",
  },
  {
    sku: "PLM-001",
    name: "Oat Milk",
    categoryName: "Plant-Based Milk",
    unitName: "carton",
    cost: "4.80",
    reorderPoint: "12.00",
    currentStock: "40.00",
  },
  {
    sku: "PLM-002",
    name: "Almond Milk",
    categoryName: "Plant-Based Milk",
    unitName: "carton",
    cost: "4.60",
    reorderPoint: "10.00",
    currentStock: "32.00",
  },
  {
    sku: "DAI-002",
    name: "Heavy Cream",
    categoryName: "Dairy",
    unitName: "carton",
    cost: "5.20",
    reorderPoint: "8.00",
    currentStock: "18.00",
  },
  {
    sku: "SYR-001",
    name: "Vanilla Syrup",
    categoryName: "Syrups",
    unitName: "bottle",
    cost: "8.50",
    reorderPoint: "6.00",
    currentStock: "24.00",
  },
  {
    sku: "SYR-002",
    name: "Caramel Syrup",
    categoryName: "Syrups",
    unitName: "bottle",
    cost: "8.75",
    reorderPoint: "6.00",
    currentStock: "22.00",
  },
  {
    sku: "SYR-003",
    name: "Chocolate Syrup",
    categoryName: "Syrups",
    unitName: "bottle",
    cost: "8.90",
    reorderPoint: "6.00",
    currentStock: "20.00",
  },
  {
    sku: "TEA-001",
    name: "Matcha Powder",
    categoryName: "Tea & Matcha",
    unitName: "gram",
    cost: "0.05",
    reorderPoint: "500.00",
    currentStock: "2200.00",
  },
  {
    sku: "TEA-002",
    name: "Black Tea Bags",
    categoryName: "Tea & Matcha",
    unitName: "box",
    cost: "4.25",
    reorderPoint: "8.00",
    currentStock: "30.00",
  },
  {
    sku: "TEA-003",
    name: "Green Tea Bags",
    categoryName: "Tea & Matcha",
    unitName: "box",
    cost: "4.35",
    reorderPoint: "8.00",
    currentStock: "24.00",
  },
  {
    sku: "DRY-001",
    name: "Granulated Sugar",
    categoryName: "Sweeteners",
    unitName: "kilogram",
    cost: "2.10",
    reorderPoint: "10.00",
    currentStock: "28.00",
  },
  {
    sku: "DRY-002",
    name: "Brown Sugar",
    categoryName: "Sweeteners",
    unitName: "kilogram",
    cost: "2.35",
    reorderPoint: "10.00",
    currentStock: "20.00",
  },
  {
    sku: "DRY-003",
    name: "Cocoa Powder",
    categoryName: "Dry Goods",
    unitName: "kilogram",
    cost: "6.90",
    reorderPoint: "6.00",
    currentStock: "16.00",
  },
  {
    sku: "DRY-004",
    name: "Cinnamon Powder",
    categoryName: "Dry Goods",
    unitName: "gram",
    cost: "0.04",
    reorderPoint: "400.00",
    currentStock: "1500.00",
  },
  {
    sku: "BAK-001",
    name: "Croissant",
    categoryName: "Bakery",
    unitName: "piece",
    cost: "1.15",
    reorderPoint: "40.00",
    currentStock: "120.00",
  },
  {
    sku: "BAK-002",
    name: "Blueberry Muffin",
    categoryName: "Bakery",
    unitName: "piece",
    cost: "1.35",
    reorderPoint: "40.00",
    currentStock: "90.00",
  },
  {
    sku: "PAC-001",
    name: "12 oz Paper Cup",
    categoryName: "Packaging",
    unitName: "pack",
    cost: "3.25",
    reorderPoint: "20.00",
    currentStock: "100.00",
  },
];

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

async function seedCategory(params: CategorySeed) {
  return await prisma.category.upsert({
    where: {
      name: params.name,
    },
    create: {
      name: params.name,
    },
    update: {
      name: params.name,
      isActive: true,
    },
  });
}

async function seedUnit(params: UnitSeed) {
  return await prisma.unit.upsert({
    where: {
      name: params.name,
    },
    create: {
      name: params.name,
      symbol: params.symbol,
    },
    update: {
      name: params.name,
      symbol: params.symbol,
      isActive: true,
    },
  });
}

async function seedProduct(params: ProductSeed, categoryId: string, unitId: string) {
  return await prisma.product.upsert({
    where: {
      sku: params.sku,
    },
    create: {
      sku: params.sku,
      name: params.name,
      categoryId,
      unitId,
      cost: params.cost,
      reorderPoint: params.reorderPoint,
      currentStock: params.currentStock,
    },
    update: {
      name: params.name,
      categoryId,
      unitId,
      cost: params.cost,
      reorderPoint: params.reorderPoint,
      currentStock: params.currentStock,
      isActive: true,
    },
  });
}

async function main() {
  const adminPassword = await hashPassword("Admin1234!");
  const staffPassword = await hashPassword("Staff1234!");

  const seededCategories = await Promise.all(
    categorySeeds.map((category) => seedCategory(category))
  );
  const seededUnits = await Promise.all(unitSeeds.map((unit) => seedUnit(unit)));

  const categoryByName = new Map(
    seededCategories.map((category) => [category.name, category] as const)
  );
  const unitByName = new Map(seededUnits.map((unit) => [unit.name, unit] as const));

  for (const product of productSeeds) {
    const category = categoryByName.get(product.categoryName);
    const unit = unitByName.get(product.unitName);

    if (!category) {
      throw new Error(`Missing category seed: ${product.categoryName}`);
    }

    if (!unit) {
      throw new Error(`Missing unit seed: ${product.unitName}`);
    }

    await seedProduct(product, category.id, unit.id);
  }

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

  console.log(`Seeded ${seededCategories.length} categories.`);
  console.log(`Seeded ${seededUnits.length} units.`);
  console.log(`Seeded ${productSeeds.length} coffee shop products.`);
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
