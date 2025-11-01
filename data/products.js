export const categories = [
  {
    id: 'nail-polish',
    name: 'Лаки для ногтей',
    description: 'Палитра трендовых оттенков с ухаживающими компонентами.'
  },
  {
    id: 'manicure-tools',
    name: 'Техника для маникюра',
    description: 'Устройства и аксессуары для профессионального ухода за руками.'
  }
];

export const products = [
  {
    id: 'np-rose-veil',
    category: 'nail-polish',
    name: 'Rose Veil',
    price: 890,
    description:
      'Лак с шелковистым финишем и витаминным комплексом для укрепления ногтей.',
    image: '/images/nail-polish-rose-veil.svg'
  },
  {
    id: 'np-sunset-glow',
    category: 'nail-polish',
    name: 'Sunset Glow',
    price: 920,
    description:
      'Теплый персиковый оттенок с ультратонким шиммером для сияния.',
    image: '/images/nail-polish-sunset-glow.svg'
  },
  {
    id: 'np-powder-blush',
    category: 'nail-polish',
    name: 'Powder Blush',
    price: 870,
    description:
      'Мягкий розовый лак, который ложится ровно и держится до 7 дней.',
    image: '/images/nail-polish-powder-blush.svg'
  },
  {
    id: 'mt-uv-lamp',
    category: 'manicure-tools',
    name: 'UV Soft Lamp',
    price: 3490,
    description:
      'Компактная UV-лампа с двумя режимами мощности и сенсорным управлением.',
    image: '/images/manicure-uv-lamp.svg'
  },
  {
    id: 'mt-drill',
    category: 'manicure-tools',
    name: 'Smooth Drill Pro',
    price: 5290,
    description:
      'Электрический аппарат для маникюра с набором насадок и регулировкой скорости.',
    image: '/images/manicure-drill.svg'
  },
  {
    id: 'mt-sterilizer',
    category: 'manicure-tools',
    name: 'Pure Care Sterilizer',
    price: 2790,
    description:
      'Стерилизатор инструментов с кварцевыми шариками для надежной дезинфекции.',
    image: '/images/manicure-sterilizer.svg'
  }
];

export const getProductsByCategory = (categoryId) =>
  products.filter((product) => product.category === categoryId);

export const getProductById = (id) =>
  products.find((product) => product.id === id);
