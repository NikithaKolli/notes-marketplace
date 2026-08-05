import { useState } from 'react';
import axios from 'axios';

function Upload({ sellerId }) {
  const [title, setTitle] = useState('');
  const [subject, setSubject] = useState('');
  const [semester, setSemester] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [file, setFile] = useState(null);
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('title', title);
    formData.append('subject', subject);
    formData.append('semester', semester);
    formData.append('description', description);
    formData.append('price', price);
    formData.append('seller_id', sellerId);
    formData.append('file', file);

    try {
      const res = await axios.post('http://localhost:5000/api/notes/upload', formData);
      setMessage('✅ Upload successful! Note ID: ' + res.data.noteId);
    } catch (err) {
      setMessage('❌ Error: ' + err.message);
    }
  };

  return (
    <div className="page-narrow">
      <span className="eyebrow">Seller</span>
      <h2>Upload Notes</h2>
      <form onSubmit={handleSubmit}>
        <input type="text" placeholder="Title" value={title} onChange={(e) => setTitle(e.target.value)} />
        <input type="text" placeholder="Subject" value={subject} onChange={(e) => setSubject(e.target.value)} />
        <input type="text" placeholder="Semester (e.g. 3-1)" value={semester} onChange={(e) => setSemester(e.target.value)} />
        <textarea placeholder="Description" value={description} onChange={(e) => setDescription(e.target.value)} />
        <input type="number" placeholder="Price (0 for FREE)" value={price} onChange={(e) => setPrice(e.target.value)} />
        <input type="file" onChange={(e) => setFile(e.target.files[0])} />
        <button className="btn-primary" type="submit">Submit</button>
      </form>
      {message && <p className="status-msg">{message}</p>}
    </div>
  );
}

export default Upload;