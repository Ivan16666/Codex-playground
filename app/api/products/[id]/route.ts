import { NextResponse } from 'next/server';

import { updateProduct } from '@/lib/store';

type Params = {
  params: {
    id: string;
  };
};

export async function PATCH(request: Request, { params }: Params) {
  const body = await request.json();

  const price = body?.price === undefined ? undefined : Number(body.price);
  const stock = body?.stock === undefined ? undefined : Number(body.stock);

  if (
    (price !== undefined && (Number.isNaN(price) || price < 0)) ||
    (stock !== undefined && (Number.isNaN(stock) || stock < 0))
  ) {
    return NextResponse.json({ message: 'Price and stock must be valid positive values.' }, { status: 400 });
  }

  const product = updateProduct(params.id, { price, stock });
  if (!product) {
    return NextResponse.json({ message: 'Product not found.' }, { status: 404 });
  }

  return NextResponse.json({ product });
}
