import { NextResponse } from 'next/server';

import { createOrder } from '@/lib/store';

export async function POST(request: Request) {
  const body = await request.json();
  const customerName = String(body?.customerName ?? '');
  const items = Array.isArray(body?.items) ? body.items : [];

  const parsedItems = items.map((item: { productId: unknown; quantity: unknown }) => ({
    productId: String(item?.productId ?? ''),
    quantity: Number(item?.quantity ?? 0)
  }));

  const result = createOrder({ customerName, items: parsedItems });

  if ('error' in result) {
    return NextResponse.json({ message: result.error }, { status: 400 });
  }

  return NextResponse.json({ order: result.order }, { status: 201 });
}
