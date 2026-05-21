import { useEffect, useState } from 'react';

function CreateApplication() {
  const [transports, setTransports] = useState([]);
  const [transportId, setTransportId] = useState('');
  const [startDate, setStartDate] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('Наличные');
  const [error, setError] = useState('');

  async function loadTransports() {
    const response = await fetch('http://localhost:5001/transports');
    const data = await response.json();
    setTransports(data);
  }

  useEffect(() => {
    loadTransports();
  }, []);

  async function submitHandler(event) {
    event.preventDefault();

    const userData = JSON.parse(localStorage.getItem('user'));

    if (!userData || userData.role !== 'user') {
      setError('Сначала войдите как пользователь');
      return;
    }

    if (!transportId || !startDate || !paymentMethod) {
      setError('Заполните все поля');
      return;
    }

    await fetch('http://localhost:5001/applications', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        userId: userData.user.id,
        transportId,
        startDate,
        paymentMethod
      })
    });

    setError('');
    alert('Заявка создана');
  }

  return (
    <div>
      <h1>Оформление заявки</h1>

      <form onSubmit={submitHandler}>
        <select value={transportId} onChange={(e) => setTransportId(e.target.value)}>
          <option value="">Выберите вид транспорта</option>

          {transports.map((transport) => (
            <option key={transport.id} value={transport.id}>
              {transport.title}
            </option>
          ))}
        </select>

        <label>Дата начала обучения</label>

        <input
          type="date"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
        />

        <select value={paymentMethod} onChange={(e) => setPaymentMethod(e.target.value)}>
          <option value="Наличные">Наличные</option>
          <option value="Перевод">Перевод по номеру телефона</option>
        </select>

        <button type="submit">Отправить заявку</button>
      </form>

      <p className="error">{error}</p>
    </div>
  );
}

export default CreateApplication;