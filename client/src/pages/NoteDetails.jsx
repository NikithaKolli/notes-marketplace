import { useState, useEffect } from 'react';
import axios from 'axios';

function NoteDetails({ noteId, onBack }) {
  const [note, setNote] = useState(null);
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState('');

  useEffect(() => {
    axios.get(`http://localhost:5000/api/notes/${noteId}`)
      .then((res) => setNote(res.data))
      .catch((err) => console.error(err));
  }, [noteId]);

  const handleBuy = async () => {
    if (!email) {
      setStatus('❌ Please enter your email first');
      return;
    }
    setStatus('Processing...');
    try {
      const res = await axios.post('https://notes-marketplace-api.onrender.com', {
        note_id: noteId,
        buyer_email: email
      });
      setStatus(`✅ Purchase successful! License Key: ${res.data.licenseKey}. Check your email.`);
    } catch (err) {
      setStatus('❌ Error: ' + err.message);
    }
  };

  if (!note) return <p style={{ textAlign: 'center' }}>Loading...</p>;

  return (
    <div className="page-narrow">
      <button className="btn-secondary" onClick={onBack} style={{ marginBottom: '20px' }}>← Back to Catalog</button>
      <span className="eyebrow">{note.subject} · {note.semester}</span>
      <h2>{note.title}</h2>
      <p>{note.description}</p>
      <p className={`price ${note.price == 0 ? 'free' : ''}`} style={{ fontSize: '22px' }}>
        {note.price == 0 ? 'FREE' : `₹${note.price}`}
      </p>

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