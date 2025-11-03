import categoriesData from './categories.json';

export const categories = categoriesData.map((category) => ({
  id: category.slug,
  name: category.title,
  description: category.description,
  badge: category.badge || null
}));

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
  },
  {
    id: 'gel-sculptor',
    category: 'geli',
    name: 'Sculptor Gel',
    price: 1350,
    description:
      'Однофазный гель средней густоты для архитектуры ногтя и укрепления без излишнего объема.',
    image: '/images/nail-polish-rose-veil.svg'
  },
  {
    id: 'gel-camouflage',
    category: 'geli',
    name: 'Camouflage Nude Gel',
    price: 1420,
    description:
      'Камуфлирующий гель с тонким розовым подтоном для создания естественной основы.',
    image: '/images/nail-polish-powder-blush.svg'
  },
  {
    id: 'poly-flex',
    category: 'polygeli',
    name: 'PolyFlex Blush',
    price: 1680,
    description:
      'Полигель с кремовой текстурой, легко опиливается и держит форму даже при длинных ногтях.',
    image: '/images/nail-polish-sunset-glow.svg'
  },
  {
    id: 'poly-clear',
    category: 'polygeli',
    name: 'PolyFlex Crystal',
    price: 1650,
    description:
      'Прозрачный полигель для укрепления и укрепления верхних форм, идеально подходит для инкрустаций.',
    image: '/images/manicure-uv-lamp.svg'
  },
  {
    id: 'consumable-wipes',
    category: 'rashodniki',
    name: 'Lint-Free Wipes 200',
    price: 390,
    description:
      'Безворсовые салфетки для обезжиривания и снятия липкого слоя, в упаковке 200 шт.',
    image: '/images/manicure-sterilizer.svg'
  },
  {
    id: 'consumable-forms',
    category: 'rashodniki',
    name: 'Sculpt Forms 100',
    price: 450,
    description:
      'Жесткие нижние формы с направляющими для точной архитектуры и стабильного носки.',
    image: '/images/manicure-drill.svg'
  }
];

export const getProductsByCategory = (categoryId) =>
  products.filter((product) => product.category === categoryId);

export const getProductById = (id) => products.find((product) => product.id === id);
