import { useEffect, useMemo, useRef, useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import Layout from '../components/Layout';
import ProductCard from '../components/ProductCard';
import { useAuth } from '../contexts/AuthContext';
import { useCart } from '../contexts/CartContext';
import { useFavorites } from '../contexts/FavoritesContext';
import { useToast } from '../contexts/ToastContext';
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
const SECURITY_STORAGE_KEY = 'avenue-account-security';

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

const defaultSecurity = {
  email: '',
  phone: '',
  isPasswordSet: false
};

const buildSecurityDraft = (base, profile) => ({
  email: base.email || profile.email || '',
  phone: base.phone || profile.phone || '',
  password: ''
});

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
  const router = useRouter();
  const { user, isAuthenticated } = useAuth();
  const { addToCart } = useCart();
  const { favoriteIds } = useFavorites();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('profile');
  const [profile, setProfile] = useState(defaultProfile);
  const [profileDraft, setProfileDraft] = useState(defaultProfile);
  const [isProfileEditing, setIsProfileEditing] = useState(false);
  const [address, setAddress] = useState(defaultAddress);
  const [addressDraft, setAddressDraft] = useState(defaultAddress);
  const [isAddressEditing, setIsAddressEditing] = useState(false);
  const [security, setSecurity] = useState(defaultSecurity);
  const [securityDraft, setSecurityDraft] = useState(buildSecurityDraft(defaultSecurity, defaultProfile));
  const [isSecurityEditing, setIsSecurityEditing] = useState(false);
  const [reorderedOrder, setReorderedOrder] = useState(null);
  const tabRefs = useRef([]);
  const reorderTimerRef = useRef(null);
  const guardRef = useRef(false);

  useEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }

    let nextProfile = { ...defaultProfile };
    let nextAddress = { ...defaultAddress };
    let nextSecurity = { ...defaultSecurity };

    const storedProfile = window.localStorage.getItem(PROFILE_STORAGE_KEY);
    if (storedProfile) {
      try {
        const parsed = JSON.parse(storedProfile);
        nextProfile = { ...defaultProfile, ...parsed };
      } catch (error) {
        console.warn('Ошибка чтения профиля', error);
      }
    }

    const storedAddress = window.localStorage.getItem(ADDRESS_STORAGE_KEY);
    if (storedAddress) {
      try {
        const parsed = JSON.parse(storedAddress);
        nextAddress = { ...defaultAddress, ...parsed };
      } catch (error) {
        console.warn('Ошибка чтения адреса', error);
      }
    }

    const storedSecurity = window.localStorage.getItem(SECURITY_STORAGE_KEY);
    if (storedSecurity) {
      try {
        const parsed = JSON.parse(storedSecurity);
        nextSecurity = { ...defaultSecurity, ...parsed };
      } catch (error) {
        console.warn('Ошибка чтения настроек безопасности', error);
      }
    }

    setProfile(nextProfile);
    setProfileDraft(nextProfile);
    setAddress(nextAddress);
    setAddressDraft(nextAddress);
    setSecurity(nextSecurity);
    setSecurityDraft(buildSecurityDraft(nextSecurity, nextProfile));
  }, []);

  useEffect(() => {
    if (user?.email) {
      setProfile((prev) => ({ ...prev, email: prev.email || user.email }));
      setProfileDraft((prev) => ({ ...prev, email: prev.email || user.email }));
      setSecurity((prev) => ({ ...prev, email: prev.email || user.email }));
      setSecurityDraft((prev) => ({ ...prev, email: prev.email || user.email }));
    }
  }, [user?.email]);

  useEffect(() => {
    if (user?.name) {
      setProfile((prev) => ({ ...prev, firstName: prev.firstName || user.name }));
      setProfileDraft((prev) => ({ ...prev, firstName: prev.firstName || user.name }));
    }
  }, [user?.name]);

  useEffect(() => () => {
    if (reorderTimerRef.current) {
      clearTimeout(reorderTimerRef.current);
    }
  }, []);

  useEffect(() => {
    if (!isAuthenticated && !guardRef.current) {
      guardRef.current = true;
      toast({
        type: 'warning',
        message: 'Требуется авторизация для доступа к личному кабинету',
        actionLabel: 'Войти',
        onAction: () => router.push('/auth?returnTo=/account')
      });
      router.replace('/auth?returnTo=/account');
    }
  }, [isAuthenticated, router, toast]);

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

  const beginProfileEdit = () => {
    setProfileDraft(profile);
    setIsProfileEditing(true);
  };

  const cancelProfileEdit = () => {
    setProfileDraft(profile);
    setIsProfileEditing(false);
  };

  const handleProfileDraftChange = (event) => {
    const { name, value } = event.target;
    setProfileDraft((prev) => ({ ...prev, [name]: value }));
  };

  const handleProfileSubmit = (event) => {
    event.preventDefault();
    const nextProfile = { ...profileDraft };
    setProfile(nextProfile);
    setProfileDraft(nextProfile);
    setIsProfileEditing(false);
    if (typeof window !== 'undefined') {
      window.localStorage.setItem(PROFILE_STORAGE_KEY, JSON.stringify(nextProfile));
    }
    toast({ type: 'success', message: 'Профиль обновлён' });
  };

  const beginAddressEdit = () => {
    setAddressDraft(address);
    setIsAddressEditing(true);
  };

  const cancelAddressEdit = () => {
    setAddressDraft(address);
    setIsAddressEditing(false);
  };

  const handleAddressDraftChange = (event) => {
    const { name, value } = event.target;
    setAddressDraft((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddressSubmit = (event) => {
    event.preventDefault();
    const nextAddress = { ...addressDraft };
    setAddress(nextAddress);
    setAddressDraft(nextAddress);
    setIsAddressEditing(false);
    if (typeof window !== 'undefined') {
      window.localStorage.setItem(ADDRESS_STORAGE_KEY, JSON.stringify(nextAddress));
    }
    toast({ type: 'success', message: 'Адрес сохранён' });
  };

  const beginSecurityEdit = () => {
    setSecurityDraft(buildSecurityDraft(security, profile));
    setIsSecurityEditing(true);
  };

  const cancelSecurityEdit = () => {
    setSecurityDraft(buildSecurityDraft(security, profile));
    setIsSecurityEditing(false);
  };

  const handleSecurityDraftChange = (event) => {
    const { name, value } = event.target;
    setSecurityDraft((prev) => ({ ...prev, [name]: value }));
  };

  const handleSecuritySubmit = (event) => {
    event.preventDefault();
    const nextSecurity = {
      email: securityDraft.email,
      phone: securityDraft.phone,
      isPasswordSet: securityDraft.password ? true : security.isPasswordSet
    };
    setSecurity(nextSecurity);
    if (typeof window !== 'undefined') {
      window.localStorage.setItem(SECURITY_STORAGE_KEY, JSON.stringify(nextSecurity));
    }
    setSecurityDraft(buildSecurityDraft(nextSecurity, profile));
    setIsSecurityEditing(false);
    toast({ type: 'success', message: 'Настройки безопасности обновлены' });
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
    toast({ type: 'success', message: `Товары из заказа ${order.orderNo} добавлены в корзину` });
  };

  const renderProfileTab = () => (
    <div className={styles['av-account-stack']}>
      <section
        className={styles['av-account-card']}
        data-mode={isProfileEditing ? 'edit' : 'view'}
      >
        <header className={styles['av-account-card-header']}>
          <div>
            <h2>Основная информация</h2>
            <p>Актуальные данные для приветствий и персонализации рекомендаций.</p>
          </div>
          {!isProfileEditing ? (
            <button type="button" className={styles['av-edit-btn']} onClick={beginProfileEdit}>
              Изменить
            </button>
          ) : null}
        </header>
        <div
          className={`${styles['av-account-card-body']} ${
            isProfileEditing ? styles['av-account-card-body-edit'] : styles['av-account-card-body-view']
          }`}
        >
          {isProfileEditing ? (
            <form className={styles['av-account-form']} onSubmit={handleProfileSubmit}>
              <div className={styles['av-account-grid']}>
                <label className={styles['av-account-field']} htmlFor="account-first-name">
                  <span>Имя</span>
                  <input
                    id="account-first-name"
                    name="firstName"
                    value={profileDraft.firstName}
                    onChange={handleProfileDraftChange}
                    placeholder="Анна"
                    autoComplete="given-name"
                  />
                </label>
                <label className={styles['av-account-field']} htmlFor="account-last-name">
                  <span>Фамилия</span>
                  <input
                    id="account-last-name"
                    name="lastName"
                    value={profileDraft.lastName}
                    onChange={handleProfileDraftChange}
                    placeholder="Иванова"
                    autoComplete="family-name"
                  />
                </label>
                <label className={styles['av-account-field']} htmlFor="account-email">
                  <span>Email</span>
                  <input
                    id="account-email"
                    name="email"
                    type="email"
                    value={profileDraft.email}
                    onChange={handleProfileDraftChange}
                    autoComplete="email"
                    disabled
                  />
                </label>
                <label className={styles['av-account-field']} htmlFor="account-phone">
                  <span>Телефон</span>
                  <input
                    id="account-phone"
                    name="phone"
                    type="tel"
                    value={profileDraft.phone}
                    onChange={handleProfileDraftChange}
                    placeholder="+7 (___) ___-__-__"
                    autoComplete="tel"
                  />
                </label>
              </div>
              <div className={styles['av-account-actions']}>
                <button type="submit" className={styles['av-account-save']}>
                  Сохранить
                </button>
                <button
                  type="button"
                  className={styles['av-account-cancel']}
                  onClick={cancelProfileEdit}
                >
                  Отмена
                </button>
              </div>
            </form>
          ) : (
            <div className={styles['av-account-info-grid']}>
              <div className={styles['av-account-info-item']}>
                <span className={styles['av-account-info-label']}>Имя</span>
                <span className={styles['av-account-info-value']}>
                  {profile.firstName || 'Не указано'}
                </span>
              </div>
              <div className={styles['av-account-info-item']}>
                <span className={styles['av-account-info-label']}>Фамилия</span>
                <span className={styles['av-account-info-value']}>
                  {profile.lastName || 'Не указано'}
                </span>
              </div>
              <div className={styles['av-account-info-item']}>
                <span className={styles['av-account-info-label']}>Email</span>
                <span className={styles['av-account-info-value']}>
                  {profile.email || 'Не указан'}
                </span>
              </div>
              <div className={styles['av-account-info-item']}>
                <span className={styles['av-account-info-label']}>Телефон</span>
                <span className={styles['av-account-info-value']}>
                  {profile.phone || 'Не указан'}
                </span>
              </div>
            </div>
          )}
        </div>
      </section>
    </div>
  );

  const renderAddressTab = () => (
    <div className={styles['av-account-stack']}>
      <section
        className={styles['av-account-card']}
        data-mode={isAddressEditing ? 'edit' : 'view'}
      >
        <header className={styles['av-account-card-header']}>
          <div>
            <h2>Адрес доставки</h2>
            <p>Используется для расчёта доставки и оформления заказа.</p>
          </div>
          {!isAddressEditing ? (
            <button type="button" className={styles['av-edit-btn']} onClick={beginAddressEdit}>
              Изменить
            </button>
          ) : null}
        </header>
        <div
          className={`${styles['av-account-card-body']} ${
            isAddressEditing ? styles['av-account-card-body-edit'] : styles['av-account-card-body-view']
          }`}
        >
          {isAddressEditing ? (
            <form className={styles['av-account-form']} onSubmit={handleAddressSubmit}>
              <div className={`${styles['av-account-grid']} ${styles['av-account-grid-single']}`}>
                <label className={styles['av-account-field']} htmlFor="account-country">
                  <span>Страна</span>
                  <input
                    id="account-country"
                    name="country"
                    value={addressDraft.country}
                    onChange={handleAddressDraftChange}
                    placeholder="Россия"
                    autoComplete="country-name"
                  />
                </label>
                <label className={styles['av-account-field']} htmlFor="account-city">
                  <span>Город</span>
                  <input
                    id="account-city"
                    name="city"
                    value={addressDraft.city}
                    onChange={handleAddressDraftChange}
                    placeholder="Москва"
                    autoComplete="address-level2"
                  />
                </label>
                <label className={styles['av-account-field']} htmlFor="account-street">
                  <span>Улица, дом, квартира</span>
                  <input
                    id="account-street"
                    name="street"
                    value={addressDraft.street}
                    onChange={handleAddressDraftChange}
                    placeholder="ул. Пушкинская, д. 10, кв. 5"
                    autoComplete="street-address"
                  />
                </label>
                <label className={styles['av-account-field']} htmlFor="account-postal">
                  <span>Индекс</span>
                  <input
                    id="account-postal"
                    name="postalCode"
                    value={addressDraft.postalCode}
                    onChange={handleAddressDraftChange}
                    placeholder="123456"
                    autoComplete="postal-code"
                  />
                </label>
              </div>
              <div className={styles['av-account-actions']}>
                <button type="submit" className={styles['av-account-save']}>
                  Сохранить
                </button>
                <button
                  type="button"
                  className={styles['av-account-cancel']}
                  onClick={cancelAddressEdit}
                >
                  Отмена
                </button>
              </div>
            </form>
          ) : (
            <div className={styles['av-account-info-grid']}>
              <div className={styles['av-account-info-item']}>
                <span className={styles['av-account-info-label']}>Страна</span>
                <span className={styles['av-account-info-value']}>
                  {address.country || 'Не указана'}
                </span>
              </div>
              <div className={styles['av-account-info-item']}>
                <span className={styles['av-account-info-label']}>Город</span>
                <span className={styles['av-account-info-value']}>
                  {address.city || 'Не указан'}
                </span>
              </div>
              <div className={styles['av-account-info-item']}>
                <span className={styles['av-account-info-label']}>Улица</span>
                <span className={styles['av-account-info-value']}>
                  {address.street || 'Не указана'}
                </span>
              </div>
              <div className={styles['av-account-info-item']}>
                <span className={styles['av-account-info-label']}>Индекс</span>
                <span className={styles['av-account-info-value']}>
                  {address.postalCode || 'Не указан'}
                </span>
              </div>
            </div>
          )}
        </div>
      </section>
    </div>
  );

  const renderOrdersTab = () => (
    <div className={styles['av-account-stack']}>
      <section className={styles['av-account-card']} data-mode="view">
        <header className={styles['av-account-card-header']}>
          <div>
            <h2>История покупок</h2>
            <p>Просматривайте завершённые заказы и повторяйте их в один клик.</p>
          </div>
        </header>
        <div className={`${styles['av-account-card-body']} ${styles['av-account-card-body-view']}`}>
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
                const statusClass = `${styles['av-account-status']} ${
                  styles[`av-account-status-${variant}`] || ''
                }`;
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
      </section>
    </div>
  );

  const renderSecurityTab = () => (
    <div className={styles['av-account-stack']}>
      <section
        className={styles['av-account-card']}
        data-mode={isSecurityEditing ? 'edit' : 'view'}
      >
        <header className={styles['av-account-card-header']}>
          <div>
            <h2>Безопасность</h2>
            <p>Обновляйте контактные данные для подтверждений и управляйте паролем.</p>
          </div>
          {!isSecurityEditing ? (
            <button type="button" className={styles['av-edit-btn']} onClick={beginSecurityEdit}>
              Изменить
            </button>
          ) : null}
        </header>
        <div
          className={`${styles['av-account-card-body']} ${
            isSecurityEditing ? styles['av-account-card-body-edit'] : styles['av-account-card-body-view']
          }`}
        >
          {isSecurityEditing ? (
            <form className={styles['av-account-form']} onSubmit={handleSecuritySubmit}>
              <div className={styles['av-account-grid']}>
                <label className={styles['av-account-field']} htmlFor="account-security-email">
                  <span>Новый email</span>
                  <input
                    id="account-security-email"
                    name="email"
                    type="email"
                    value={securityDraft.email}
                    onChange={handleSecurityDraftChange}
                    placeholder="new@example.com"
                    autoComplete="email"
                  />
                </label>
                <label className={styles['av-account-field']} htmlFor="account-security-phone">
                  <span>Новый телефон</span>
                  <input
                    id="account-security-phone"
                    name="phone"
                    type="tel"
                    value={securityDraft.phone}
                    onChange={handleSecurityDraftChange}
                    placeholder="+7 (___) ___-__-__"
                    autoComplete="tel"
                  />
                </label>
                <label className={styles['av-account-field']} htmlFor="account-security-password">
                  <span>Пароль</span>
                  <input
                    id="account-security-password"
                    name="password"
                    type="password"
                    value={securityDraft.password}
                    onChange={handleSecurityDraftChange}
                    placeholder="Новый пароль"
                    autoComplete="new-password"
                  />
                </label>
              </div>
              <div className={styles['av-account-actions']}>
                <button type="submit" className={styles['av-account-save']}>
                  Сохранить
                </button>
                <button
                  type="button"
                  className={styles['av-account-cancel']}
                  onClick={cancelSecurityEdit}
                >
                  Отмена
                </button>
              </div>
            </form>
          ) : (
            <div className={styles['av-account-info-grid']}>
              <div className={styles['av-account-info-item']}>
                <span className={styles['av-account-info-label']}>Email для уведомлений</span>
                <span className={styles['av-account-info-value']}>
                  {security.email || profile.email || 'Не указан'}
                </span>
              </div>
              <div className={styles['av-account-info-item']}>
                <span className={styles['av-account-info-label']}>Телефон</span>
                <span className={styles['av-account-info-value']}>
                  {security.phone || profile.phone || 'Не указан'}
                </span>
              </div>
              <div className={styles['av-account-info-item']}>
                <span className={styles['av-account-info-label']}>Пароль</span>
                <span className={styles['av-account-info-value']}>
                  {security.isPasswordSet ? 'Обновлён недавно' : 'Не задан'}
                </span>
              </div>
            </div>
          )}
        </div>
      </section>
    </div>
  );

  const renderFavoritesTab = () => (
    <div className={styles['av-account-stack']}>
      <section className={styles['av-account-card']} data-mode="view">
        <header className={styles['av-account-card-header']}>
          <div>
            <h2>Избранное</h2>
            <p>Сохраняйте любимые продукты и следите за их наличием.</p>
          </div>
        </header>
        <div className={`${styles['av-account-card-body']} ${styles['av-account-card-body-view']}`}>
          {favoriteProducts.length > 0 ? (
            <div className={styles['av-account-favorites-grid']}>
              {favoriteProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <div className={styles['av-account-empty']}>
              <p>
                Вы ещё не добавили товары в избранное. Сохраняйте понравившиеся позиции и возвращайтесь к
                ним позже.
              </p>
              <Link href="/catalog" className={styles['av-account-empty-link']}>
                Перейти в каталог
              </Link>
            </div>
          )}
        </div>
      </section>
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

  if (!isAuthenticated) {
    return null;
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
