const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const categories = ['Electronics', 'Clothing', 'Home & Kitchen', 'Books'];
const regions = ['North', 'South', 'East', 'West'];
const paymentMethods = ['UPI', 'Card', 'COD'];

function getRandomItem(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

async function main() {
  console.log('Seeding SQLite database with e-commerce transaction data...');
  await prisma.sale.deleteMany();

  const records = [];
  const baseDate = new Date('2024-01-01').getTime();
  const endDate = new Date('2024-06-30').getTime();

  for (let i = 1; i <= 180; i++) {
    const orderId = `ORD-${1000 + i}`;
    const customerId = `CUST-${Math.floor(100 + Math.random() * 900)}`;
    const randomTime = baseDate + Math.random() * (endDate - baseDate);
    const orderDate = new Date(randomTime);
    const category = getRandomItem(categories);
    const region = getRandomItem(regions);
    const paymentMethod = getRandomItem(paymentMethods);
    const quantity = Math.floor(Math.random() * 5) + 1;
    
    let basePrice = 500;
    if (category === 'Electronics') basePrice = 8000;
    else if (category === 'Clothing') basePrice = 1500;
    else if (category === 'Home & Kitchen') basePrice = 3000;
    else if (category === 'Books') basePrice = 450;
    
    const unitPrice = Math.round(basePrice * (0.8 + Math.random() * 0.4));
    const totalSales = quantity * unitPrice;
    const discount = Number((Math.random() * 0.25).toFixed(2));

    records.push({
      orderId,
      customerId,
      orderDate,
      category,
      region,
      paymentMethod,
      quantity,
      unitPrice,
      totalSales,
      discount
    });
  }

  await prisma.sale.createMany({
    data: records,
  });

  console.log('Database seeded successfully with 180 transactions!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });