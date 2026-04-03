import dotenv from 'dotenv';
dotenv.config();

import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function seed() {
  console.log('🌱 Seeding database...');

  // Clear existing data (MongoDB doesn't have cascade, so order matters)
  await prisma.stockEntry.deleteMany();
  await prisma.product.deleteMany();
  await prisma.category.deleteMany();
  await prisma.vendor.deleteMany();
  await prisma.user.deleteMany();
  console.log('  🧹 Cleared existing data');

  // ── Users ──
  const adminPw   = await bcrypt.hash('admin123', 12);
  const managerPw = await bcrypt.hash('manager123', 12);
  const staffPw   = await bcrypt.hash('staff123', 12);

  const admin = await prisma.user.create({
    data: { name: 'Admin User', email: 'admin@inventory.com', password: adminPw, role: 'admin' },
  });
  const manager = await prisma.user.create({
    data: { name: 'John Smith', email: 'manager@inventory.com', password: managerPw, role: 'manager' },
  });
  const staff = await prisma.user.create({
    data: { name: 'Sarah Lee', email: 'staff@inventory.com', password: staffPw, role: 'staff' },
  });
  console.log('  ✅ Users seeded');

  // ── Categories ──
  const categoryNames = ['Electronics', 'Clothing', 'Food & Beverage', 'Hardware', 'Office Supplies', 'Sports'];
  const categories: Record<string, { id: string }> = {};
  for (const name of categoryNames) {
    categories[name] = await prisma.category.create({ data: { name } });
  }
  console.log('  ✅ Categories seeded');

  // ── Vendors ──
  const vendorNames = ['TechCorp Ltd', 'FashionHub', 'FoodWorld Inc', 'BuildRight Co', 'OfficePro', 'SportZone'];
  const vendors: Record<string, { id: string }> = {};
  for (const name of vendorNames) {
    vendors[name] = await prisma.vendor.create({ data: { name } });
  }
  console.log('  ✅ Vendors seeded');

  // ── Products ──
  const productData = [
    { name: 'Wireless Keyboard',  sku: 'WK-001', category: 'Electronics',    vendor: 'TechCorp Ltd',   price: 59.99,  quantity: 45,  minStock: 10 },
    { name: 'USB-C Hub',          sku: 'UC-002', category: 'Electronics',    vendor: 'TechCorp Ltd',   price: 34.99,  quantity: 8,   minStock: 15 },
    { name: 'Office Chair',       sku: 'OC-003', category: 'Office Supplies',vendor: 'OfficePro',      price: 199.99, quantity: 12,  minStock: 5  },
    { name: 'Running Shoes',      sku: 'RS-004', category: 'Sports',         vendor: 'SportZone',      price: 89.99,  quantity: 3,   minStock: 8  },
    { name: 'Steel Bolts Pack',   sku: 'SB-005', category: 'Hardware',       vendor: 'BuildRight Co',  price: 12.99,  quantity: 200, minStock: 50 },
    { name: 'Coffee Beans 1kg',   sku: 'CB-006', category: 'Food & Beverage',vendor: 'FoodWorld Inc',  price: 24.99,  quantity: 0,   minStock: 20 },
    { name: 'Cotton T-Shirt',     sku: 'CT-007', category: 'Clothing',       vendor: 'FashionHub',     price: 19.99,  quantity: 85,  minStock: 20 },
    { name: 'LED Monitor 24"',    sku: 'LM-008', category: 'Electronics',    vendor: 'TechCorp Ltd',   price: 249.99, quantity: 6,   minStock: 5  },
    { name: 'Yoga Mat',           sku: 'YM-009', category: 'Sports',         vendor: 'SportZone',      price: 39.99,  quantity: 22,  minStock: 10 },
    { name: 'Safety Helmet',      sku: 'SH-010', category: 'Hardware',       vendor: 'BuildRight Co',  price: 29.99,  quantity: 4,   minStock: 10 },
    { name: 'Green Tea Bags',     sku: 'GT-011', category: 'Food & Beverage',vendor: 'FoodWorld Inc',  price: 8.99,   quantity: 150, minStock: 30 },
    { name: 'Denim Jeans',        sku: 'DJ-012', category: 'Clothing',       vendor: 'FashionHub',     price: 54.99,  quantity: 40,  minStock: 15 },
  ];

  for (const p of productData) {
    await prisma.product.create({
      data: {
        name:       p.name,
        sku:        p.sku,
        price:      p.price,
        quantity:   p.quantity,
        minStock:   p.minStock,
        categoryId: categories[p.category].id,
        vendorId:   vendors[p.vendor].id,
      },
    });
  }
  console.log('  ✅ Products seeded');

  console.log('\n🎉 Database seeded successfully!');
  console.log('\n📧 Login credentials:');
  console.log('   Admin:   admin@inventory.com / admin123');
  console.log('   Manager: manager@inventory.com / manager123');
  console.log('   Staff:   staff@inventory.com / staff123');
}

seed()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
