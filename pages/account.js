import { useEffect, useMemo, useRef, useState } from 'react';
import Link from 'next/link';
import Layout from '../components/Layout';
import ProductCard from '../components/ProductCard';
import { useAuth } from '../contexts/AuthContext';
import { useCart } from '../contexts/CartContext';
import { useFavorites } from '../contexts/FavoritesContext';
import { products } from '../data/products';
import styles from '../styles/AccountPage.module.css';

const tabs = [
  { id: 'profile', label: 'Профиль' },
  { id: 'address', label: 'Адрес доставки' },
  { id: 'orders', label: 'История покупок' },
  { id: 'security', label: 'Безопасность' },
  { id: 'favorites', label: 'Избранное' }
];

const PROFILE_STORAGE_KEY = 'avenue-account-profile';
const ADDRESS_STORAGE_KEY = 'avenue-account-address';

const defaultProfile = {
  firstName: '',
  lastName: '',
  email: '',
  phone: ''
};

const defaultAddress = {
  country: '',
  city: '',
  street: '',
  postalCode: ''
};

const mockOrders = [
  {
    orderNo: 'AV-2027',
    date: '12.08.2024',
    status: 'В обработке',
    total: 2680,
    items: [
      { productId: 'np-rose-veil', quantity: 1 },
      { productId: 'np-powder-blush', quantity: 1 }
    ]
  },
  {
    orderNo: 'AV-1998',
    date: '02.07.2024',
    status: 'Отправлен',
    total: 8140,
    items: [
      { productId: 'mt-drill', quantity: 1 },
      { productId: 'consumable-wipes', quantity: 2 }
    ]
  },
  {
    orderNo: 'AV-1875',
    date: '18.05.2024',
    status: 'Доставлен',
    total: 3940,
    items: [
      { productId: 'gel-sculptor', quantity: 1 },
      { productId: 'poly-flex', quantity: 1 }
    ]
  }
];

const statusVariants = {
  'В обработке': 'processing',
  'Отправлен': 'shipped',
  'Доставлен': 'delivered',
  'Отменён': 'cancelled'
};

const AccountPage = () => {
  const { user } = useAuth();
  const { addToCart } = useCart();
  const { favoriteIds } = useFavorites();
  const [activeTab, setActiveTab] = useState('profile');
  const [profile, setProfile] = useState(defaultProfile);
  const [address, setAddress] = useState(defaultAddress);
  const [profileSaved, setProfileSaved] = useState(false);
  const [addressSaved, setAddressSaved] = useState(false);
  const [securitySaved, setSecuritySaved] = useState(false);
  const [security, setSecurity] = useState({ email: '', phone: '', password: '' });
  const [reorderedOrder, setReorderedOrder] = useState(null);
  const tabRefs = useRef([]);
  const profileTimerRef = useRef(null);
  const addressTimerRef = useRef(null);
  const securityTimerRef = useRef(null);
  const reorderTimerRef = useRef(null);

  useEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }

    const storedProfile = window.localStorage.getItem(PROFILE_STORAGE_KEY);
    if (storedProfile) {
      try {
        const parsed = JSON.parse(storedProfile);
        setProfile((prev) => ({ ...prev, ...parsed }));
      } catch (error) {
        console.warn('Ошибка чтения профиля', error);
      }
    }

    const storedAddress = window.localStorage.getItem(ADDRESS_STORAGE_KEY);
    if (storedAddress) {
      try {
        const parsed = JSON.parse(storedAddress);
        setAddress((prev) => ({ ...prev, ...parsed }));
      } catch (error) {
        console.warn('Ошибка чтения адреса', error);
      }
    }
  }, []);

  useEffect(() => {
    if (user?.email) {
      setProfile((prev) => ({ ...prev, email: user.email }));
    }
  }, [user?.email]);

  useEffect(() => {
    return () => {
      if (profileTimerRef.current) {
        clearTimeout(profileTimerRef.current);
      }
      if (addressTimerRef.current) {
        clearTimeout(addressTimerRef.current);
      }
      if (securityTimerRef.current) {
        clearTimeout(securityTimerRef.current);
      }
      if (reorderTimerRef.current) {
        clearTimeout(reorderTimerRef.current);
      }
    };
  }, []);

  const favoriteProducts = useMemo(
    () => products.filter((product) => favoriteIds.includes(product.id)),
    [favoriteIds]
  );

  const handleTabKeyDown = (event, index) => {
    if (event.key !== 'ArrowRight' && event.key !== 'ArrowLeft') {
      return;
    }
    event.preventDefault();
    const delta = event.key === 'ArrowRight' ? 1 : -1;
    const nextIndex = (index + delta + tabs.length) % tabs.length;
    setActiveTab(tabs[nextIndex].id);
    const nextTab = tabRefs.current[nextIndex];
    if (nextTab) {
      nextTab.focus();
    }
  };

  const handleProfileChange = (event) => {
    const { name, value } = event.target;
    setProfile((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddressChange = (event) => {
    const { name, value } = event.target;
    setAddress((prev) => ({ ...prev, [name]: value }));
  };

  const handleSecurityChange = (event) => {
    const { name, value } = event.target;
    setSecurity((prev) => ({ ...prev, [name]: value }));
  };

  const handleProfileSubmit = (event) => {
    event.preventDefault();
    if (typeof window !== 'undefined') {
      window.localStorage.setItem(PROFILE_STORAGE_KEY, JSON.stringify(profile));
    }
    setProfileSaved(true);
    if (profileTimerRef.current) {
      clearTimeout(profileTimerRef.current);
    }
    profileTimerRef.current = setTimeout(() => {
      setProfileSaved(false);
    }, 2400);
  };

  const handleAddressSubmit = (event) => {
    event.preventDefault();
    if (typeof window !== 'undefined') {
      window.localStorage.setItem(ADDRESS_STORAGE_KEY, JSON.stringify(address));
    }
    setAddressSaved(true);
    if (addressTimerRef.current) {
      clearTimeout(addressTimerRef.current);
    }
    addressTimerRef.current = setTimeout(() => {
      setAddressSaved(false);
    }, 2400);
  };

  const handleSecuritySubmit = (event) => {
    event.preventDefault();
    setSecuritySaved(true);
    if (securityTimerRef.current) {
      clearTimeout(securityTimerRef.current);
    }
    securityTimerRef.current = setTimeout(() => {
      setSecuritySaved(false);
    }, 2400);
  };

  const handleReorder = (order) => {
    order.items.forEach(({ productId, quantity }) => {
      const product = products.find((item) => item.id === productId);
      if (product) {
        addToCart(product, quantity);
      }
    });
    setReorderedOrder(order.orderNo);
    if (reorderTimerRef.current) {
      clearTimeout(reorderTimerRef.current);
    }
    reorderTimerRef.current = setTimeout(() => {
      setReorderedOrder(null);
    }, 900);
  };

  const renderProfileTab = () => (
    <form className={styles['av-account-form']} onSubmit={handleProfileSubmit}>
      <div className={styles['av-account-grid']}>
        <div className={styles['av-account-field']}>
          <label htmlFor="account-first-name">Имя</label>
          <input
            id="account-first-name"
            name="firstName"
            value={profile.firstName}
            onChange={handleProfileChange}
            placeholder="Анна"
            autoComplete="given-name"
          />
        </div>
        <div className={styles['av-account-field']}>
          <label htmlFor="account-last-name">Фамилия</label>
          <input
            id="account-last-name"
            name="lastName"
            value={profile.lastName}
            onChange={handleProfileChange}
            placeholder="Иванова"
            autoComplete="family-name"
          />
        </div>
        <div className={styles['av-account-field']}>
          <label htmlFor="account-email">Email</label>
          <input
            id="account-email"
            name="email"
            type="email"
            value={profile.email}
            onChange={handleProfileChange}
            placeholder="you@example.com"
            autoComplete="email"
            disabled
          />
        </div>
        <div className={styles['av-account-field']}>
          <label htmlFor="account-phone">Телефон</label>
          <input
            id="account-phone"
            name="phone"
            type="tel"
            value={profile.phone}
            onChange={handleProfileChange}
            placeholder="+7 (___) ___-__-__"
            autoComplete="tel"
          />
        </div>
      </div>
      <button type="submit" className={styles['av-account-save']}>
        Сохранить
      </button>
      {profileSaved ? <p className={styles['av-account-feedback']}>Профиль обновлён</p> : null}
    </form>
  );

  const renderAddressTab = () => (
    <form className={styles['av-account-form']} onSubmit={handleAddressSubmit}>
      <div className={`${styles['av-account-grid']} ${styles['av-account-grid-single']}`}>
        <div className={styles['av-account-field']}>
          <label htmlFor="account-country">Страна</label>
          <input
            id="account-country"
            name="country"
            value={address.country}
            onChange={handleAddressChange}
            placeholder="Россия"
            autoComplete="country-name"
          />
        </div>
        <div className={styles['av-account-field']}>
          <label htmlFor="account-city">Город</label>
          <input
            id="account-city"
            name="city"
            value={address.city}
            onChange={handleAddressChange}
            placeholder="Москва"
            autoComplete="address-level2"
          />
        </div>
        <div className={styles['av-account-field']}>
          <label htmlFor="account-street">Улица, дом, квартира</label>
          <input
            id="account-street"
            name="street"
            value={address.street}
            onChange={handleAddressChange}
            placeholder="ул. Пушкинская, д. 10, кв. 5"
            autoComplete="street-address"
          />
        </div>
        <div className={styles['av-account-field']}>
          <label htmlFor="account-postal">Индекс</label>
          <input
            id="account-postal"
            name="postalCode"
            value={address.postalCode}
            onChange={handleAddressChange}
            placeholder="123456"
            autoComplete="postal-code"
          />
        </div>
      </div>
      <button type="submit" className={styles['av-account-save']}>
        Сохранить
      </button>
      {addressSaved ? <p className={styles['av-account-feedback']}>Адрес сохранён</p> : null}
    </form>
  );

  const renderOrdersTab = () => (
    <div>
      <table className={styles['av-account-orders']}>
        <thead>
          <tr>
            <th>Номер заказа</th>
            <th>Дата</th>
            <th>Статус</th>
            <th>Сумма</th>
            <th aria-label="Действия" />
          </tr>
        </thead>
        <tbody>
          {mockOrders.map((order) => {
            const variant = statusVariants[order.status] || 'processing';
            const statusClass = `${styles['av-account-status']} ${styles[`av-account-status-${variant}`] || ''}`;
            return (
              <tr
                key={order.orderNo}
                className={`${styles['av-account-order-row']} ${
                  reorderedOrder === order.orderNo ? styles['av-account-order-row-active'] : ''
                }`}
              >
                <td>{order.orderNo}</td>
                <td>{order.date}</td>
                <td>
                  <span className={statusClass}>{order.status}</span>
                </td>
                <td>{order.total.toLocaleString()} ₽</td>
                <td>
                  <button
                    type="button"
                    className={styles['av-account-order-action']}
                    onClick={() => handleReorder(order)}
                  >
                    Повторить заказ
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );

  const renderSecurityTab = () => (
    <form className={styles['av-account-form']} onSubmit={handleSecuritySubmit}>
      <div className={styles['av-account-grid']}>
        <div className={styles['av-account-field']}>
          <label htmlFor="account-security-email">Новый email</label>
          <input
            id="account-security-email"
            name="email"
            type="email"
            value={security.email}
            onChange={handleSecurityChange}
            placeholder="new@example.com"
            autoComplete="email"
          />
        </div>
        <div className={styles['av-account-field']}>
          <label htmlFor="account-security-phone">Новый телефон</label>
          <input
            id="account-security-phone"
            name="phone"
            type="tel"
            value={security.phone}
            onChange={handleSecurityChange}
            placeholder="+7 (___) ___-__-__"
            autoComplete="tel"
          />
        </div>
        <div className={styles['av-account-field']}>
          <label htmlFor="account-security-password">Пароль</label>
          <input
            id="account-security-password"
            name="password"
            type="password"
            value={security.password}
            onChange={handleSecurityChange}
            placeholder="Новый пароль"
            autoComplete="new-password"
          />
        </div>
      </div>
      <button type="submit" className={styles['av-account-save']}>
        Сохранить
      </button>
      {securitySaved ? <p className={styles['av-account-feedback']}>Настройки обновлены</p> : null}
    </form>
  );

  const renderFavoritesTab = () => (
    <div>
      {favoriteProducts.length > 0 ? (
        <div className={styles['av-account-favorites-grid']}>
          {favoriteProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <div className={styles['av-account-empty']}>
          <p>Вы ещё не добавили товары в избранное. Сохраняйте понравившиеся позиции и возвращайтесь к ним позже.</p>
          <Link href="/catalog" className={styles['av-account-empty-link']}>
            Перейти в каталог
          </Link>
        </div>
      )}
    </div>
  );

  let panelContent = null;
  if (activeTab === 'profile') {
    panelContent = renderProfileTab();
  } else if (activeTab === 'address') {
    panelContent = renderAddressTab();
  } else if (activeTab === 'orders') {
    panelContent = renderOrdersTab();
  } else if (activeTab === 'security') {
    panelContent = renderSecurityTab();
  } else {
    panelContent = renderFavoritesTab();
  }

  return (
    <Layout title="Личный кабинет — Avenue Professional">
      <section className={styles['av-account-section']}>
        <div className={styles['av-account-header']}>
          <h1>Личный кабинет</h1>
          <p>Управляйте данными профиля, отслеживайте заказы и сохраняйте любимые продукты Avenue Professional.</p>
        </div>
        <div role="tablist" aria-label="Разделы аккаунта" className={styles['av-account-tabs']}>
          {tabs.map((tab, index) => (
            <button
              key={tab.id}
              type="button"
              role="tab"
              id={`account-tab-${tab.id}`}
              aria-controls={`account-panel-${tab.id}`}
              aria-selected={activeTab === tab.id}
              tabIndex={activeTab === tab.id ? 0 : -1}
              className={`${styles['av-account-tab']} ${
                activeTab === tab.id ? styles['av-account-tab-active'] : ''
              }`}
              onClick={() => setActiveTab(tab.id)}
              onKeyDown={(event) => handleTabKeyDown(event, index)}
              ref={(element) => {
                tabRefs.current[index] = element;
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>
        <div
          role="tabpanel"
          id={`account-panel-${activeTab}`}
          aria-labelledby={`account-tab-${activeTab}`}
          className={styles['av-account-panel']}
        >
          {panelContent}
        </div>
      </section>
    </Layout>
  );
};

export default AccountPage;
