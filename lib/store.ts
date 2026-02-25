export type Product = {
  id: string;
  name: string;
  price: number;
  stock: number;
};

export type OrderItem = {
  productId: string;
  productName: string;
  price: number;
  quantity: number;
};

export type Order = {
  id: string;
  customerName: string;
  items: OrderItem[];
  totalPrice: number;
  createdAt: string;
};

const products: Product[] = [
  { id: 'p-1', name: 'Wireless Mouse', price: 25, stock: 14 },
  { id: 'p-2', name: 'Mechanical Keyboard', price: 85, stock: 8 },
  { id: 'p-3', name: 'USB-C Hub', price: 40, stock: 11 }
];

const orders: Order[] = [];

const generateId = (prefix: string) => `${prefix}-${Math.random().toString(36).slice(2, 10)}`;

export const listProducts = () => products;

export const addProduct = (input: { name: string; price: number; stock: number }) => {
  const newProduct: Product = {
    id: generateId('p'),
    name: input.name,
    price: input.price,
    stock: input.stock
  };

  products.push(newProduct);
  return newProduct;
};

export const updateProduct = (
  id: string,
  updates: Partial<Pick<Product, 'price' | 'stock'>>
) => {
  const product = products.find((item) => item.id === id);
  if (!product) {
    return null;
  }

  if (typeof updates.price === 'number') {
    product.price = updates.price;
  }

  if (typeof updates.stock === 'number') {
    product.stock = updates.stock;
  }

  return product;
};

export const listOrders = () => orders;

export const createOrder = (input: {
  customerName: string;
  items: Array<{ productId: string; quantity: number }>;
}) => {
  const normalizedItems = input.items.filter((item) => item.quantity > 0);
  if (!input.customerName.trim() || normalizedItems.length === 0) {
    return { error: 'Customer name and at least one item are required.' as const };
  }

  const orderItems: OrderItem[] = [];

  for (const cartItem of normalizedItems) {
    const product = products.find((item) => item.id === cartItem.productId);

    if (!product) {
      return { error: `Product ${cartItem.productId} not found.` as const };
    }

    if (product.stock < cartItem.quantity) {
      return { error: `Insufficient stock for ${product.name}.` as const };
    }

    orderItems.push({
      productId: product.id,
      productName: product.name,
      price: product.price,
      quantity: cartItem.quantity
    });
  }

  for (const item of orderItems) {
    const product = products.find((p) => p.id === item.productId);
    if (product) {
      product.stock -= item.quantity;
    }
  }

  const totalPrice = orderItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const order: Order = {
    id: generateId('o'),
    customerName: input.customerName.trim(),
    items: orderItems,
    totalPrice,
    createdAt: new Date().toISOString()
  };

  orders.unshift(order);
  return { order };
};
