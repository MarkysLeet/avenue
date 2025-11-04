import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import Layout from '../../components/Layout';
import { useAuth } from '../../contexts/AuthContext';
import { useToast } from '../../contexts/ToastContext';
import styles from '../../styles/AuthPage.module.css';

const LoginPage = () => {
  const router = useRouter();
  const { login } = useAuth();
  const { toast } = useToast();
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    setError('');

    try {
      login({ email: form.email, password: form.password });
      toast({ type: 'success', message: 'Вы успешно вошли' });
      const { returnTo } = router.query;
      const candidate = typeof returnTo === 'string' ? returnTo : '/';
      const targetRoute = candidate.startsWith('/') && !candidate.startsWith('//') ? candidate : '/';
      router.replace(targetRoute);
    } catch (authError) {
      setError(authError.message);
      toast({ type: 'error', message: authError.message });
    }
  };

  return (
    <Layout title="Вход — Avenue Professional">
      <section className={styles.section}>
        <div className={styles.card}>
          <h1>Вход в аккаунт</h1>
          <p className={styles.subtitle}>Добро пожаловать! Войдите, чтобы продолжить покупки.</p>
          <form className={styles.form} onSubmit={handleSubmit}>
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
                placeholder="Ваш пароль"
                required
              />
            </label>
            {error ? <p className={styles.error}>{error}</p> : null}
            <button type="submit" className={styles.submitButton}>
              Войти
            </button>
          </form>
          <p className={styles['av-auth-note']}>
            Нет аккаунта?
            <Link className={styles['av-auth-link']} href="/auth/register">
              Зарегистрируйтесь
            </Link>
          </p>
        </div>
      </section>
    </Layout>
  );
};

export default LoginPage;
