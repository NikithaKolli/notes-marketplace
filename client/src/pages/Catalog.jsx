import { useState, useEffect } from 'react';
import axios from 'axios';

function Catalog({ onSelectNote }) {
  const [notes, setNotes] = useState([]);
  const [search, setSearch] = useState('');
  const [subjectFilter, setSubjectFilter] = useState('All');
  const [semesterFilter, setSemesterFilter] = useState('All');

  useEffect(() => {
    // API ఎండ్‌పాయింట్ /api/notes ఉండే అవకాశం ఎక్కువ
    axios.get('https://notes-marketplace-api.onrender.com/api/notes')
      .then((res) => {
        // res.data అర్రే అయితేనే సెట్ చేస్తుంది, లేకపోతే res.data.notes లేదా ఖాళీ అర్రే ఇస్తుంది
        if (Array.isArray(res.data)) {
          setNotes(res.data);
        } else if (res.data && Array.isArray(res.data.notes)) {
          setNotes(res.data.notes);
        } else {
          setNotes([]);
        }
      })
      .catch((err) => {
        console.error('Failed to fetch notes:', err);
        setNotes([]);
      });
  }, []);

  const safeNotes = Array.isArray(notes) ? notes : [];

  const subjects = ['All', ...new Set(safeNotes.map((n) => n.subject).filter(Boolean))];
  const semesters = ['All', ...new Set(safeNotes.map((n) => n.semester).filter(Boolean))];

  const filteredNotes = safeNotes.filter((note) => {
    const matchesSearch = (note.title || '').toLowerCase().includes(search.toLowerCase());
    const matchesSubject = subjectFilter === 'All' || note.subject === subjectFilter;
    const matchesSemester = semesterFilter === 'All' || note.semester === semesterFilter;
    return matchesSearch && matchesSubject && matchesSemester;
  });

  return (
    <div className="page">
      <span className="eyebrow">Browse</span>
      <h2>College Notes Marketplace</h2>

      <input
        type="text"
        placeholder="Search notes by title..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      <div className="filter-row">
        <select value={subjectFilter} onChange={(e) => setSubjectFilter(e.target.value)}>
          {subjects.map((s) => <option key={s} value={s}>{s}</option>)}
        </select>
        <select value={semesterFilter} onChange={(e) => setSemesterFilter(e.target.value)}>
          {semesters.map((s) => <option key={s} value={s}>{s}</option>)}
        </select>
      </div>

      {filteredNotes.length === 0 && <p>No notes found.</p>}

      <div className="notes-grid">
        {filteredNotes.map((note) => (
          <div key={note.id} className="note-card">
            <h3>{note.title}</h3>
            <p className="meta">Subject: {note.subject} | Semester: {note.semester}</p>
            <p className={`price ${note.price == 0 ? 'free' : ''}`}>
              {note.price == 0 ? 'FREE' : `₹${note.price}`}
            </p>
            <button className="btn-secondary" onClick={() => onSelectNote(note.id)}>View Details</button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Catalog;