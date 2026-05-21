import { useEffect, useState } from 'react';

function AdminPanel() {
  const userData = JSON.parse(localStorage.getItem('user'));
  const [applications, setApplications] = useState([]);
  const [filter, setFilter] = useState('');
  const [message, setMessage] = useState('');

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
    const statusMap = { 1: 'Новая', 2: 'Идет обучение', 3: 'Обучение завершено' };
    
    await fetch(`http://localhost:5001/applications/${id}/status`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ statusId })
    });

    setMessage(`Статус изменен на "${statusMap[statusId]}"`);
    setTimeout(() => setMessage(''), 3000);
    loadApplications();
  }

  const getStatusClass = (status) => {
    if (status === 'Новая') return 'status-new';
    if (status === 'Идет обучение') return 'status-learning';
    return 'status-completed';
  };

  if (!userData || userData.role !== 'admin') {
    return (
      <div className="container">
        <h2> Нет доступа</h2>
        <p>Войдите как администратор</p>
      </div>
    );
  }

  const filteredApplications = applications.filter((app) => {
    if (!filter) return true;
    return app.status === filter;
  });

  return (
    <div className="container">
      <h1>👨‍✈️ Панель администратора</h1>

      {message && <div className="success">{message}</div>}

      <select 
        className="filter-select"
        value={filter} 
        onChange={(e) => setFilter(e.target.value)}
      >
        <option value="">📋 Все статусы</option>
        <option value="Новая"> Новая</option>
        <option value="Идет обучение"> Идет обучение</option>
        <option value="Обучение завершено"> Обучение завершено</option>
      </select>

      {filteredApplications.length === 0 ? (
        <p style={{ textAlign: 'center', color: '#6C757D' }}>Нет заявок</p>
      ) : (
        filteredApplications.map((app) => (
          <div className="card" key={app.id}>
            <p><b> ФИО:</b> {app.full_name}</p>
            <p><b> Телефон:</b> {app.phone}</p>
            <p><b> Email:</b> {app.email}</p>
            <p><b> Транспорт:</b> {app.transport}</p>
            <p><b> Дата:</b> {app.start_date}</p>
            <p><b> Оплата:</b> {app.payment_method}</p>
            <p>
              <b> Статус:</b>{' '}
              <span className={`status ${getStatusClass(app.status)}`}>
                {app.status}
              </span>
            </p>

            <select
              value={
                app.status === 'Новая' ? '1' :
                app.status === 'Идет обучение' ? '2' : '3'
              }
              onChange={(e) => changeStatus(app.id, e.target.value)}
              style={{ marginTop: '15px', width: 'auto', display: 'inline-block' }}
            >
              <option value="1"> Новая</option>
              <option value="2"> Идет обучение</option>
              <option value="3"> Обучение завершено</option>
            </select>
          </div>
        ))
      )}
    </div>
  );
}

export default AdminPanel;