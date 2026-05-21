import { useState } from 'react';
import { Link } from 'react-router-dom';

function Register() {
  const [form, setForm] = useState({
    login: '',
    password: '',
    fullName: '',
    birthDate: '',
    phone: '',
    email: ''
  });

  const [error, setError] = useState('');

  function changeHandler(event) {
    setForm({
      ...form,
      [event.target.name]: event.target.value
    });
  }

  function validate() {
    if (!form.login || !form.password || !form.fullName || !form.birthDate || !form.phone || !form.email) {
      return 'Все поля обязательны для заполнения';
    }

    if (!/^[A-Za-z0-9]{6,}$/.test(form.login)) {
      return 'Логин должен содержать латинские буквы и цифры, минимум 6 символов';
    }

    if (form.password.length < 8) {
      return 'Пароль должен содержать 8 символов и более';
    }

    if (!/^[А-Яа-яЁё\s]+$/.test(form.fullName)) {
      return 'ФИО должно содержать только кириллицу и пробелы';
    }

    if (!/^8\(\d\d\d\)\d\d\d-\d\d-\d\d$/.test(form.phone.trim())) {
      return 'Телефон должен быть в формате 8(XXX)XXX-XX-XX';
    }

    if (!/^\S+@\S+\.\S+$/.test(form.email)) {
      return 'Введите корректный e-mail';
    }

    return '';
  }

  async function submitHandler(event) {
    event.preventDefault();

    const validationError = validate();

    if (validationError) {
      setError(validationError);
      return;
    }

    const response = await fetch('http://localhost:5001/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(form)
    });

    const data = await response.json();

    if (!response.ok) {
      setError(data.message);
      return;
    }

    setError('');
    alert('Пользователь зарегистрирован');
  }

  return (
    <div>
      <h1>Регистрация</h1>

      <form onSubmit={submitHandler}>
        <input name="login" placeholder="Логин" value={form.login} onChange={changeHandler} />
        <input name="password" type="password" placeholder="Пароль" value={form.password} onChange={changeHandler} />
        <input name="fullName" placeholder="ФИО" value={form.fullName} onChange={changeHandler} />
        <input name="birthDate" type="date" value={form.birthDate} onChange={changeHandler} />
        <input name="phone" placeholder="8(XXX)XXX-XX-XX" value={form.phone} onChange={changeHandler} />
        <input name="email" placeholder="E-mail" value={form.email} onChange={changeHandler} />

        <button type="submit">Зарегистрироваться</button>
      </form>

      <p className="error">{error}</p>

      <Link to="/">Уже зарегистрированы? Авторизация</Link>
    </div>
  );
}

export default Register;
