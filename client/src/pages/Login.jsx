import { useState } from 'react';
import axios from 'axios';

function Login({ onLoginSuccess }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('https://notes-marketplace-api.onrender.com', { email, password });
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('user', JSON.stringify(res.data.user));
      setMessage('✅ Login successful!');
      onLoginSuccess(res.data.user);
    } catch (err) {
      setMessage('❌ ' + (err.response?.data?.error || err.message));
    }
  };

  return (
    <div className="page-narrow">
      <span className="eyebrow">Welcome back</span>
      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
        <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
        <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
        <button className="btn-primary" type="submit">Login</button>
      </form>
      {message && <p className="status-msg">{message}</p>}
    </div>
  );
}

export default Login;