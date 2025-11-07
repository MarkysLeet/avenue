import categoriesData from './categories.json';

export const categories = categoriesData.map((category) => ({
  id: category.slug,
  name: category.title,
  description: category.description,
  badge: category.badge || null
}));

export const products = [
  {
    id: 'klassicheskaya-seriya-gel-lakov-01',
    category: 'nail-polish',
    name: 'Классическая серия гель-лаков 01',
    price: 315,
    description:
      'Плотный пигмент, ровное покрытие с первого слоя. Подходит для базы и выравнивания.',
    image: 'https://avenueprofessional.net/assets/images/1755206610IMG_3588.jpeg'
  },
  {
    id: 'klassicheskaya-seriya-gel-lakov-02',
    category: 'nail-polish',
    name: 'Классическая серия гель-лаков 02',
    price: 315,
    description:
      'Универсальный оттенок на каждый день: самовыравнивание, стойкость до 3–4 недель.',
    image: 'https://avenueprofessional.net/assets/images/17552588807DC9983D-E3DA-4EC2-A79F-ACFC85688F7C.jpeg'
  },
  {
    id: 'klassicheskaya-seriya-gel-lakov-04',
    category: 'nail-polish',
    name: 'Классическая серия гель-лаков 04',
    price: 315,
    description:
      'Глубокий насыщенный цвет, без полос и проплешин. Для профессионального и домашнего использования.',
    image: 'https://avenueprofessional.net/assets/images/1754736830IMG_2338.jpeg'
  },
  {
    id: 'frezer-dlya-manikyura',
    category: 'manicure-tools',
    name: 'Фрезер для маникюра',
    price: 3500,
    description:
      'Мощный и тихий. Подходит для маникюра и коррекции. Регулировка оборотов, реверс.',
    image: 'https://avenueprofessional.net/assets/images/1695896416frezer.jpg'
  },
  {
    id: 'besprovodnaya-uv-led-lampa-chernaya',
    category: 'manicure-tools',
    name: 'Беспроводная UV/LED лампа, чёрная',
    price: 2400,
    description:
      'Равномерная полимеризация гелей и гель-лаков. Автономная работа и режимы таймера.',
    image: 'https://avenueprofessional.net/assets/images/17113060561000000428.jpg'
  },
  {
    id: 'besprovodnaya-vytyazhka-dlya-manikyura',
    category: 'manicure-tools',
    name: 'Беспроводная вытяжка для маникюра',
    price: 4500,
    description:
      'Эффективное удаление пыли, компактный корпус и высокая производительность для чистой рабочей зоны.',
    image: 'https://avenueprofessional.net/assets/images/1753703370IMG_0935.jpeg'
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
