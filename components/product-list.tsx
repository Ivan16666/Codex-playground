import { products } from '@/lib/products';

export function ProductList() {
  return (
    <ul>
      {products.map((product) => (
        <li key={product.id}>
          <strong>{product.name}</strong> — ${product.price.toFixed(2)}
        </li>
      ))}
    </ul>
  );
}
