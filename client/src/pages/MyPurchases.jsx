import { useState, useEffect } from 'react';
import axios from 'axios';

function MyPurchases({ user }) {
  const [purchases, setPurchases] = useState([]);
  const [loading, setLoading] = useState(true);

  const API_BASE = 'https://notes-marketplace-api.onrender.com';

  useEffect(() => {
    const currentUser = user || JSON.parse(localStorage.getItem('user') || '{}');
    if (!currentUser?.id) {
      setLoading(false);
      return;
    }

    axios.get(`${API_BASE}/api/orders/my/${currentUser.id}`)
      .then((res) => {
        setPurchases(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, [user]);

  if (loading) return <p style={{ textAlign: 'center', marginTop: '40px' }}>Loading purchases...</p>;

  return (
    <div className="container" style={{ maxWidth: '800px', margin: '30px auto', padding: '0 20px' }}>
      <h2>My Purchases</h2>
      {purchases.length === 0 ? (
        <p>You have not purchased any notes yet.</p>
      ) : (
        <div style={{ display: 'grid', gap: '15px', marginTop: '20px' }}>
          {purchases.map((item) => (
            <div key={item.order_id} style={{ border: '1px solid #ddd', padding: '15px', borderRadius: '8px', background: '#fff' }}>
              <h3 style={{ margin: '0 0 5px 0' }}>{item.title}</h3>
              <p style={{ margin: '0 0 10px 0', color: '#666' }}>{item.subject} · ₹{item.price}</p>
              <p><strong>License Key:</strong> <code>{item.license_key}</code></p>
              <a 
                href={item.file_url || `${API_BASE}/uploads/${item.filename}`} 
                target="_blank" 
                rel="noreferrer"
                className="btn-primary" 
                style={{ display: 'inline-block', padding: '8px 16px', textDecoration: 'none', borderRadius: '4px' }}
              >
                📄 Open / Download PDF
              </a>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default MyPurchases;