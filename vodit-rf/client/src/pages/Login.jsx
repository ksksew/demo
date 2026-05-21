import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

function Login() {
  const navigate = useNavigate();

  const [login, setLogin] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  async function submitHandler(event) {
    event.preventDefault();

    if (!login || !password) {
      setError('Введите логин и пароль');
      return;
    }

    const response = await fetch('http://localhost:5001/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ login, password })
    });

    const data = await response.json();

    if (!response.ok) {
      setError(data.message);
      return;
    }

    localStorage.setItem('user', JSON.stringify(data));

    if (data.role === 'admin') {
      navigate('/admin');
    } else {
      navigate('/applications');
    }
  }

  return (
    <div>
      <h1>Авторизация</h1>

      <form onSubmit={submitHandler}>
        <input placeholder="Логин" value={login} onChange={(e) => setLogin(e.target.value)} />
        <input type="password" placeholder="Пароль" value={password} onChange={(e) => setPassword(e.target.value)} />

        <button type="submit">Войти</button>
      </form>

      <p className="error">{error}</p>

      <Link to="/register">Еще не зарегистрированы? Регистрация</Link>
    </div>
  );
}

export default Login;
