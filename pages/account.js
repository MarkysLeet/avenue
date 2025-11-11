import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/router';
import Layout from '../components/Layout';
import { useAuth } from '../contexts/AuthContext';
import { useCart } from '../contexts/CartContext';
import { useToast } from '../contexts/ToastContext';
import { products } from '../data/products';
import {
  ensureDefaultAddress,
  readAddresses,
  writeAddresses
} from '../utils/addressStorage';
import styles from '../styles/AccountPage.module.css';

const tabs = [
  { id: 'profile', label: 'Профиль' },
  { id: 'address', label: 'Адрес доставки' },
  { id: 'orders', label: 'История покупок' },
  { id: 'security', label: 'Безопасность' }
];

const PROFILE_STORAGE_KEY = 'avenue-account-profile';
const SECURITY_STORAGE_KEY = 'avenue-account-security';

const defaultProfile = {
  firstName: '',
  lastName: '',
  phone: ''
};

const defaultSecurity = {
  email: '',
  backupPhone: '',
  passwordUpdatedAt: ''
};

const createEmptyAddress = () => ({
  id: '',
  label: '',
  country: '',
  city: '',
  street: '',
  postalCode: '',
  isDefault: false
});

const mockOrders = [
  {
    orderNo: 'AV-2027',
    date: '12.08.2024',
    status: 'В обработке',
    total: 2680,
    items: [
      { productId: 'klassicheskaya-seriya-gel-lakov-01', quantity: 1 },
      { productId: 'klassicheskaya-seriya-gel-lakov-02', quantity: 1 }
    ]
  },
  {
    orderNo: 'AV-1998',
    date: '02.07.2024',
    status: 'Отправлен',
    total: 8140,
    items: [
      { productId: 'frezer-dlya-manikyura', quantity: 1 },
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
  const { push, replace, query } = router;
  const { user, isAuthenticated, updateProfile, changeEmail, changePassword } = useAuth();
  const { addToCart } = useCart();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('profile');
  const tabRefs = useRef([]);
  const guardRef = useRef(false);
  const reorderTimerRef = useRef(null);
  const hydrationRef = useRef(false);

  const [profile, setProfile] = useState(defaultProfile);
  const [profileDraft, setProfileDraft] = useState(defaultProfile);
  const [profileEditing, setProfileEditing] = useState(null);

  const [security, setSecurity] = useState(defaultSecurity);
  const [securityDraft, setSecurityDraft] = useState({
    email: '',
    backupPhone: '',
    oldPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [securityEditing, setSecurityEditing] = useState(null);
  const [securityError, setSecurityError] = useState('');

  const [addresses, setAddresses] = useState([]);
  const [addressDraft, setAddressDraft] = useState(createEmptyAddress());
  const [editingAddressId, setEditingAddressId] = useState(null);
  const [isAddingAddress, setIsAddingAddress] = useState(false);

  const [reorderedOrder, setReorderedOrder] = useState(null);

  useEffect(() => {
    if (!isAuthenticated && !guardRef.current) {
      guardRef.current = true;
      toast({
        type: 'warning',
        message: 'Требуется авторизация для доступа к личному кабинету',
        actionLabel: 'Войти',
        onAction: () => push('/auth/login?returnTo=/account')
      });
      replace('/auth/login?returnTo=/account');
    }
  }, [isAuthenticated, push, replace, toast]);

  useEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }
    try {
      const storedProfile = window.localStorage.getItem(PROFILE_STORAGE_KEY);
      if (storedProfile) {
        const parsed = JSON.parse(storedProfile);
        setProfile({ ...defaultProfile, ...parsed });
        setProfileDraft({ ...defaultProfile, ...parsed });
      }
    } catch (error) {
      console.warn('Ошибка чтения профиля', error);
    }
    try {
      const storedSecurity = window.localStorage.getItem(SECURITY_STORAGE_KEY);
      if (storedSecurity) {
        const parsed = JSON.parse(storedSecurity);
        setSecurity({ ...defaultSecurity, ...parsed });
        setSecurityDraft((prev) => ({ ...prev, ...parsed }));
      }
    } catch (error) {
      console.warn('Ошибка чтения настроек безопасности', error);
    }
    const storedAddresses = ensureDefaultAddress(readAddresses().addresses);
    setAddresses(storedAddresses.addresses);
    hydrationRef.current = true;
  }, []);

  useEffect(() => {
    if (!hydrationRef.current) {
      return;
    }
    try {
      window.localStorage.setItem(PROFILE_STORAGE_KEY, JSON.stringify(profile));
    } catch (error) {
      console.warn('Ошибка сохранения профиля', error);
    }
  }, [profile]);

  useEffect(() => {
    if (!hydrationRef.current) {
      return;
    }
    try {
      window.localStorage.setItem(
        SECURITY_STORAGE_KEY,
        JSON.stringify({
          email: security.email,
          backupPhone: security.backupPhone,
          passwordUpdatedAt: security.passwordUpdatedAt
        })
      );
    } catch (error) {
      console.warn('Ошибка сохранения настроек безопасности', error);
    }
  }, [security.email, security.backupPhone, security.passwordUpdatedAt]);

  useEffect(() => {
    if (!hydrationRef.current) {
      return;
    }
    writeAddresses(addresses);
  }, [addresses]);

  useEffect(() => {
    if (!user) {
      return;
    }
    setProfile((prev) => {
      const next = { ...prev };
      if (!next.firstName) {
        if (user.firstName) {
          next.firstName = user.firstName;
        } else if (user.name) {
          next.firstName = user.name.split(' ')[0];
        }
      }
      if (!next.lastName && user.lastName) {
        next.lastName = user.lastName;
      } else if (!next.lastName && user.name && user.name.includes(' ')) {
        const [, ...rest] = user.name.split(' ');
        next.lastName = rest.join(' ');
      }
      if (!next.phone && user.phone) {
        next.phone = user.phone;
      }
      return next;
    });
    setProfileDraft((prev) => ({
      ...prev,
      firstName: prev.firstName || user.firstName || (user.name ? user.name.split(' ')[0] : ''),
      lastName: prev.lastName || user.lastName || '',
      phone: prev.phone || user.phone || ''
    }));
    setSecurity((prev) => ({
      ...prev,
      email: prev.email || user.email || '',
      backupPhone: prev.backupPhone || user.phone || ''
    }));
    setSecurityDraft((prev) => ({
      ...prev,
      email: prev.email || user.email || '',
      backupPhone: prev.backupPhone || user.phone || ''
    }));
  }, [user]);

  useEffect(() => {
    const { tab } = query;
    if (typeof tab === 'string' && tabs.some((item) => item.id === tab)) {
      setActiveTab(tab);
    }
  }, [query]);

  useEffect(
    () => () => {
      if (reorderTimerRef.current) {
        clearTimeout(reorderTimerRef.current);
      }
    },
    []
  );

  const handleTabKeyDown = (event, index) => {
    if (event.key !== 'ArrowRight' && event.key !== 'ArrowLeft') {
      return;
    }
    event.preventDefault();
    const direction = event.key === 'ArrowRight' ? 1 : -1;
    let nextIndex = (index + direction + tabs.length) % tabs.length;
    const nextTab = tabs[nextIndex];
    setActiveTab(nextTab.id);
    router.replace(
      {
        pathname: '/account',
        query: nextTab.id === 'profile' ? {} : { tab: nextTab.id }
      },
      undefined,
      { shallow: true }
    );
    if (tabRefs.current[nextIndex]) {
      tabRefs.current[nextIndex].focus();
    }
  };

  const handleTabClick = (tab) => {
    setActiveTab(tab.id);
    router.replace(
      {
        pathname: '/account',
        query: tab.id === 'profile' ? {} : { tab: tab.id }
      },
      undefined,
      { shallow: true }
    );
  };

  const beginProfileEdit = (field) => {
    setProfileDraft(profile);
    setProfileEditing(field);
  };

  const cancelProfileEdit = () => {
    setProfileDraft(profile);
    setProfileEditing(null);
  };

  const handleProfileDraftChange = (event) => {
    const { name, value } = event.target;
    setProfileDraft((prev) => ({ ...prev, [name]: value }));
  };

  const handleProfileSubmit = (event) => {
    event.preventDefault();
    if (!profileEditing) {
      return;
    }
    try {
      if (profileEditing === 'name') {
        const updates = {
          firstName: profileDraft.firstName.trim(),
          lastName: profileDraft.lastName.trim()
        };
        const displayName = [updates.firstName, updates.lastName].filter(Boolean).join(' ').trim();
        updateProfile({
          ...updates,
          name: displayName || user?.name || '',
          phone: profile.phone
        });
        setProfile((prev) => ({ ...prev, ...updates }));
        toast({ type: 'success', message: 'Данные профиля обновлены' });
      } else if (profileEditing === 'phone') {
        const updates = { phone: profileDraft.phone.trim() };
        const displayName = [profile.firstName, profile.lastName].filter(Boolean).join(' ').trim();
        updateProfile({
          ...updates,
          name: displayName || user?.name || '',
          firstName: profile.firstName,
          lastName: profile.lastName
        });
        setProfile((prev) => ({ ...prev, ...updates }));
        setSecurity((prev) => ({ ...prev, backupPhone: updates.phone }));
        setSecurityDraft((prev) => ({ ...prev, backupPhone: updates.phone }));
        toast({ type: 'success', message: 'Телефон обновлён' });
      }
      setProfileEditing(null);
    } catch (error) {
      toast({ type: 'error', message: error.message });
    }
  };

  const beginSecurityEdit = (field) => {
    setSecurityDraft((prev) => ({
      ...prev,
      email: security.email,
      backupPhone: security.backupPhone,
      oldPassword: '',
      newPassword: '',
      confirmPassword: ''
    }));
    setSecurityError('');
    setSecurityEditing(field);
  };

  const cancelSecurityEdit = () => {
    setSecurityError('');
    setSecurityEditing(null);
    setSecurityDraft((prev) => ({
      ...prev,
      email: security.email,
      backupPhone: security.backupPhone,
      oldPassword: '',
      newPassword: '',
      confirmPassword: ''
    }));
  };

  const handleSecurityDraftChange = (event) => {
    const { name, value } = event.target;
    setSecurityDraft((prev) => ({ ...prev, [name]: value }));
  };

  const handleSecuritySubmit = (event) => {
    event.preventDefault();
    if (!securityEditing) {
      return;
    }
    try {
      if (securityEditing === 'email') {
        const updated = changeEmail(securityDraft.email.trim());
        setSecurity((prev) => ({ ...prev, email: updated.email }));
        toast({ type: 'success', message: 'Email обновлён' });
      } else if (securityEditing === 'backupPhone') {
        setSecurity((prev) => ({ ...prev, backupPhone: securityDraft.backupPhone.trim() }));
        toast({ type: 'success', message: 'Телефон для восстановления обновлён' });
      } else if (securityEditing === 'password') {
        if (securityDraft.newPassword !== securityDraft.confirmPassword) {
          setSecurityError('Подтверждение пароля не совпадает');
          return;
        }
        changePassword({
          oldPassword: securityDraft.oldPassword,
          newPassword: securityDraft.newPassword
        });
        setSecurity((prev) => ({
          ...prev,
          passwordUpdatedAt: new Date().toLocaleDateString('ru-RU')
        }));
        toast({ type: 'success', message: 'Пароль успешно изменён' });
      }
      setSecurityEditing(null);
      setSecurityError('');
    } catch (error) {
      setSecurityError(error.message);
    }
  };

  const beginAddAddress = () => {
    setAddressDraft(createEmptyAddress());
    setIsAddingAddress(true);
    setEditingAddressId(null);
  };

  const beginEditAddress = (address) => {
    setAddressDraft({ ...address });
    setEditingAddressId(address.id);
    setIsAddingAddress(false);
  };

  const cancelAddressEdit = () => {
    setAddressDraft(createEmptyAddress());
    setEditingAddressId(null);
    setIsAddingAddress(false);
  };

  const handleAddressDraftChange = (event) => {
    const { name, value } = event.target;
    setAddressDraft((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddressSubmit = (event) => {
    event.preventDefault();
    const base = {
      ...addressDraft,
      label: addressDraft.label.trim() || `Адрес ${addresses.length + 1}`,
      country: addressDraft.country.trim(),
      city: addressDraft.city.trim(),
      street: addressDraft.street.trim(),
      postalCode: addressDraft.postalCode.trim()
    };
    let updatedList = [];
    if (editingAddressId) {
      updatedList = addresses.map((item) =>
        item.id === editingAddressId ? { ...item, ...base, id: editingAddressId } : item
      );
      toast({ type: 'success', message: 'Адрес обновлён' });
    } else {
      const newId = `address-${Date.now()}`;
      const nextAddress = { ...base, id: newId, isDefault: addresses.length === 0 };
      updatedList = [...addresses, nextAddress];
      toast({ type: 'success', message: 'Адрес добавлен' });
    }
    const normalized = ensureDefaultAddress(updatedList);
    setAddresses(normalized.addresses);
    setAddressDraft(createEmptyAddress());
    setEditingAddressId(null);
    setIsAddingAddress(false);
  };

  const handleMakeDefaultAddress = (id) => {
    const normalized = ensureDefaultAddress(
      addresses.map((item) => ({ ...item, isDefault: item.id === id }))
    );
    setAddresses(normalized.addresses);
    toast({ type: 'success', message: 'Адрес по умолчанию обновлён' });
  };

  const handleDeleteAddress = (id) => {
    const filtered = addresses.filter((item) => item.id !== id);
    const normalized = ensureDefaultAddress(filtered);
    setAddresses(normalized.addresses);
    toast({ type: 'success', message: 'Адрес удалён' });
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
    }, 1200);
    toast({ type: 'success', message: `Товары заказа ${order.orderNo} добавлены в корзину` });
  };

  const renderProfile = () => (
    <div className={styles['av-account-card']}>
      <div className={styles['av-account-card-header']}>
        <div>
          <h2>Основная информация</h2>
          <p>Здесь вы управляете личными данными, которые видны в заказах.</p>
        </div>
      </div>
      <div className={styles['av-account-card-body']}>
        <div className={styles['av-account-info-grid']}>
          <div className={styles['av-field']}>
            <div className={styles['av-field-view']}>
              <div>
                <p className={styles['av-account-info-label']}>Имя и фамилия</p>
                <p className={styles['av-account-info-value']}>
                  {[profile.firstName, profile.lastName].filter(Boolean).join(' ') || 'Не указано'}
                </p>
              </div>
              <button
                type="button"
                className={styles['av-field-edit']}
                onClick={() => beginProfileEdit('name')}
              >
                Изменить
              </button>
            </div>
            {profileEditing === 'name' ? (
              <form className={styles['av-inline-form']} onSubmit={handleProfileSubmit}>
                <div className={styles['av-account-grid']}>
                  <label className={styles['av-account-field']}>
                    Имя
                    <input
                      name="firstName"
                      value={profileDraft.firstName}
                      onChange={handleProfileDraftChange}
                      placeholder="Имя"
                    />
                  </label>
                  <label className={styles['av-account-field']}>
                    Фамилия
                    <input
                      name="lastName"
                      value={profileDraft.lastName}
                      onChange={handleProfileDraftChange}
                      placeholder="Фамилия"
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
            ) : null}
          </div>
          <div className={styles['av-field']}>
            <div className={styles['av-field-view']}>
              <div>
                <p className={styles['av-account-info-label']}>Телефон</p>
                <p className={styles['av-account-info-value']}>
                  {profile.phone || 'Не указан'}
                </p>
              </div>
              <button
                type="button"
                className={styles['av-field-edit']}
                onClick={() => beginProfileEdit('phone')}
              >
                Изменить
              </button>
            </div>
            {profileEditing === 'phone' ? (
              <form className={styles['av-inline-form']} onSubmit={handleProfileSubmit}>
                <label className={styles['av-account-field']}>
                  Телефон
                  <input
                    name="phone"
                    value={profileDraft.phone}
                    onChange={handleProfileDraftChange}
                    placeholder="+7 (___) ___-__-__"
                  />
                </label>
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
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );

  const renderAddresses = () => (
    <div className={styles['av-account-stack']}>
      <div className={styles['av-account-card']}>
        <div className={styles['av-account-card-header']}>
          <div>
            <h2>Сохранённые адреса</h2>
            <p>Управляйте вариантами доставки, выбирайте основной адрес.</p>
          </div>
          <button type="button" className={styles['av-edit-btn']} onClick={beginAddAddress}>
            Добавить адрес
          </button>
        </div>
        <div className={styles['av-account-card-body']}>
          {addresses.length === 0 ? (
            <div className={styles['av-account-empty']}>
              <p>Пока нет сохранённых адресов. Добавьте первый, чтобы ускорить оформление.</p>
              <button type="button" className={styles['av-account-save']} onClick={beginAddAddress}>
                Добавить адрес
              </button>
            </div>
          ) : (
            <div className={styles['av-address-grid']}>
              {addresses.map((address) => (
                <div key={address.id} className={styles['av-address-card']}>
                  <div className={styles['av-address-head']}>
                    <div>
                      <p className={styles['av-account-info-label']}>{address.label}</p>
                      <p className={styles['av-account-info-value']}>
                        {[address.country, address.city, address.street].filter(Boolean).join(', ') ||
                          'Не заполнено'}
                      </p>
                    </div>
                    {address.isDefault ? (
                      <span className={styles['av-address-badge']}>По умолчанию</span>
                    ) : null}
                  </div>
                  <div className={styles['av-address-body']}>
                    <p className={styles['av-address-line']}>
                      <span>Страна:</span> {address.country || '—'}
                    </p>
                    <p className={styles['av-address-line']}>
                      <span>Город:</span> {address.city || '—'}
                    </p>
                    <p className={styles['av-address-line']}>
                      <span>Улица / дом / кв.:</span> {address.street || '—'}
                    </p>
                    <p className={styles['av-address-line']}>
                      <span>Индекс:</span> {address.postalCode || '—'}
                    </p>
                  </div>
                  <div className={styles['av-address-actions']}>
                    {!address.isDefault ? (
                      <button
                        type="button"
                        className={styles['av-account-save']}
                        onClick={() => handleMakeDefaultAddress(address.id)}
                      >
                        Сделать основным
                      </button>
                    ) : null}
                    <button
                      type="button"
                      className={styles['av-account-cancel']}
                      onClick={() => beginEditAddress(address)}
                    >
                      Редактировать
                    </button>
                    <button
                      type="button"
                      className={styles['av-address-remove']}
                      onClick={() => handleDeleteAddress(address.id)}
                    >
                      Удалить
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      {(isAddingAddress || editingAddressId) && (
        <div className={styles['av-account-card']}>
          <div className={styles['av-account-card-header']}>
            <div>
              <h2>{editingAddressId ? 'Редактирование адреса' : 'Новый адрес'}</h2>
              <p>Заполните поля и сохраните, чтобы адрес появился в списке.</p>
            </div>
          </div>
          <form className={styles['av-account-card-body']} onSubmit={handleAddressSubmit}>
            <div className={styles['av-account-grid']}>
              <label className={styles['av-account-field']}>
                Название адреса
                <input
                  name="label"
                  value={addressDraft.label}
                  onChange={handleAddressDraftChange}
                  placeholder="Например, Дом или Салон"
                  required
                />
              </label>
              <label className={styles['av-account-field']}>
                Страна
                <input
                  name="country"
                  value={addressDraft.country}
                  onChange={handleAddressDraftChange}
                  placeholder="Россия"
                />
              </label>
              <label className={styles['av-account-field']}>
                Город
                <input
                  name="city"
                  value={addressDraft.city}
                  onChange={handleAddressDraftChange}
                  placeholder="Москва"
                />
              </label>
              <label className={styles['av-account-field']}>
                Индекс
                <input
                  name="postalCode"
                  value={addressDraft.postalCode}
                  onChange={handleAddressDraftChange}
                  placeholder="123456"
                />
              </label>
            </div>
            <label className={styles['av-account-field']}>
              Улица, дом, квартира
              <input
                name="street"
                value={addressDraft.street}
                onChange={handleAddressDraftChange}
                placeholder="Укажите полный адрес"
              />
            </label>
            <div className={styles['av-account-actions']}>
              <button type="submit" className={styles['av-account-save']}>
                Сохранить
              </button>
              <button type="button" className={styles['av-account-cancel']} onClick={cancelAddressEdit}>
                Отмена
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );

  const renderOrders = () => (
    <div className={styles['av-account-card']}>
      <div className={styles['av-account-card-header']}>
        <div>
          <h2>История покупок</h2>
          <p>Следите за статусами и повторяйте понравившиеся заказы.</p>
        </div>
      </div>
      <div className={styles['av-account-card-body']}>
        <table className={styles['av-account-orders']}>
          <thead>
            <tr>
              <th>Номер</th>
              <th>Дата</th>
              <th>Статус</th>
              <th>Сумма</th>
              <th aria-hidden="true" />
            </tr>
          </thead>
          <tbody>
            {mockOrders.map((order) => (
              <tr
                key={order.orderNo}
                className={`${styles['av-account-order-row']} ${
                  reorderedOrder === order.orderNo ? styles['av-account-order-row-active'] : ''
                }`}
              >
                <td>{order.orderNo}</td>
                <td>{order.date}</td>
                <td>
                  <span className={`${styles['av-account-status']} ${styles[`av-account-status-${statusVariants[order.status]}`]}`}>
                    {order.status}
                  </span>
                </td>
                <td>{order.total.toLocaleString()} ₺</td>
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
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  const renderSecurity = () => (
    <div className={styles['av-account-stack']}>
      <div className={styles['av-account-card']}>
        <div className={styles['av-account-card-header']}>
          <div>
            <h2>Контакты для входа</h2>
            <p>Управляйте email и резервным телефоном для восстановления доступа.</p>
          </div>
        </div>
        <div className={styles['av-account-card-body']}>
          <div className={styles['av-field']}>
            <div className={styles['av-field-view']}>
              <div>
                <p className={styles['av-account-info-label']}>Email</p>
                <p className={styles['av-account-info-value']}>{security.email || 'Не указан'}</p>
              </div>
              <button
                type="button"
                className={styles['av-field-edit']}
                onClick={() => beginSecurityEdit('email')}
              >
                Изменить
              </button>
            </div>
            {securityEditing === 'email' ? (
              <form className={styles['av-inline-form']} onSubmit={handleSecuritySubmit}>
                <label className={styles['av-account-field']}>
                  Новый email
                  <input
                    type="email"
                    name="email"
                    value={securityDraft.email}
                    onChange={handleSecurityDraftChange}
                    required
                  />
                </label>
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
                {securityError ? <p className={styles['av-account-feedback']}>{securityError}</p> : null}
              </form>
            ) : null}
          </div>
          <div className={styles['av-field']}>
            <div className={styles['av-field-view']}>
              <div>
                <p className={styles['av-account-info-label']}>Телефон для восстановления</p>
                <p className={styles['av-account-info-value']}>
                  {security.backupPhone || 'Не указан'}
                </p>
              </div>
              <button
                type="button"
                className={styles['av-field-edit']}
                onClick={() => beginSecurityEdit('backupPhone')}
              >
                Изменить
              </button>
            </div>
            {securityEditing === 'backupPhone' ? (
              <form className={styles['av-inline-form']} onSubmit={handleSecuritySubmit}>
                <label className={styles['av-account-field']}>
                  Телефон
                  <input
                    type="tel"
                    name="backupPhone"
                    value={securityDraft.backupPhone}
                    onChange={handleSecurityDraftChange}
                  />
                </label>
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
                {securityError ? <p className={styles['av-account-feedback']}>{securityError}</p> : null}
              </form>
            ) : null}
          </div>
        </div>
      </div>
      <div className={styles['av-account-card']}>
        <div className={styles['av-account-card-header']}>
          <div>
            <h2>Пароль</h2>
            <p>Измените пароль для входа. После сохранения появится отметка о последнем обновлении.</p>
          </div>
        </div>
        <div className={styles['av-account-card-body']}>
          <div className={styles['av-field']}>
            <div className={styles['av-field-view']}>
              <div>
                <p className={styles['av-account-info-label']}>Статус</p>
                <p className={styles['av-account-info-value']}>
                  {security.passwordUpdatedAt
                    ? `Обновлён ${security.passwordUpdatedAt}`
                    : 'Ещё не обновлялся'}
                </p>
              </div>
              <button
                type="button"
                className={styles['av-field-edit']}
                onClick={() => beginSecurityEdit('password')}
              >
                Изменить
              </button>
            </div>
            {securityEditing === 'password' ? (
              <form className={styles['av-inline-form']} onSubmit={handleSecuritySubmit}>
                <div className={styles['av-account-grid']}>
                  <label className={styles['av-account-field']}>
                    Текущий пароль
                    <input
                      type="password"
                      name="oldPassword"
                      value={securityDraft.oldPassword}
                      onChange={handleSecurityDraftChange}
                      required
                    />
                  </label>
                  <label className={styles['av-account-field']}>
                    Новый пароль
                    <input
                      type="password"
                      name="newPassword"
                      value={securityDraft.newPassword}
                      onChange={handleSecurityDraftChange}
                      required
                    />
                  </label>
                  <label className={`${styles['av-account-field']} ${styles['av-account-field-span']}`}>
                    Подтверждение
                    <input
                      type="password"
                      name="confirmPassword"
                      value={securityDraft.confirmPassword}
                      onChange={handleSecurityDraftChange}
                      required
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
                {securityError ? <p className={styles['av-account-feedback']}>{securityError}</p> : null}
              </form>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );

  if (!isAuthenticated) {
    return null;
  }

  return (
    <Layout title="Личный кабинет — Avenue Professional">
      <section className={styles['av-account-section']}>
        <header className={styles['av-account-header']}>
          <h1>Личный кабинет</h1>
          <p>Управляйте профилем, заказами и настройками безопасности в одном месте.</p>
        </header>
        <div role="tablist" className={styles['av-account-tabs']}>
          {tabs.map((tab, index) => (
            <button
              key={tab.id}
              role="tab"
              ref={(element) => {
                tabRefs.current[index] = element;
              }}
              aria-selected={activeTab === tab.id}
              aria-controls={`panel-${tab.id}`}
              className={
                activeTab === tab.id
                  ? `${styles['av-account-tab']} ${styles['av-account-tab-active']}`
                  : styles['av-account-tab']
              }
              onClick={() => handleTabClick(tab)}
              onKeyDown={(event) => handleTabKeyDown(event, index)}
            >
              {tab.label}
            </button>
          ))}
        </div>
        <div
          id={`panel-${activeTab}`}
          role="tabpanel"
          aria-labelledby={activeTab}
          className={styles['av-account-panel']}
        >
          {activeTab === 'profile' && renderProfile()}
          {activeTab === 'address' && renderAddresses()}
          {activeTab === 'orders' && renderOrders()}
          {activeTab === 'security' && renderSecurity()}
        </div>
      </section>
    </Layout>
  );
};

export default AccountPage;
