const ADDRESS_STORAGE_KEY = 'avenue-account-addresses';

const fallback = { addresses: [], defaultId: null };

const normalizeAddress = (address, index) => ({
  id: address.id || `address-${Date.now()}-${index}`,
  label: address.label || 'Адрес',
  country: address.country || '',
  city: address.city || '',
  street: address.street || '',
  postalCode: address.postalCode || '',
  isDefault: Boolean(address.isDefault)
});

export const readAddresses = () => {
  if (typeof window === 'undefined') {
    return fallback;
  }
  const stored = window.localStorage.getItem(ADDRESS_STORAGE_KEY);
  if (!stored) {
    return fallback;
  }
  try {
    const parsed = JSON.parse(stored);
    if (Array.isArray(parsed)) {
      const addresses = parsed.map(normalizeAddress);
      const defaultId = addresses.find((item) => item.isDefault)?.id || addresses[0]?.id || null;
      return {
        addresses: addresses.map((item) => ({ ...item, isDefault: item.id === defaultId })),
        defaultId
      };
    }
    if (parsed && Array.isArray(parsed.addresses)) {
      const addresses = parsed.addresses.map(normalizeAddress);
      const defaultId = parsed.defaultId || addresses.find((item) => item.isDefault)?.id || addresses[0]?.id || null;
      return {
        addresses: addresses.map((item) => ({ ...item, isDefault: item.id === defaultId })),
        defaultId
      };
    }
    if (parsed && typeof parsed === 'object') {
      const legacyAddress = normalizeAddress(parsed, 0);
      return {
        addresses: [{ ...legacyAddress, isDefault: true }],
        defaultId: legacyAddress.id
      };
    }
  } catch (error) {
    console.warn('Ошибка чтения адресов', error);
  }
  return fallback;
};

export const writeAddresses = (addresses) => {
  if (typeof window === 'undefined') {
    return;
  }
  const normalized = addresses.map((item, index) => normalizeAddress(item, index));
  const defaultId = normalized.find((item) => item.isDefault)?.id || normalized[0]?.id || null;
  const payload = {
    addresses: normalized.map((item) => ({ ...item, isDefault: item.id === defaultId })),
    defaultId
  };
  window.localStorage.setItem(ADDRESS_STORAGE_KEY, JSON.stringify(payload));
};

export const clearAddresses = () => {
  if (typeof window === 'undefined') {
    return;
  }
  window.localStorage.removeItem(ADDRESS_STORAGE_KEY);
};

export const ensureDefaultAddress = (addresses) => {
  if (!Array.isArray(addresses) || addresses.length === 0) {
    return { addresses: [], defaultId: null };
  }
  const currentDefault = addresses.find((item) => item.isDefault);
  if (currentDefault) {
    return {
      addresses: addresses.map((item) => ({ ...item, isDefault: item.id === currentDefault.id })),
      defaultId: currentDefault.id
    };
  }
  const [first, ...rest] = addresses;
  return {
    addresses: [{ ...first, isDefault: true }, ...rest.map((item) => ({ ...item, isDefault: false }))],
    defaultId: first.id
  };
};

export const ADDRESS_KEY = ADDRESS_STORAGE_KEY;
