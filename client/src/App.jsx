import { useState } from 'react';
import './App.css';
import Upload from './pages/Upload';
import Catalog from './pages/Catalog';
import NoteDetails from './pages/NoteDetails';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import MyPurchases from './pages/MyPurchases';

function App() {
  const [page, setPage] = useState('catalog');
  const [selectedNoteId, setSelectedNoteId] = useState(null);
  const [authView, setAuthView] = useState('login');   // 'login' or 'register'
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('user');
    return saved ? JSON.parse(saved) : null;
  });

  const handleSelectNote = (id) => {
    setSelectedNoteId(id);
    setPage('details');
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    setAuthView('login');
    setPage('catalog');
  };

  // =====================================================
  // Login/Register avvakunda, EDI KANIPINCHADU (Auth Gate)
  // =====================================================
  if (!user) {
    return (
      <div className="auth-shell">
        <div className="auth-hero">
          <span className="hero-badge">🎓 For College Students</span>
          <h1>College Notes<br />Marketplace</h1>
          <p>Buy and sell handwritten notes, PDFs, and study material —
             instantly, securely, with a verified license key for every purchase.</p>
          <ul className="hero-points">
            <li>✓ Verified sellers, real notes</li>
            <li>✓ Instant email delivery</li>
            <li>✓ Subject &amp; semester filters</li>
          </ul>
        </div>

        <div className="auth-box">
          <div className="auth-toggle">
            <button
              className={authView === 'login' ? 'active' : ''}
              onClick={() => setAuthView('login')}
            >Login</button>
            <button
              className={authView === 'register' ? 'active' : ''}
              onClick={() => setAuthView('register')}
            >Register</button>
          </div>

          {authView === 'login' && (
            <Login onLoginSuccess={(u) => { setUser(u); setPage('catalog'); }} />
          )}
          {authView === 'register' && (
            <Register onRegistered={() => setAuthView('login')} />
          )}
        </div>
      </div>
    );
  }

  // =====================================================
  // Login ayyaka, full app kanipistundi
  // =====================================================
  return (
    <div>
      <div className="navbar">
        <span className="brand">📘 Notes Marketplace</span>
        <div className="nav-links">
          <button onClick={() => setPage('catalog')}>Catalog</button>

          {user.role === 'seller' && (
            <>
              <button onClick={() => setPage('upload')}>Upload</button>
              <button onClick={() => setPage('dashboard')}>Dashboard</button>
            </>
          )}
          {user.role === 'student' && (
            <button onClick={() => setPage('mypurchases')}>My Purchases</button>
          )}
          <span className="user-tag">👋 {user.name}</span>
          <button onClick={handleLogout}>Logout</button>
        </div>
      </div>

      {page === 'catalog' && <Catalog onSelectNote={handleSelectNote} />}
      {page === 'upload' && <Upload sellerId={user?.id} />}
      {page === 'dashboard' && <Dashboard user={user} />}
      {page === 'mypurchases' && <MyPurchases user={user} />}
      {page === 'details' && (
        <NoteDetails noteId={selectedNoteId} onBack={() => setPage('catalog')} />
      )}
    </div>
  );
}

export default App;