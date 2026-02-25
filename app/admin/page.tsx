'use client';

import { FormEvent, useCallback, useEffect, useState } from 'react';

type Product = {
  id: string;
  name: string;
  price: number;
  stock: number;
};

type Order = {
  id: string;
  customerName: string;
  totalPrice: number;
  createdAt: string;
  items: Array<{ productName: string; quantity: number; price: number }>;
};

export default function AdminPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [message, setMessage] = useState('');
  const [formState, setFormState] = useState({ name: '', price: '', stock: '' });

  const loadData = useCallback(async () => {
    const [productsRes, ordersRes] = await Promise.all([fetch('/api/products'), fetch('/api/orders')]);
    const productsData = await productsRes.json();
    const ordersData = await ordersRes.json();
    setProducts(productsData.products ?? []);
    setOrders(ordersData.orders ?? []);
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const submitProduct = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const response = await fetch('/api/products', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: formState.name,
        price: Number(formState.price),
        stock: Number(formState.stock)
      })
    });

    const data = await response.json();
    if (!response.ok) {
      setMessage(data.message || 'Unable to add product.');
      return;
    }

    setFormState({ name: '', price: '', stock: '' });
    setMessage(`Added ${data.product.name}.`);
    await loadData();
  };

  const updateField = async (id: string, patch: { price?: number; stock?: number }) => {
    const response = await fetch(`/api/products/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(patch)
    });

    const data = await response.json();
    if (!response.ok) {
      setMessage(data.message || 'Unable to update product.');
      return;
    }

    setMessage(`Updated ${data.product.name}.`);
    await loadData();
  };

  return (
    <div className="stack">
      <section className="card">
        <h1>Admin Dashboard</h1>
        <p className="muted">Add products, update pricing, adjust inventory, and review incoming orders.</p>
        {message && <div className="notice">{message}</div>}

        <form className="gridForm" onSubmit={submitProduct}>
          <input
            placeholder="Product name"
            value={formState.name}
            onChange={(event) => setFormState((prev) => ({ ...prev, name: event.target.value }))}
            required
          />
          <input
            type="number"
            min={0}
            step="0.01"
            placeholder="Price"
            value={formState.price}
            onChange={(event) => setFormState((prev) => ({ ...prev, price: event.target.value }))}
            required
          />
          <input
            type="number"
            min={0}
            placeholder="Stock"
            value={formState.stock}
            onChange={(event) => setFormState((prev) => ({ ...prev, stock: event.target.value }))}
            required
          />
          <button className="button primary" type="submit">
            Add Product
          </button>
        </form>
      </section>

      <section className="card">
        <h2>Products</h2>
        <div className="tableWrap">
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Price</th>
                <th>Stock</th>
                <th>Update</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => (
                <tr key={product.id}>
                  <td>{product.name}</td>
                  <td>${product.price.toFixed(2)}</td>
                  <td>{product.stock}</td>
                  <td>
                    <div className="inlineActions">
                      <button
                        className="button secondary"
                        onClick={() => updateField(product.id, { price: product.price + 1 })}
                      >
                        +$1
                      </button>
                      <button
                        className="button secondary"
                        onClick={() => updateField(product.id, { stock: product.stock + 1 })}
                      >
                        +1 Stock
                      </button>
                      <button
                        className="button secondary"
                        disabled={product.stock === 0}
                        onClick={() => updateField(product.id, { stock: Math.max(0, product.stock - 1) })}
                      >
                        -1 Stock
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="card">
        <h2>Orders</h2>
        {orders.length === 0 ? (
          <p className="muted">No orders yet.</p>
        ) : (
          <div className="orderList">
            {orders.map((order) => (
              <article className="orderItem" key={order.id}>
                <div className="orderHeader">
                  <strong>{order.customerName}</strong>
                  <span>${order.totalPrice.toFixed(2)}</span>
                </div>
                <p className="muted small">{new Date(order.createdAt).toLocaleString()}</p>
                <ul>
                  {order.items.map((item, index) => (
                    <li key={`${order.id}-${index}`}>
                      {item.productName} × {item.quantity} (${item.price.toFixed(2)})
                    </li>
                  ))}
                </ul>
              </article>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
