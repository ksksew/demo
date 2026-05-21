import { useEffect, useState } from 'react';

function AdminPanel() {
  const userData = JSON.parse(localStorage.getItem('user'));

  const [applications, setApplications] = useState([]);
  const [filter, setFilter] = useState('');

  async function loadApplications() {
    const response = await fetch('http://localhost:5001/admin/applications');
    const data = await response.json();
    setApplications(data);
  }

  useEffect(() => {
    if (userData && userData.role === 'admin') {
      loadApplications();
    }
  }, []);

  async function changeStatus(id, statusId) {
    await fetch(`http://localhost:5001/applications/${id}/status`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ statusId })
    });

    alert('Статус изменен');
    loadApplications();
  }

  if (!userData || userData.role !== 'admin') {
    return <h2>Нет доступа. Войдите как администратор</h2>;
  }

  const filteredApplications = applications.filter((app) => {
    if (!filter) return true;
    return app.status === filter;
  });

  return (
    <div>
      <h1>Панель администратора</h1>

      <select value={filter} onChange={(e) => setFilter(e.target.value)}>
        <option value="">Все статусы</option>
        <option value="Новая">Новая</option>
        <option value="Идет обучение">Идет обучение</option>
        <option value="Обучение завершено">Обучение завершено</option>
      </select>

      {filteredApplications.map((app) => (
        <div className="card" key={app.id}>
          <p><b>ФИО:</b> {app.full_name}</p>
          <p><b>Телефон:</b> {app.phone}</p>
          <p><b>Email:</b> {app.email}</p>
          <p><b>Транспорт:</b> {app.transport}</p>
          <p><b>Дата:</b> {app.start_date}</p>
          <p><b>Оплата:</b> {app.payment_method}</p>
          <p><b>Статус:</b> {app.status}</p>

          <select
            value={
              app.status === 'Новая'
                ? '1'
                : app.status === 'Идет обучение'
                ? '2'
                : '3'
            }
            onChange={(e) => changeStatus(app.id, e.target.value)}
          >
            <option value="1">Новая</option>
            <option value="2">Идет обучение</option>
            <option value="3">Обучение завершено</option>
          </select>
        </div>
      ))}
    </div>
  );
}

export default AdminPanel;

