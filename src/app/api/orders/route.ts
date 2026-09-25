import { NextResponse } from "next/server";
import Order from "@/lib/models/Order";
import Product from "@/lib/models/Product";
import sequelize from "@/lib/db";
import { runMigrations } from "@/lib/migrations";
import { getAuthenticatedUserId } from "@/lib/auth";

type OrderItem = {
  id: string;
  productSlug?: string;
  name: string;
  specs?: string[];
  price: number;
  quantity?: number;
  qty?: number;
  image: string;
};

function authorizedUserId() {
  return getAuthenticatedUserId();
}

export async function GET() {
  if (!(await authorizedUserId())) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  await runMigrations();
  const orders = await Order.findAll({ order: [["createdAt", "DESC"]], raw: true });
  return NextResponse.json(orders);
}

export async function POST(request: Request) {
  const customerId = await authorizedUserId();

  try {
    await runMigrations();
    const body = await request.json() as {
      customerName?: string;
      phone?: string;
      email?: string;
      address?: string;
      province?: string;
      city?: string;
      postalCode?: string;
      country?: string;
      items?: OrderItem[];
      subtotal?: number;
      shippingCost?: number;
      discount?: number;
      total?: number;
      paymentMethod?: string;
    };

    if (!body.customerName || !body.phone || !body.email || !body.address || !body.province || !body.city || !body.items?.length) {
      return NextResponse.json({ message: "Please complete your contact, shipping, and cart details." }, { status: 400 });
    }
    const customerName = body.customerName;
    const phone = body.phone;
    const email = body.email;
    const address = body.address;
    const postalCode = body.postalCode?.trim() || null;
    const province = body.province;
    const city = body.city;

    const items = body.items.map((item) => ({
      id: item.id,
      productSlug: item.productSlug,
      name: item.name,
      specs: item.specs ?? [],
      price: Number(item.price),
      quantity: Number(item.quantity ?? item.qty ?? 1),
      image: item.image,
    }));
    const subtotal = Number(body.subtotal ?? 0);
    const shippingCost = Number(body.shippingCost ?? 0);
    const discount = Number(body.discount ?? 0);
    const total = Number(body.total ?? subtotal + shippingCost - discount);
    const aggregatedItems = new Map<string, { name: string; quantity: number; price: number; image: string; specs: string[]; id?: string; productSlug?: string; }>();
    for (const item of items) {
      if (!item.productSlug) throw new Error(`Missing product reference for ${item.name}.`);
      if (!Number.isFinite(item.quantity) || item.quantity <= 0) {
        throw new Error(`${item.name} has an invalid quantity.`);
      }
      const existing = aggregatedItems.get(item.productSlug) ?? { name: item.name, quantity: 0, price: item.price, image: item.image, specs: item.specs ?? [], id: item.id, productSlug: item.productSlug };
      existing.quantity += item.quantity;
      aggregatedItems.set(item.productSlug, existing);
    }
    const order = await sequelize.transaction(async (transaction) => {
      for (const aggregated of aggregatedItems.values()) {
        const product = await Product.findOne({ where: { slug: aggregated.productSlug }, transaction, lock: transaction.LOCK.UPDATE });
        if (!product) throw new Error(`${aggregated.name} is no longer available.`);
        const available = Number(product.get("stockQuantity") ?? 0);
        if (!Boolean(product.get("inStock")) || available < aggregated.quantity) {
          throw new Error(`${aggregated.name} has only ${available} item(s) in stock.`);
        }
        const remaining = available - aggregated.quantity;
        await product.update({ stockQuantity: remaining, inStock: remaining > 0 }, { transaction });
      }

      return Order.create({
      orderNumber: `RM-${Date.now().toString().slice(-8)}`,
      customerId: customerId ? Number(customerId) : null,
      customerName: customerName.trim(),
      phone: phone.trim(),
      email: email.trim().toLowerCase(),
      address: address.trim(),
      province,
      city,
      postalCode,
      country: body.country ?? "Pakistan",
      items: JSON.stringify(items),
      subtotal,
      shippingCost,
      discount,
      total,
      paymentMethod: body.paymentMethod ?? "cod",
      status: "Processing",
      }, { transaction });
    });

    return NextResponse.json({ orderNumber: order.get("orderNumber") }, { status: 201 });
  } catch (error) {
    console.error("Order creation failed:", error);
    return NextResponse.json({ message: error instanceof Error ? error.message : "Unable to place order." }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  if (!(await authorizedUserId())) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  try {
    await runMigrations();
    const body = await request.json() as { id?: number; status?: "Processing" | "Shipped" | "Delivered" | "Cancelled" };
    if (!body.id || !body.status) return NextResponse.json({ message: "Order and status are required." }, { status: 400 });
    const order = await Order.findByPk(body.id);
    if (!order) return NextResponse.json({ message: "Order not found." }, { status: 404 });
    await order.update({ status: body.status });
    return NextResponse.json(order);
  } catch (error) {
    console.error("Order status update failed:", error);
    return NextResponse.json({ message: "Unable to update order status." }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  if (!(await authorizedUserId())) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  try {
    await runMigrations();
    const body = await request.json() as { id?: number };
    if (!body.id) return NextResponse.json({ message: "Order is required." }, { status: 400 });
    const order = await Order.findByPk(body.id);
    if (!order) return NextResponse.json({ message: "Order not found." }, { status: 404 });
    await order.destroy();
    return NextResponse.json({ message: "Order deleted." });
  } catch (error) {
    console.error("Order deletion failed:", error);
    return NextResponse.json({ message: "Unable to delete order." }, { status: 500 });
  }
}