import { useState, useEffect } from 'react';
import axios from 'axios';

function NoteDetails({ noteId, onBack }) {
  const [note, setNote] = useState(null);
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!noteId) return;
    setLoading(true);

    axios.get(`https://notes-marketplace-api.onrender.com/api/notes/${noteId}`)
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
    try {
      const res = await axios.post('https://notes-marketplace-api.onrender.com/api/orders', {
        note_id: noteId,
        buyer_email: email
      });
      setStatus(`✅ Purchase successful! License Key: ${res.data.licenseKey || res.data.license_key || 'GENERATED'}. Check your email.`);
    } catch (err) {
      setStatus('❌ Error: ' + (err.response?.data?.message || err.message));
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

      {/* PDF డౌన్‌లోడ్ లేదా ప్రివ్యూ లింక్ */}
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