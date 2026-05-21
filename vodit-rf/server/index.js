const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');

const app = express();

app.use(cors());
app.use(express.json());

// Тут меняешь данные подключения к БД
const pool = new Pool({
  host: 'localhost',
  port: 5432,
  database: 'vodit_rf',
  user: 'postgres',
  password: 'postgres'
});

app.get('/', (req, res) => {
  res.send('Сервер работает');
});

// Регистрация
app.post('/register', async (req, res) => {
  const { login, password, fullName, birthDate, phone, email } = req.body;

  if (!login || !password || !fullName || !birthDate || !phone || !email) {
    return res.status(400).json({ message: 'Заполните все поля' });
  }

  const userCheck = await pool.query(
    'SELECT * FROM users WHERE login = $1',
    [login]
  );

  if (userCheck.rows.length > 0) {
    return res.status(400).json({ message: 'Логин уже существует' });
  }

  const result = await pool.query(
    `INSERT INTO users
    (role_id, login, password, full_name, birth_date, phone, email)
    VALUES ($1, $2, $3, $4, $5, $6, $7)
    RETURNING *`,
    [1, login, password, fullName, birthDate, phone, email]
  );

  res.json(result.rows[0]);
});

// Авторизация
app.post('/login', async (req, res) => {
  const { login, password } = req.body;

  if (login === 'Admin26' && password === 'Demo20') {
    return res.json({
      role: 'admin',
      user: {
        id: 0,
        login: 'Admin26'
      }
    });
  }

  const result = await pool.query(
    'SELECT * FROM users WHERE login = $1 AND password = $2',
    [login, password]
  );

  if (result.rows.length === 0) {
    return res.status(400).json({ message: 'Неверный логин или пароль' });
  }

  res.json({
    role: 'user',
    user: result.rows[0]
  });
});

// Получить виды транспорта
app.get('/transports', async (req, res) => {
  const result = await pool.query('SELECT * FROM transports');
  res.json(result.rows);
});

// Создать заявку
app.post('/applications', async (req, res) => {
  const { userId, transportId, startDate, paymentMethod } = req.body;

  if (!userId || !transportId || !startDate || !paymentMethod) {
    return res.status(400).json({ message: 'Заполните все поля' });
  }

  const result = await pool.query(
    `INSERT INTO applications
    (user_id, transport_id, status_id, start_date, payment_method)
    VALUES ($1, $2, $3, $4, $5)
    RETURNING *`,
    [userId, transportId, 1, startDate, paymentMethod]
  );

  res.json(result.rows[0]);
});

// Заявки пользователя
app.get('/applications/:userId', async (req, res) => {
  const { userId } = req.params;

  const result = await pool.query(
    `SELECT
      applications.id,
      applications.start_date,
      applications.payment_method,
      transports.title AS transport,
      statuses.name AS status
    FROM applications
    JOIN transports ON applications.transport_id = transports.id
    JOIN statuses ON applications.status_id = statuses.id
    WHERE applications.user_id = $1
    ORDER BY applications.id DESC`,
    [userId]
  );

  res.json(result.rows);
});

// Оставить отзыв
app.post('/reviews', async (req, res) => {
  const { applicationId, text } = req.body;

  if (!text) {
    return res.status(400).json({ message: 'Введите отзыв' });
  }

  const check = await pool.query(
    `SELECT statuses.name AS status
    FROM applications
    JOIN statuses ON applications.status_id = statuses.id
    WHERE applications.id = $1`,
    [applicationId]
  );

  if (check.rows.length === 0) {
    return res.status(400).json({ message: 'Заявка не найдена' });
  }

  if (check.rows[0].status !== 'Обучение завершено') {
    return res.status(400).json({
      message: 'Отзыв можно оставить только после завершения обучения'
    });
  }

  const result = await pool.query(
    `INSERT INTO reviews (application_id, text)
    VALUES ($1, $2)
    RETURNING *`,
    [applicationId, text]
  );

  res.json(result.rows[0]);
});

// Все заявки для админа
app.get('/admin/applications', async (req, res) => {
  const result = await pool.query(
    `SELECT
      applications.id,
      applications.start_date,
      applications.payment_method,
      users.full_name,
      users.phone,
      users.email,
      transports.title AS transport,
      statuses.name AS status
    FROM applications
    JOIN users ON applications.user_id = users.id
    JOIN transports ON applications.transport_id = transports.id
    JOIN statuses ON applications.status_id = statuses.id
    ORDER BY applications.id DESC`
  );

  res.json(result.rows);
});

// Смена статуса
app.put('/applications/:id/status', async (req, res) => {
  const { id } = req.params;
  const { statusId } = req.body;

  const result = await pool.query(
    `UPDATE applications
    SET status_id = $1
    WHERE id = $2
    RETURNING *`,
    [statusId, id]
  );

  res.json(result.rows[0]);
});

app.listen(5001, () => {
  console.log('Сервер запущен на 5001');
});
