import Link from 'next/link';

export default function HomePage() {
  return (
    <section className="card heroCard">
      <h1>Welcome to Orders Playground</h1>
      <p>
        Explore a full-stack demo with an admin dashboard for product management and a customer app
        for cart + checkout.
      </p>
      <div className="heroActions">
        <Link href="/admin" className="button primary">
          Go to Admin
        </Link>
        <Link href="/customer" className="button secondary">
          Go to Customer
        </Link>
      </div>
    </section>
  );
}
