DROP TABLE IF EXISTS reviews;
DROP TABLE IF EXISTS applications;
DROP TABLE IF EXISTS statuses;
DROP TABLE IF EXISTS transports;
DROP TABLE IF EXISTS users;
DROP TABLE IF EXISTS roles;

CREATE TABLE roles (
    id SERIAL PRIMARY KEY,
    name VARCHAR(50) NOT NULL
);

INSERT INTO roles (name)
VALUES
('user'),
('admin');

CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    role_id INTEGER REFERENCES roles(id),
    login VARCHAR(50) UNIQUE NOT NULL,
    password VARCHAR(100) NOT NULL,
    full_name VARCHAR(150) NOT NULL,
    birth_date DATE NOT NULL,
    phone VARCHAR(30) NOT NULL,
    email VARCHAR(100) NOT NULL
);

CREATE TABLE transports (
    id SERIAL PRIMARY KEY,
    title VARCHAR(150) NOT NULL
);

INSERT INTO transports (title)
VALUES
('Катер'),
('Круизный лайнер'),
('Яхта');

CREATE TABLE statuses (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL
);

INSERT INTO statuses (name)
VALUES
('Новая'),
('Идет обучение'),
('Обучение завершено');

CREATE TABLE applications (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id),
    transport_id INTEGER REFERENCES transports(id),
    status_id INTEGER REFERENCES statuses(id),
    start_date DATE NOT NULL,
    payment_method VARCHAR(100) NOT NULL
);

CREATE TABLE reviews (
    id SERIAL PRIMARY KEY,
    application_id INTEGER REFERENCES applications(id),
    text TEXT NOT NULL
);

INSERT INTO users
(role_id, login, password, full_name, birth_date, phone, email)
VALUES
(1, 'user123', 'password123', 'Иван Иванов', '2000-01-01', '8(999)123-45-67', 'ivan@mail.ru'),
(1, 'user456', 'password456', 'Петр Петров', '1999-05-15', '8(999)111-22-33', 'petr@mail.ru');

INSERT INTO applications
(user_id, transport_id, status_id, start_date, payment_method)
VALUES
(1, 1, 1, '2026-06-01', 'Наличные'),
(2, 2, 3, '2026-06-15', 'Перевод');

INSERT INTO reviews
(application_id, text)
VALUES
(2, 'Обучение понравилось, инструктор всё объяснил понятно');

SELECT * FROM users;
SELECT * FROM transports;
SELECT * FROM applications;
SELECT * FROM reviews;