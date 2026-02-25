import { NextResponse } from 'next/server';

import { addProduct, listProducts } from '@/lib/store';

export async function GET() {
  return NextResponse.json({ products: listProducts() });
}

export async function POST(request: Request) {
  const body = await request.json();
  const name = String(body?.name ?? '').trim();
  const price = Number(body?.price);
  const stock = Number(body?.stock);

  if (!name || Number.isNaN(price) || Number.isNaN(stock) || price < 0 || stock < 0) {
    return NextResponse.json(
      { message: 'Valid name, price, and stock are required.' },
      { status: 400 }
    );
  }

  const product = addProduct({ name, price, stock });
  return NextResponse.json({ product }, { status: 201 });
}
