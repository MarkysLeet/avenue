import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import Layout from '../../components/Layout';
import { useAuth } from '../../contexts/AuthContext';
import { useToast } from '../../contexts/ToastContext';
import styles from '../../styles/AuthPage.module.css';

const RegisterPage = () => {
  const router = useRouter();
  const { register } = useAuth();
  const { toast } = useToast();
  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    phone: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    setError('');

    if (form.password !== form.confirmPassword) {
      setError('Пароли не совпадают');
      return;
    }

    try {
      const displayName = [form.firstName, form.lastName].filter(Boolean).join(' ').trim();
      register({
        name: displayName || form.email,
        email: form.email,
        password: form.password,
        firstName: form.firstName,
        lastName: form.lastName,
        phone: form.phone
      });
      toast({ type: 'success', message: 'Регистрация прошла успешно' });
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
    <Layout title="Регистрация — Avenue Professional">
      <section className={styles.section}>
        <div className={styles.card}>
          <h1>Создать аккаунт</h1>
          <p className={styles.subtitle}>
            Заполните данные, чтобы оформить персональный кабинет и сохранять избранное.
          </p>
          <form className={styles.form} onSubmit={handleSubmit}>
            <div className={styles['av-auth-grid']}>
              <label className={styles.label}>
                Имя (необязательно)
                <input
                  className={styles.input}
                  type="text"
                  name="firstName"
                  value={form.firstName}
                  onChange={handleChange}
                  placeholder="Например, Анна"
                />
              </label>
              <label
                className={`${styles.label} ${styles['av-label-nowrap']} whitespace-nowrap leading-tight sm:text-base text-sm`}
              >
                Фамилия (необязательно)
                <input
                  className={styles.input}
                  type="text"
                  name="lastName"
                  value={form.lastName}
                  onChange={handleChange}
                  placeholder="Например, Иванова"
                />
              </label>
            </div>
            <label className={styles.label}>
              Телефон (необязательно)
              <input
                className={styles.input}
                type="tel"
                name="phone"
                value={form.phone}
                onChange={handleChange}
                placeholder="+7 (___) ___-__-__"
              />
            </label>
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
            <label className={`${styles.label} ${styles['av-password-label']}`}>
              Пароль
              <div className={styles['av-password-field']}>
                <input
                  className={styles.input}
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={form.password}
                  onChange={handleChange}
                  placeholder="Минимум 6 символов"
                  required
                />
                <button
                  type="button"
                  className={styles['av-password-toggle']}
                  aria-label={showPassword ? 'Скрыть пароль' : 'Показать пароль'}
                  aria-pressed={showPassword}
                  onClick={() => setShowPassword((prev) => !prev)}
                >
                  <svg
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.6"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    {showPassword ? (
                      <>
                        <path d="M12 5c-7.633 0-11 7-11 7s3.367 7 11 7 11-7 11-7-3.367-7-11-7Zm0 12a5 5 0 1 1 0-10 5 5 0 0 1 0 10Z" />
                        <path d="m4.1 4.1 15.8 15.8" />
                      </>
                    ) : (
                      <>
                        <path d="M1 12s3.6-7 11-7 11 7 11 7-3.6 7-11 7S1 12 1 12Z" />
                        <circle cx="12" cy="12" r="4" />
                      </>
                    )}
                  </svg>
                </button>
              </div>
            </label>
            <label className={`${styles.label} ${styles['av-password-label']}`}>
              Подтверждение пароля
              <div className={styles['av-password-field']}>
                <input
                  className={styles.input}
                  type={showConfirmPassword ? 'text' : 'password'}
                  name="confirmPassword"
                  value={form.confirmPassword}
                  onChange={handleChange}
                  placeholder="Повторите пароль"
                  required
                />
                <button
                  type="button"
                  className={styles['av-password-toggle']}
                  aria-label={showConfirmPassword ? 'Скрыть пароль' : 'Показать пароль'}
                  aria-pressed={showConfirmPassword}
                  onClick={() => setShowConfirmPassword((prev) => !prev)}
                >
                  <svg
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.6"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    {showConfirmPassword ? (
                      <>
                        <path d="M12 5c-7.633 0-11 7-11 7s3.367 7 11 7 11-7 11-7-3.367-7-11-7Zm0 12a5 5 0 1 1 0-10 5 5 0 0 1 0 10Z" />
                        <path d="m4.1 4.1 15.8 15.8" />
                      </>
                    ) : (
                      <>
                        <path d="M1 12s3.6-7 11-7 11 7 11 7-3.6 7-11 7S1 12 1 12Z" />
                        <circle cx="12" cy="12" r="4" />
                      </>
                    )}
                  </svg>
                </button>
              </div>
            </label>
            {error ? <p className={styles.error}>{error}</p> : null}
            <button type="submit" className={styles.submitButton}>
              Зарегистрироваться
            </button>
          </form>
          <p className={styles['av-auth-note']}>
            Уже есть аккаунт?
            <Link className={styles['av-auth-link']} href="/auth/login">
              Войдите
            </Link>
          </p>
        </div>
      </section>
    </Layout>
  );
};

export default RegisterPage;
