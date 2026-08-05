import { useState } from 'react';
import axios from 'axios';

function Register({ onRegistered }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('student');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5000/api/auth/register', { name, email, password, role });
      setMessage('✅ Registered successfully! Redirecting to login...');
      setTimeout(() => onRegistered(), 1500);
    } catch (err) {
      setMessage('❌ ' + (err.response?.data?.error || err.message));
    }
  };

  return (
    <div className="page-narrow">
      <span className="eyebrow">Get started</span>
      <h2>Register</h2>
      <form onSubmit={handleSubmit}>
        <input type="text" placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} />
        <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
        <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />

        <div className="role-group">
          <label>
            <input type="radio" name="role" value="student" checked={role === 'student'}
              onChange={(e) => setRole(e.target.value)} /> Student
          </label>
          <label>
            <input type="radio" name="role" value="seller" checked={role === 'seller'}
              onChange={(e) => setRole(e.target.value)} /> Seller
          </label>
        </div>

        <button className="btn-primary" type="submit">Register</button>
      </form>
      {message && <p className="status-msg">{message}</p>}
    </div>
  );
}

export default Register;