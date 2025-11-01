import styles from '../styles/Footer.module.css';

const Footer = () => {
  return (
    <footer className={styles.footer}>
      <div className={styles.content}>
        <p>© {new Date().getFullYear()} Avenue Beauty. Все права защищены.</p>
        <p className={styles.caption}>
          Нежный магазин красоты. Дальнейшие страницы легко добавить в структуру.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
