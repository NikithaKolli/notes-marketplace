import { useState, useEffect } from 'react';
import axios from 'axios';

function NoteDetails({ noteId, onBack }) {
  const [note, setNote] = useState(null);
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState('');
  const [loading, setLoading] = useState(true);

  const API_BASE = 'https://notes-marketplace-api.onrender.com';

  useEffect(() => {
    if (!noteId) return;
    setLoading(true);

    axios.get(`${API_BASE}/api/notes/${noteId}`)
      .then((res) => {
        setNote(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, [noteId]);

  const handleBuy = async () => {
    if (!email) {
      setStatus('❌ Please enter your email first');
      return;
    }
    setStatus('Processing...');

    const candidateEndpoints = [
      `${API_BASE}/api/orders`,
      `${API_BASE}/orders`,
      `${API_BASE}/api/purchases`,
      `${API_BASE}/api/notes/buy`,
      `${API_BASE}/api/buy`
    ];

    const payload = {
      note_id: noteId,
      noteId: noteId,
      buyer_email: email,
      email: email
    };

    let success = false;
    let lastError = '';

    for (const url of candidateEndpoints) {
      try {
        const res = await axios.post(url, payload);
        const licenseKey = res.data?.licenseKey || res.data?.license_key || 'SUCCESS-KEY';
        setStatus(`✅ Purchase successful! License Key: ${licenseKey}. Check your email.`);
        success = true;
        break;
      } catch (err) {
        lastError = err.response?.data?.message || err.message;
        if (err.response && err.response.status !== 404) {
          break;
        }
      }
    }

    if (!success) {
      setStatus(`❌ Error: ${lastError}`);
    }
  };

  if (loading) return <p style={{ textAlign: 'center', marginTop: '40px' }}>Loading note details...</p>;

  if (!note) {
    return (
      <div className="page-narrow" style={{ textAlign: 'center', marginTop: '40px' }}>
        <p>Note not found or failed to load.</p>
        <button className="btn-secondary" onClick={onBack}>← Back to Catalog</button>
      </div>
    );
  }

  return (
    <div className="page-narrow">
      <button className="btn-secondary" onClick={onBack} style={{ marginBottom: '20px' }}>← Back to Catalog</button>
      <span className="eyebrow">{note.subject} · {note.semester}</span>
      <h2>{note.title}</h2>
      <p>{note.description}</p>
      <p className={`price ${note.price == 0 ? 'free' : ''}`} style={{ fontSize: '22px' }}>
        {note.price == 0 ? 'FREE' : `₹${note.price}`}
      </p>

      {note.file_url && (
        <div style={{ margin: '15px 0' }}>
          <a href={note.file_url} target="_blank" rel="noreferrer" className="btn-secondary" style={{ display: 'inline-block', textDecoration: 'none' }}>
            📄 View / Download PDF
          </a>
        </div>
      )}

      <input
        type="email"
        placeholder="Your email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <button className="btn-primary" onClick={handleBuy}>Buy Now (Mock)</button>

      {status && <p className="status-msg">{status}</p>}
    </div>
  );
}

export default NoteDetails;