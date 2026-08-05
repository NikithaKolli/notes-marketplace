import { useState, useEffect } from 'react';
import axios from 'axios';

function MyPurchases({ user }) {
  const [purchases, setPurchases] = useState([]);

  useEffect(() => {
    if (!user) return;
    axios.get(`http://localhost:5000/api/orders/my/${user.id}`)
      .then((res) => setPurchases(res.data))
      .catch((err) => console.error(err));
  }, [user]);

  return (
    <div className="page">
      <span className="eyebrow">Your library</span>
      <h2>My Purchases</h2>
      {purchases.length === 0 && <p>You haven't purchased any notes yet.</p>}
      {purchases.map((p) => (
        <div key={p.order_id} className="list-card">
          <h4>{p.title}</h4>
          <p className="meta">Subject: {p.subject}</p>
          <p>License Key: <code>{p.license_key}</code></p>
          <a href={`http://localhost:5000/uploads/${p.filename}`} target="_blank" rel="noreferrer">
            <button className="btn-secondary">Download PDF</button>
          </a>
        </div>
      ))}
    </div>
  );
}

export default MyPurchases;