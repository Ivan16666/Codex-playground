'use client';

import { useEffect, useMemo, useState } from 'react';

type Product = {
  id: string;
  name: string;
  price: number;
  stock: number;
};

type Cart = Record<string, number>;

export default function CustomerPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [cart, setCart] = useState<Cart>({});
  const [customerName, setCustomerName] = useState('');
  const [message, setMessage] = useState('');

  const loadProducts = async () => {
    const response = await fetch('/api/products');
    const data = await response.json();
    setProducts(data.products ?? []);
  };

  useEffect(() => {
    loadProducts();
  }, []);

  const increase = (productId: string, stock: number) => {
    setCart((prev) => {
      const current = prev[productId] ?? 0;
      if (current >= stock) {
        setMessage('Cannot add more than available stock.');
        return prev;
      }

      return { ...prev, [productId]: current + 1 };
    });
  };

  const decrease = (productId: string) => {
    setCart((prev) => {
      const current = prev[productId] ?? 0;
      if (current <= 1) {
        const { [productId]: removed, ...rest } = prev;
        return rest;
      }

      return { ...prev, [productId]: current - 1 };
    });
  };

  const total = useMemo(
    () =>
      products.reduce((sum, product) => {
        const quantity = cart[product.id] ?? 0;
        return sum + product.price * quantity;
      }, 0),
    [cart, products]
  );

  const hasInsufficientStock = useMemo(
    () => products.some((product) => (cart[product.id] ?? 0) > product.stock),
    [cart, products]
  );

  const checkout = async () => {
    const items = Object.entries(cart).map(([productId, quantity]) => ({ productId, quantity }));

    const response = await fetch('/api/checkout', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ customerName, items })
    });

    const data = await response.json();
    if (!response.ok) {
      setMessage(data.message || 'Checkout failed.');
      return;
    }

    setMessage(`Order created for ${data.order.customerName}.`);
    setCart({});
    await loadProducts();
  };

  return (
    <div className="stack">
      <section className="card">
        <h1>Customer App</h1>
        <p className="muted">Browse products, add to cart, and checkout with stock validation.</p>
      </section>

      <section className="card">
        <h2>Products</h2>
        <div className="productGrid">
          {products.map((product) => {
            const quantity = cart[product.id] ?? 0;
            return (
              <article className="productCard" key={product.id}>
                <h3>{product.name}</h3>
                <p>${product.price.toFixed(2)}</p>
                <p className={`stock ${product.stock === 0 ? 'out' : ''}`}>
                  {product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}
                </p>
                <div className="inlineActions">
                  <button className="button secondary" onClick={() => decrease(product.id)} disabled={quantity === 0}>
                    -
                  </button>
                  <span>{quantity}</span>
                  <button
                    className="button secondary"
                    onClick={() => increase(product.id, product.stock)}
                    disabled={product.stock === 0 || quantity >= product.stock}
                  >
                    +
                  </button>
                </div>
              </article>
            );
          })}
        </div>
      </section>

      <section className="card">
        <h2>Checkout</h2>
        {message && <div className="notice">{message}</div>}
        <label className="fieldLabel" htmlFor="customer-name">
          Customer Name
        </label>
        <input
          id="customer-name"
          placeholder="Jane Doe"
          value={customerName}
          onChange={(event) => setCustomerName(event.target.value)}
        />

        <p className="muted">Total: ${total.toFixed(2)}</p>
        <button
          className="button primary"
          onClick={checkout}
          disabled={!customerName.trim() || total === 0 || hasInsufficientStock}
        >
          Place Order
        </button>
        {hasInsufficientStock && <p className="errorText">One or more cart items exceed available stock.</p>}
      </section>
    </div>
  );
}
