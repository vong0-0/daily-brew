import "dotenv/config";

import { subDays } from "date-fns";
import { PrismaPg } from "@prisma/adapter-pg";
import { fromZonedTime, formatInTimeZone } from "date-fns-tz";

import { hashPassword } from "@/lib/password";
import {
  Prisma,
  PrismaClient,
  ReasonApplicableTo,
  UserRole,
} from "./generated/prisma/client";

const prisma = new PrismaClient({
  adapter: new PrismaPg({
    connectionString: process.env.DATABASE_URL,
  }),
});

const TIME_ZONE = "Asia/Bangkok";
const STOCK_MOVEMENT_SEED_DAYS = 30;

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

type ReasonTypeSeed = {
  name: string;
  applicableTo: ReasonApplicableTo;
  requiresNote: boolean;
};

type SeededUser = {
  id: string;
  firstName: string;
  lastName: string;
  username: string;
};

type SeededProduct = {
  id: string;
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

const reasonTypeSeeds: ReasonTypeSeed[] = [
  {
    name: "Purchase from Supplier",
    applicableTo: ReasonApplicableTo.IN,
    requiresNote: false,
  },
  {
    name: "Transfer In from Branch",
    applicableTo: ReasonApplicableTo.IN,
    requiresNote: false,
  },
  {
    name: "Barista Consumption",
    applicableTo: ReasonApplicableTo.OUT,
    requiresNote: false,
  },
  {
    name: "Waste / Expired",
    applicableTo: ReasonApplicableTo.OUT,
    requiresNote: true,
  },
  {
    name: "Sampling / Staff Use",
    applicableTo: ReasonApplicableTo.OUT,
    requiresNote: true,
  },
  {
    name: "Inventory Count Correction",
    applicableTo: ReasonApplicableTo.BOTH,
    requiresNote: true,
  },
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

function getSeedDayKey(anchorDate: Date, daysAgo: number) {
  return formatInTimeZone(
    subDays(anchorDate, daysAgo),
    TIME_ZONE,
    "yyyy-MM-dd"
  );
}

function getSeedDateTime(anchorDate: Date, daysAgo: number, time: string) {
  return fromZonedTime(`${getSeedDayKey(anchorDate, daysAgo)}T${time}`, TIME_ZONE);
}

function decimalString(value: number) {
  return value.toFixed(2);
}

async function seedUser(
  tx: Prisma.TransactionClient,
  params: {
    firstName: string;
    lastName: string;
    phone: string;
    username: string;
    password: string;
    role: UserRole;
  }
) {
  return tx.user.upsert({
    where: {
      username: params.username,
    },
    create: {
      firstName: params.firstName,
      lastName: params.lastName,
      phone: params.phone,
      username: params.username,
      password: params.password,
      role: params.role,
      isActive: true,
    },
    update: {
      firstName: params.firstName,
      lastName: params.lastName,
      phone: params.phone,
      password: params.password,
      role: params.role,
      isActive: true,
    },
  });
}

async function seedCategory(tx: Prisma.TransactionClient, params: CategorySeed) {
  return tx.category.upsert({
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

async function seedUnit(tx: Prisma.TransactionClient, params: UnitSeed) {
  return tx.unit.upsert({
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

async function seedReasonType(
  tx: Prisma.TransactionClient,
  params: ReasonTypeSeed
) {
  return tx.reasonType.upsert({
    where: {
      name: params.name,
    },
    create: {
      name: params.name,
      applicableTo: params.applicableTo,
      requiresNote: params.requiresNote,
    },
    update: {
      name: params.name,
      applicableTo: params.applicableTo,
      requiresNote: params.requiresNote,
      isActive: true,
    },
  });
}

async function seedProduct(
  tx: Prisma.TransactionClient,
  params: ProductSeed,
  categoryId: string,
  unitId: string
) {
  return tx.product.upsert({
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

function buildStockMovementRows(params: {
  anchorDate: Date;
  products: SeededProduct[];
  reasonTypes: Array<{
    id: string;
    name: string;
    applicableTo: ReasonApplicableTo;
    requiresNote: boolean;
  }>;
  adminUser: SeededUser;
  staffUser: SeededUser;
}) {
  const inboundReasons = params.reasonTypes.filter(
    (reasonType) =>
      reasonType.applicableTo === ReasonApplicableTo.IN ||
      reasonType.applicableTo === ReasonApplicableTo.BOTH
  );
  const outboundReasons = params.reasonTypes.filter(
    (reasonType) =>
      reasonType.applicableTo === ReasonApplicableTo.OUT ||
      reasonType.applicableTo === ReasonApplicableTo.BOTH
  );

  const rows: Prisma.StockMovementCreateManyInput[] = [];

  for (let dayIndex = 0; dayIndex < STOCK_MOVEMENT_SEED_DAYS; dayIndex++) {
    const daysAgo = STOCK_MOVEMENT_SEED_DAYS - 1 - dayIndex;
    const dateKey = getSeedDayKey(params.anchorDate, daysAgo);
    const inProduct = params.products[dayIndex % params.products.length];
    const outProduct =
      params.products[(dayIndex * 3 + 5) % params.products.length] ?? inProduct;

    const inboundReason = inboundReasons[dayIndex % inboundReasons.length];
    const outboundReason = outboundReasons[dayIndex % outboundReasons.length];

    rows.push({
      type: "IN",
      quantity: decimalString(2 + (dayIndex % 4)),
      productId: inProduct.id,
      productNameSnapshot: inProduct.name,
      categoryNameSnapshot: inProduct.categoryName,
      unitSnapshot: inProduct.unitName,
      costSnapshot: inProduct.cost,
      reasonTypeId: inboundReason.id,
      reasonNameSnapshot: inboundReason.name,
      userId: params.adminUser.id,
      userNameSnapshot: `${params.adminUser.firstName} ${params.adminUser.lastName}`,
      note: null,
      createdAt: getSeedDateTime(params.anchorDate, daysAgo, "08:30:00"),
    });

    rows.push({
      type: "OUT",
      quantity: decimalString(1 + (dayIndex % 3)),
      productId: outProduct.id,
      productNameSnapshot: outProduct.name,
      categoryNameSnapshot: outProduct.categoryName,
      unitSnapshot: outProduct.unitName,
      costSnapshot: outProduct.cost,
      reasonTypeId: outboundReason.id,
      reasonNameSnapshot: outboundReason.name,
      userId: params.staffUser.id,
      userNameSnapshot: `${params.staffUser.firstName} ${params.staffUser.lastName}`,
      note: outboundReason.requiresNote
        ? `Seeded ${outboundReason.name.toLowerCase()} entry for ${dateKey}`
        : null,
      createdAt: getSeedDateTime(params.anchorDate, daysAgo, "17:15:00"),
    });
  }

  return rows;
}

async function main() {
  const adminPassword = await hashPassword("Admin1234!");
  const staffPassword = await hashPassword("Staff1234!");
  const seedAnchorDate = new Date();

  await prisma.$transaction(async (tx) => {
    const seededCategories = await Promise.all(
      categorySeeds.map((category) => seedCategory(tx, category))
    );
    const seededUnits = await Promise.all(
      unitSeeds.map((unit) => seedUnit(tx, unit))
    );
    const seededReasonTypes = await Promise.all(
      reasonTypeSeeds.map((reasonType) => seedReasonType(tx, reasonType))
    );

    const adminUser = await seedUser(tx, {
      firstName: "System",
      lastName: "Admin",
      phone: "0000000000",
      username: "admin",
      password: adminPassword,
      role: UserRole.ADMIN,
    });

    const staffUser = await seedUser(tx, {
      firstName: "Floor",
      lastName: "Staff",
      phone: "0000000001",
      username: "staff",
      password: staffPassword,
      role: UserRole.STAFF,
    });

    const categoryByName = new Map(
      seededCategories.map((category) => [category.name, category] as const)
    );
    const unitByName = new Map(
      seededUnits.map((unit) => [unit.name, unit] as const)
    );

    const seededProducts: SeededProduct[] = [];

    for (const product of productSeeds) {
      const category = categoryByName.get(product.categoryName);
      const unit = unitByName.get(product.unitName);

      if (!category) {
        throw new Error(`Missing category seed: ${product.categoryName}`);
      }

      if (!unit) {
        throw new Error(`Missing unit seed: ${product.unitName}`);
      }

      const seededProduct = await seedProduct(tx, product, category.id, unit.id);
      seededProducts.push({
        id: seededProduct.id,
        sku: seededProduct.sku ?? product.sku,
        name: seededProduct.name,
        categoryName: product.categoryName,
        unitName: product.unitName,
        cost: seededProduct.cost.toString(),
        reorderPoint: seededProduct.reorderPoint.toString(),
        currentStock: seededProduct.currentStock.toString(),
      });
    }

    await tx.stockMovement.deleteMany();

    const stockMovementRows = buildStockMovementRows({
      anchorDate: seedAnchorDate,
      products: seededProducts,
      reasonTypes: seededReasonTypes,
      adminUser: {
        id: adminUser.id,
        firstName: adminUser.firstName,
        lastName: adminUser.lastName,
        username: adminUser.username,
      },
      staffUser: {
        id: staffUser.id,
        firstName: staffUser.firstName,
        lastName: staffUser.lastName,
        username: staffUser.username,
      },
    });

    await tx.stockMovement.createMany({
      data: stockMovementRows,
    });

    console.log(`Seeded ${seededCategories.length} categories.`);
    console.log(`Seeded ${seededUnits.length} units.`);
    console.log(`Seeded ${seededReasonTypes.length} reason types.`);
    console.log(`Seeded ${seededProducts.length} coffee shop products.`);
    console.log(`Seeded ${stockMovementRows.length} stock movements.`);
    console.log("Seeded admin and staff users.");
    console.log("Admin username: admin");
    console.log("Admin password: Admin1234!");
    console.log("Staff username: staff");
    console.log("Staff password: Staff1234!");
  });
}

main()
  .catch((error) => {
    console.error("Seed failed:", error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
