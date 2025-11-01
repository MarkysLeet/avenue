import { useState } from 'react';
import Layout from '../components/Layout';
import { useAuth } from '../contexts/AuthContext';
import styles from '../styles/AuthPage.module.css';

const AuthPage = () => {
  const { register, login } = useAuth();
  const [mode, setMode] = useState('login');
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  const toggleMode = () => {
    setMode((prev) => (prev === 'login' ? 'register' : 'login'));
    setError('');
    setMessage('');
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    setError('');
    setMessage('');

    try {
      if (mode === 'login') {
        login({ email: form.email, password: form.password });
        setMessage('Вы успешно вошли!');
      } else {
        if (!form.name) {
          setError('Введите имя для регистрации');
          return;
        }
        register({ name: form.name, email: form.email, password: form.password });
        setMessage('Регистрация прошла успешно!');
      }
    } catch (authError) {
      setError(authError.message);
    }
  };

  const isRegister = mode === 'register';

  return (
    <Layout title="Вход и регистрация — Avenue Beauty">
      <section className={styles.section}>
        <div className={styles.card}>
          <h1>{isRegister ? 'Регистрация' : 'Вход'}</h1>
          <p className={styles.subtitle}>
            Создайте аккаунт, чтобы отслеживать заказы и быстрее оформлять покупки.
          </p>
          <form className={styles.form} onSubmit={handleSubmit}>
            {isRegister && (
              <label className={styles.label}>
                Имя
                <input
                  className={styles.input}
                  type="text"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  placeholder="Например, Анна"
                  required={isRegister}
                />
              </label>
            )}
            <label className={styles.label}>
              Email
              <input
                className={styles.input}
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                placeholder="you@example.com"
                required
              />
            </label>
            <label className={styles.label}>
              Пароль
              <input
                className={styles.input}
                type="password"
                name="password"
                value={form.password}
                onChange={handleChange}
                placeholder="Минимум 6 символов"
                required
              />
            </label>
            {error && <p className={styles.error}>{error}</p>}
            {message && <p className={styles.success}>{message}</p>}
            <button type="submit" className={styles.submitButton}>
              {isRegister ? 'Зарегистрироваться' : 'Войти'}
            </button>
          </form>
          <button className={styles.switch} onClick={toggleMode}>
            {isRegister
              ? 'Уже есть аккаунт? Войдите'
              : 'Нет аккаунта? Зарегистрируйтесь'}
          </button>
        </div>
      </section>
    </Layout>
  );
};

export default AuthPage;
