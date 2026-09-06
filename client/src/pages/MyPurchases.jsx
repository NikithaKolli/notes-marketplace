import { useState, useEffect } from 'react';
import axios from 'axios';

function MyPurchases({ user }) {
  const [purchases, setPurchases] = useState([]);

  useEffect(() => {
    if (!user) return;
    
    // యూజర్ ఐడీ లేదా టోకెన్‌తో ఆర్డర్స్‌ని పొందడానికి సరైన ఎండ్‌పాయింట్
    const endpoint = user.id 
      ? `https://notes-marketplace-api.onrender.com/api/orders/user/${user.id}` 
      : 'https://notes-marketplace-api.onrender.com/api/orders';

    axios.get(endpoint)
      .then((res) => {
        if (Array.isArray(res.data)) {
          setPurchases(res.data);
        } else if (res.data && Array.isArray(res.data.orders)) {
          setPurchases(res.data.orders);
        } else if (res.data && Array.isArray(res.data.purchases)) {
          setPurchases(res.data.purchases);
        } else {
          setPurchases([]);
        }
      })
      .catch((err) => {
        console.error('Failed to fetch purchases:', err);
        setPurchases([]);
      });
  }, [user]);

  const safePurchases = Array.isArray(purchases) ? purchases : [];

  return (
    <div className="page">
      <span className="eyebrow">Your library</span>
      <h2>My Purchases</h2>

      {safePurchases.length === 0 && <p>You haven't purchased any notes yet.</p>}

      {safePurchases.map((p) => (
        <div key={p.order_id || p.id} className="list-card">
          <h4>{p.title}</h4>
          <p className="meta">Subject: {p.subject}</p>
          <p>License Key: <code>{p.license_key}</code></p>
          <a 
            href={p.file_url || `https://notes-marketplace-api.onrender.com/uploads/${p.filename}`} 
            target="_blank" 
            rel="noreferrer"
          >
            <button className="btn-secondary">Download PDF</button>
          </a>
        </div>
      ))}
    </div>
  );
}

export default MyPurchases;