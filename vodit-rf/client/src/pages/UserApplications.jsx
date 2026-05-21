import { useEffect, useState } from 'react';

function UserApplications() {
  const [applications, setApplications] = useState([]);
  const [reviewText, setReviewText] = useState('');
  const [message, setMessage] = useState('');

  async function loadApplications() {
    const userData = JSON.parse(localStorage.getItem('user'));

    if (!userData || userData.role !== 'user') {
      setMessage('Сначала войдите как пользователь');
      return;
    }

    const response = await fetch(`http://localhost:5001/applications/${userData.user.id}`);
    const data = await response.json();
    setApplications(data);
  }

  useEffect(() => {
    loadApplications();
  }, []);

  async function sendReview(applicationId) {
    const response = await fetch('http://localhost:5001/reviews', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        applicationId,
        text: reviewText
      })
    });

    const data = await response.json();

    if (!response.ok) {
      setMessage(data.message);
      return;
    }

    setMessage('Отзыв сохранен');
    setReviewText('');
  }

  return (
    <div>
      <h1>Личный кабинет</h1>
      <h2>История заявок</h2>

      <p>{message}</p>

      {applications.map((app) => (
        <div className="card" key={app.id}>
          <p><b>Транспорт:</b> {app.transport}</p>
          <p><b>Дата начала:</b> {app.start_date}</p>
          <p><b>Оплата:</b> {app.payment_method}</p>
          <p><b>Статус:</b> {app.status}</p>

          {app.status === 'Обучение завершено' && (
            <div>
              <textarea
                placeholder="Оставить отзыв"
                value={reviewText}
                onChange={(e) => setReviewText(e.target.value)}
              />

              <button onClick={() => sendReview(app.id)}>
                Отправить отзыв
              </button>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

export default UserApplications;