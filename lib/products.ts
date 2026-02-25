export type Product = {
  id: number;
  name: string;
  price: number;
};

export const products: Product[] = [
  { id: 1, name: 'Notebook', price: 12.99 },
  { id: 2, name: 'Mechanical Keyboard', price: 89.0 },
  { id: 3, name: 'USB-C Hub', price: 34.5 }
];
