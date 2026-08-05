import { useState, useEffect } from 'react';
import axios from 'axios';

function Dashboard({ user }) {
  const [notes, setNotes] = useState([]);

  useEffect(() => {
    if (!user) return;
    axios.get(`http://localhost:5000/api/notes/seller/${user.id}`)
      .then((res) => setNotes(res.data))
      .catch((err) => console.error(err));
  }, [user]);

  const totalDownloads = notes.reduce((sum, n) => sum + n.downloads_count, 0);
  const totalEarnings = notes.reduce((sum, n) => sum + (n.price * n.downloads_count), 0);

  return (
    <div className="page">
      <span className="eyebrow">Seller Dashboard</span>
      <h2>Welcome, {user?.name} 👋</h2>

      <div className="stats-row">
        <div className="stat-card">
          <p>Total Notes</p>
          <h3>{notes.length}</h3>
        </div>
        <div className="stat-card">
          <p>Total Downloads</p>
          <h3>{totalDownloads}</h3>
        </div>
        <div className="stat-card">
          <p>Total Earnings</p>
          <h3>₹{totalEarnings}</h3>
        </div>
      </div>

      <h3>My Uploaded Notes</h3>
      {notes.length === 0 && <p>You haven't uploaded any notes yet.</p>}
      {notes.map((note) => (
        <div key={note.id} className="list-card">
          <h4>{note.title}</h4>
          <p className="meta">Subject: {note.subject} | Semester: {note.semester}</p>
          <p className="meta">Price: {note.price == 0 ? 'FREE' : `₹${note.price}`} | Downloads: {note.downloads_count}</p>
        </div>
      ))}
    </div>
  );
}

export default Dashboard;