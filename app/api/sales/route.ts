import { NextResponse } from 'next/server';
import { prisma } from '../../../lib/prisma';

export async function GET() {
  try {
    // Try fetching from the database
    const sales = await prisma.sale.findMany({
      orderBy: { orderDate: 'desc' },
    });

    if (sales && sales.length > 0) {
      return NextResponse.json(sales);
    }

    throw new Error('No database records found');
  } catch (error) {
    // Fallback mock data for web deployment if SQLite isn't available
    const fallbackData = [
      { id: 1, orderId: "ORD-1001", customerId: "CUST-101", orderDate: "2024-01-15T00:00:00.000Z", category: "Electronics", region: "North", paymentMethod: "UPI", quantity: 2, unitPrice: 8500, totalSales: 17000, discount: 0.1 },
      { id: 2, orderId: "ORD-1002", customerId: "CUST-102", orderDate: "2024-02-20T00:00:00.000Z", category: "Clothing", region: "South", paymentMethod: "Card", quantity: 3, unitPrice: 1500, totalSales: 4500, discount: 0.05 },
      { id: 3, orderId: "ORD-1003", customerId: "CUST-103", orderDate: "2024-03-10T00:00:00.000Z", category: "Home & Kitchen", region: "East", paymentMethod: "COD", quantity: 1, unitPrice: 3200, totalSales: 3200, discount: 0.0 },
      { id: 4, orderId: "ORD-1004", customerId: "CUST-104", orderDate: "2024-04-05T00:00:00.000Z", category: "Books", region: "West", paymentMethod: "UPI", quantity: 4, unitPrice: 450, totalSales: 1800, discount: 0.15 },
      { id: 5, orderId: "ORD-1005", customerId: "CUST-105", orderDate: "2024-05-12T00:00:00.000Z", category: "Electronics", region: "North", paymentMethod: "Card", quantity: 1, unitPrice: 9500, totalSales: 9500, discount: 0.2 }
    ];
    return NextResponse.json(fallbackData);
  }
}