import { Routes, Route, Link } from 'react-router-dom';

import Login from './pages/Login';
import Register from './pages/Register';
import CreateApplication from './pages/CreateApplication';
import UserApplications from './pages/UserApplications';
import AdminPanel from './pages/AdminPanel';
import Slider from './components/Slider';

function App() {
  return (
    <div>
      <nav>
        <Link to="/">Вход</Link>
        <Link to="/register">Регистрация</Link>
        <Link to="/applications">Личный кабинет</Link>
        <Link to="/create">Оформить заявку</Link>
        <Link to="/admin">Админ</Link>
      </nav>

      <Slider />

      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/applications" element={<UserApplications />} />
        <Route path="/create" element={<CreateApplication />} />
        <Route path="/admin" element={<AdminPanel />} />
      </Routes>
    </div>
  );
}

export default App;