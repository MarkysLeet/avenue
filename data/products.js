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
    slug: 'klassicheskaya-seriya-gel-lakov-01',
    category: 'Гель лаки для ногтей',
    categorySlug: 'nail-polish',
    brand: 'Avenue Professional',
    name: 'Классическая серия гель-лаков 01',
    title: 'Классическая серия гель-лаков 01',
    price: 315,
    rating: 5,
    tags: ['гель-лак', 'стойкость', 'уход'],
    images: ['https://avenueprofessional.net/assets/images/1755206610IMG_3588.jpeg'],
    image: 'https://avenueprofessional.net/assets/images/1755206610IMG_3588.jpeg',
    shortDesc:
      'Плотный пигмент, ровное покрытие с первого слоя. Подходит для базы и выравнивания.',
    description:
      'Плотный пигмент, ровное покрытие с первого слоя. Подходит для базы и выравнивания.',
    specs: { 'Объём': '10 мл', 'Финиш': 'Глянцевый', 'Стойкость': 'до 4 недель' },
    inStock: true
  },
  {
    id: 'klassicheskaya-seriya-gel-lakov-02',
    slug: 'klassicheskaya-seriya-gel-lakov-02',
    category: 'Гель лаки для ногтей',
    categorySlug: 'nail-polish',
    brand: 'Avenue Professional',
    name: 'Классическая серия гель-лаков 02',
    title: 'Классическая серия гель-лаков 02',
    price: 315,
    rating: 5,
    tags: ['гель-лак', 'самовыравнивание', 'ежедневный уход'],
    images: ['https://avenueprofessional.net/assets/images/17552588807DC9983D-E3DA-4EC2-A79F-ACFC85688F7C.jpeg'],
    image: 'https://avenueprofessional.net/assets/images/17552588807DC9983D-E3DA-4EC2-A79F-ACFC85688F7C.jpeg',
    shortDesc:
      'Универсальный оттенок на каждый день: самовыравнивание, стойкость до 3–4 недель.',
    description:
      'Универсальный оттенок на каждый день: самовыравнивание, стойкость до 3–4 недель.',
    specs: { 'Объём': '10 мл', 'Финиш': 'Глянцевый', 'Стойкость': 'до 4 недель' },
    inStock: true
  },
  {
    id: 'klassicheskaya-seriya-gel-lakov-04',
    slug: 'klassicheskaya-seriya-gel-lakov-04',
    category: 'Гель лаки для ногтей',
    categorySlug: 'nail-polish',
    brand: 'Avenue Professional',
    name: 'Классическая серия гель-лаков 04',
    title: 'Классическая серия гель-лаков 04',
    price: 315,
    rating: 5,
    tags: ['гель-лак', 'насыщенный цвет', 'домашний уход'],
    images: ['https://avenueprofessional.net/assets/images/1754736830IMG_2338.jpeg'],
    image: 'https://avenueprofessional.net/assets/images/1754736830IMG_2338.jpeg',
    shortDesc:
      'Глубокий насыщенный цвет, без полос и проплешин. Для профессионального и домашнего использования.',
    description:
      'Глубокий насыщенный цвет, без полос и проплешин. Для профессионального и домашнего использования.',
    specs: { 'Объём': '10 мл', 'Финиш': 'Глянцевый', 'Стойкость': 'до 4 недель' },
    inStock: true
  },
  {
    id: 'frezer-dlya-manikyura',
    slug: 'frezer-dlya-manikyura',
    category: 'Техника для маникюра',
    categorySlug: 'manicure-tools',
    brand: 'Avenue Professional',
    name: 'Фрезер для маникюра',
    title: 'Фрезер для маникюра',
    price: 3500,
    rating: 5,
    tags: ['оборудование', 'маникюр', 'профессионально'],
    images: ['https://avenueprofessional.net/assets/images/1695896416frezer.jpg'],
    image: 'https://avenueprofessional.net/assets/images/1695896416frezer.jpg',
    shortDesc:
      'Мощный и тихий. Подходит для маникюра и коррекции. Регулировка оборотов, реверс.',
    description:
      'Мощный и тихий. Подходит для маникюра и коррекции. Регулировка оборотов, реверс.',
    specs: { 'Мощность': 'до 65 Вт', 'Обороты': 'до 35 000 об/мин' },
    inStock: true
  },
  {
    id: 'besprovodnaya-uv-led-lampa-chernaya',
    slug: 'besprovodnaya-uv-led-lampa-chernaya',
    category: 'Техника для маникюра',
    categorySlug: 'manicure-tools',
    brand: 'Avenue Professional',
    name: 'Беспроводная UV/LED лампа, чёрная',
    title: 'Беспроводная UV/LED лампа, чёрная',
    price: 2400,
    rating: 5,
    tags: ['оборудование', 'лампа', 'UV/LED'],
    images: ['https://avenueprofessional.net/assets/images/17113060561000000428.jpg'],
    image: 'https://avenueprofessional.net/assets/images/17113060561000000428.jpg',
    shortDesc:
      'Равномерная полимеризация гелей и гель-лаков. Автономная работа и режимы таймера.',
    description:
      'Равномерная полимеризация гелей и гель-лаков. Автономная работа и режимы таймера.',
    specs: { 'Мощность': '48–120 Вт', 'Режимы': '10/30/60/99 сек' },
    inStock: true
  },
  {
    id: 'besprovodnaya-vytyazhka-dlya-manikyura',
    slug: 'besprovodnaya-vytyazhka-dlya-manikyura',
    category: 'Техника для маникюра',
    categorySlug: 'manicure-tools',
    brand: 'Avenue Professional',
    name: 'Беспроводная вытяжка для маникюра',
    title: 'Беспроводная вытяжка для маникюра',
    price: 4500,
    rating: 5,
    tags: ['оборудование', 'вытяжка', 'чистота'],
    images: ['https://avenueprofessional.net/assets/images/1753703370IMG_0935.jpeg'],
    image: 'https://avenueprofessional.net/assets/images/1753703370IMG_0935.jpeg',
    shortDesc:
      'Эффективное удаление пыли, компактный корпус и высокая производительность для чистой рабочей зоны.',
    description:
      'Эффективное удаление пыли, компактный корпус и высокая производительность для чистой рабочей зоны.',
    specs: { Тип: 'Беспроводная', Фильтр: 'Сменный' },
    inStock: true
  },
  {
    id: 'uv-gel-clear',
    slug: 'uv-gel-clear',
    category: 'Гели',
    categorySlug: 'geli',
    brand: 'Avenue Professional',
    name: 'UV гель Clear (прозрачный)',
    title: 'UV гель Clear (прозрачный)',
    price: 400,
    oldPrice: 520,
    rating: 5,
    tags: ['UV гель', 'моделирование', 'выравнивание'],
    images: ['https://www.avenueprofessional.net/assets/images/1690286379UU1.png'],
    image: 'https://www.avenueprofessional.net/assets/images/1690286379UU1.png',
    shortDesc:
      'Прозрачный самовыравнивающийся UV-гель для укрепления и моделирования, держится до 4 недель.',
    description:
      'Прозрачный самовыравнивающийся UV-гель для укрепления и моделирования, держится до 4 недель.',
    specs: { 'Объём': '15 мл', 'Тип': 'UV', 'Финиш': 'Прозрачный/Камуфлирующий' },
    inStock: true
  },
  {
    id: 'uv-gel-02',
    slug: 'uv-gel-02',
    category: 'Гели',
    categorySlug: 'geli',
    brand: 'Avenue Professional',
    name: 'UV гель 02',
    title: 'UV гель 02',
    price: 400,
    oldPrice: 520,
    rating: 5,
    tags: ['UV гель', 'моделирование', 'выравнивание'],
    images: ['https://www.avenueprofessional.net/assets/images/1690286448UU2.png'],
    image: 'https://www.avenueprofessional.net/assets/images/1690286448UU2.png',
    shortDesc:
      'Пластичный UV-гель средней густоты: комфортное выравнивание, надёжная носибельность.',
    description:
      'Пластичный UV-гель средней густоты: комфортное выравнивание, надёжная носибельность.',
    specs: { 'Объём': '15 мл', 'Тип': 'UV', 'Финиш': 'Прозрачный/Камуфлирующий' },
    inStock: true
  },
  {
    id: 'uv-gel-03',
    slug: 'uv-gel-03',
    category: 'Гели',
    categorySlug: 'geli',
    brand: 'Avenue Professional',
    name: 'UV гель 03',
    title: 'UV гель 03',
    price: 400,
    oldPrice: 520,
    rating: 5,
    tags: ['UV гель', 'моделирование', 'выравнивание'],
    images: ['https://www.avenueprofessional.net/assets/images/1690286469UU3.png'],
    image: 'https://www.avenueprofessional.net/assets/images/1690286469UU3.png',
    shortDesc:
      'Плотный пигмент, ровная структура без усадок. Для салонного и домашнего использования.',
    description:
      'Плотный пигмент, ровная структура без усадок. Для салонного и домашнего использования.',
    specs: { 'Объём': '15 мл', 'Тип': 'UV', 'Финиш': 'Прозрачный/Камуфлирующий' },
    inStock: true
  },
  {
    id: 'uv-gel-04',
    slug: 'uv-gel-04',
    category: 'Гели',
    categorySlug: 'geli',
    brand: 'Avenue Professional',
    name: 'UV гель 04',
    title: 'UV гель 04',
    price: 400,
    oldPrice: 520,
    rating: 5,
    tags: ['UV гель', 'моделирование', 'выравнивание'],
    images: ['https://www.avenueprofessional.net/assets/images/1690286501UU4.png'],
    image: 'https://www.avenueprofessional.net/assets/images/1690286501UU4.png',
    shortDesc:
      'Стабильная формула для архитектуры ногтя: отличная адгезия, гладкая апекс-зона.',
    description:
      'Стабильная формула для архитектуры ногтя: отличная адгезия, гладкая апекс-зона.',
    specs: { 'Объём': '15 мл', 'Тип': 'UV', 'Финиш': 'Прозрачный/Камуфлирующий' },
    inStock: true
  },
  {
    id: 'uv-gel-05',
    slug: 'uv-gel-05',
    category: 'Гели',
    categorySlug: 'geli',
    brand: 'Avenue Professional',
    name: 'UV гель 05',
    title: 'UV гель 05',
    price: 400,
    oldPrice: 520,
    rating: 5,
    tags: ['UV гель', 'моделирование', 'выравнивание'],
    images: ['https://www.avenueprofessional.net/assets/images/1690286522UU5.png'],
    image: 'https://www.avenueprofessional.net/assets/images/1690286522UU5.png',
    shortDesc:
      'Укрепление и наращивание без сколов: комфортное опиливание и глянец после покрытия.',
    description:
      'Укрепление и наращивание без сколов: комфортное опиливание и глянец после покрытия.',
    specs: { 'Объём': '15 мл', 'Тип': 'UV', 'Финиш': 'Прозрачный/Камуфлирующий' },
    inStock: true
  },
  {
    id: 'uv-gel-06',
    slug: 'uv-gel-06',
    category: 'Гели',
    categorySlug: 'geli',
    brand: 'Avenue Professional',
    name: 'UV гель 06',
    title: 'UV гель 06',
    price: 400,
    oldPrice: 520,
    rating: 5,
    tags: ['UV гель', 'моделирование', 'выравнивание'],
    images: ['https://www.avenueprofessional.net/assets/images/1690286656UU6%20(2).png'],
    image: 'https://www.avenueprofessional.net/assets/images/1690286656UU6%20(2).png',
    shortDesc:
      'Самовыравнивающийся гель с устойчивой фиксацией формы. Полимеризация в UV/LED.',
    description:
      'Самовыравнивающийся гель с устойчивой фиксацией формы. Полимеризация в UV/LED.',
    specs: { 'Объём': '15 мл', 'Тип': 'UV', 'Финиш': 'Прозрачный/Камуфлирующий' },
    inStock: true
  },
  {
    id: 'polygel-01',
    slug: 'polygel-01',
    category: 'Полигели',
    categorySlug: 'polygeli',
    brand: 'Avenue Professional',
    name: 'Полигель 01',
    title: 'Полигель 01',
    price: 520,
    rating: 5,
    tags: ['Полигель', 'укрепление', 'арка'],
    images: ['https://www.avenueprofessional.net/assets/images/1690280431PPP1.png'],
    image: 'https://www.avenueprofessional.net/assets/images/1690280431PPP1.png',
    shortDesc:
      'Лёгкая опиловка и отличная пластичность. Подходит для выравнивания и укрепления.',
    description:
      'Лёгкая опиловка и отличная пластичность. Подходит для выравнивания и укрепления.',
    specs: { 'Объём': '30 мл', 'Тип': 'PolyGel', 'Финиш': 'Камуфлирующий/Прозрачный' },
    inStock: true
  },
  {
    id: 'polygel-02',
    slug: 'polygel-02',
    category: 'Полигели',
    categorySlug: 'polygeli',
    brand: 'Avenue Professional',
    name: 'Полигель 02',
    title: 'Полигель 02',
    price: 520,
    rating: 5,
    tags: ['Полигель', 'укрепление', 'арка'],
    images: ['https://www.avenueprofessional.net/assets/images/1690280699PPP2.png'],
    image: 'https://www.avenueprofessional.net/assets/images/1690280699PPP2.png',
    shortDesc:
      'Прочная арка без трещин. Комфортное моделирование без затеков.',
    description:
      'Прочная арка без трещин. Комфортное моделирование без затеков.',
    specs: { 'Объём': '30 мл', 'Тип': 'PolyGel', 'Финиш': 'Камуфлирующий/Прозрачный' },
    inStock: true
  },
  {
    id: 'polygel-03',
    slug: 'polygel-03',
    category: 'Полигели',
    categorySlug: 'polygeli',
    brand: 'Avenue Professional',
    name: 'Полигель 03',
    title: 'Полигель 03',
    price: 520,
    rating: 5,
    tags: ['Полигель', 'укрепление', 'арка'],
    images: ['https://www.avenueprofessional.net/assets/images/1690282142PPP3.png'],
    image: 'https://www.avenueprofessional.net/assets/images/1690282142PPP3.png',
    shortDesc:
      'Универсальный оттенок и надёжная носибельность до 4 недель.',
    description:
      'Универсальный оттенок и надёжная носибельность до 4 недель.',
    specs: { 'Объём': '30 мл', 'Тип': 'PolyGel', 'Финиш': 'Камуфлирующий/Прозрачный' },
    inStock: true
  },
  {
    id: 'polygel-04',
    slug: 'polygel-04',
    category: 'Полигели',
    categorySlug: 'polygeli',
    brand: 'Avenue Professional',
    name: 'Полигель 04',
    title: 'Полигель 04',
    price: 520,
    rating: 5,
    tags: ['Полигель', 'укрепление', 'арка'],
    images: ['https://www.avenueprofessional.net/assets/images/1690282258PPP4.png'],
    image: 'https://www.avenueprofessional.net/assets/images/1690282258PPP4.png',
    shortDesc:
      'Эластичная формула для укрепления и дизайнов. Минимальная усадка.',
    description:
      'Эластичная формула для укрепления и дизайнов. Минимальная усадка.',
    specs: { 'Объём': '30 мл', 'Тип': 'PolyGel', 'Финиш': 'Камуфлирующий/Прозрачный' },
    inStock: true
  },
  {
    id: 'polygel-05',
    slug: 'polygel-05',
    category: 'Полигели',
    categorySlug: 'polygeli',
    brand: 'Avenue Professional',
    name: 'Полигель 05',
    title: 'Полигель 05',
    price: 520,
    rating: 5,
    tags: ['Полигель', 'укрепление', 'арка'],
    images: ['https://www.avenueprofessional.net/assets/images/1690282360PPP5.png'],
    image: 'https://www.avenueprofessional.net/assets/images/1690282360PPP5.png',
    shortDesc:
      'Отличная адгезия и удобная консистенция для быстрого выравнивания.',
    description:
      'Отличная адгезия и удобная консистенция для быстрого выравнивания.',
    specs: { 'Объём': '30 мл', 'Тип': 'PolyGel', 'Финиш': 'Камуфлирующий/Прозрачный' },
    inStock: true
  },
  {
    id: 'polygel-06',
    slug: 'polygel-06',
    category: 'Полигели',
    categorySlug: 'polygeli',
    brand: 'Avenue Professional',
    name: 'Полигель 06',
    title: 'Полигель 06',
    price: 520,
    rating: 5,
    tags: ['Полигель', 'укрепление', 'арка'],
    images: ['https://www.avenueprofessional.net/assets/images/1690283657PPP6.png'],
    image: 'https://www.avenueprofessional.net/assets/images/1690283657PPP6.png',
    shortDesc:
      'Прочный результат без сколов. Подходит для тонкого укрепления.',
    description:
      'Прочный результат без сколов. Подходит для тонкого укрепления.',
    specs: { 'Объём': '30 мл', 'Тип': 'PolyGel', 'Финиш': 'Камуфлирующий/Прозрачный' },
    inStock: true
  },
  {
    id: 'polyjel-ust-tips-square',
    slug: 'polyjel-ust-tips-square',
    category: 'Расходники',
    categorySlug: 'rashodniki',
    brand: 'Avenue Professional',
    name: 'Верхние формы PolyGel Square',
    title: 'Верхние формы PolyGel Square',
    price: 200,
    rating: 5,
    tags: ['расходники', 'салон', 'маникюр'],
    images: ['https://www.avenueprofessional.net/assets/images/17113066921000000367.jpg'],
    image: 'https://www.avenueprofessional.net/assets/images/17113066921000000367.jpg',
    shortDesc:
      'Формы для наращивания в технике верхних форм. Чёткая геометрия и удобная посадка.',
    description:
      'Формы для наращивания в технике верхних форм. Чёткая геометрия и удобная посадка.',
    specs: { 'Форма': 'Square', 'Комплект': 'набор' },
    inStock: true
  },
  {
    id: 'lifsiz-pamuk-1000',
    slug: 'lifsiz-pamuk-1000',
    category: 'Расходники',
    categorySlug: 'rashodniki',
    brand: 'Avenue Professional',
    name: 'Безворсовые салфетки (1000 шт.)',
    title: 'Безворсовые салфетки (1000 шт.)',
    price: 120,
    rating: 5,
    tags: ['расходники', 'салон', 'маникюр'],
    images: ['https://www.avenueprofessional.net/assets/images/17113072261000000318.jpg'],
    image: 'https://www.avenueprofessional.net/assets/images/17113072261000000318.jpg',
    shortDesc:
      'Плотные безворсовые салфетки для обезжиривания и снятия липкого слоя.',
    description:
      'Плотные безворсовые салфетки для обезжиривания и снятия липкого слоя.',
    specs: { 'Количество': '1000 шт.' },
    inStock: true
  },
  {
    id: 'soft-gel-tips-long-square',
    slug: 'soft-gel-tips-long-square',
    category: 'Расходники',
    categorySlug: 'rashodniki',
    brand: 'Avenue Professional',
    name: 'Soft Gel Tips Long Square',
    title: 'Soft Gel Tips Long Square',
    price: 450,
    rating: 5,
    tags: ['расходники', 'салон', 'маникюр'],
    images: ['https://www.avenueprofessional.net/assets/images/1753703653IMG_2021.jpeg'],
    image: 'https://www.avenueprofessional.net/assets/images/1753703653IMG_2021.jpeg',
    shortDesc:
      'Мягкие типсы для быстрого удлинения. Long Square — трендовая форма.',
    description:
      'Мягкие типсы для быстрого удлинения. Long Square — трендовая форма.',
    specs: { 'Форма': 'Long Square', 'Назначение': 'типсы' },
    inStock: true
  },
  {
    id: 'soft-gel-tips-full-cover-long-square',
    slug: 'soft-gel-tips-full-cover-long-square',
    category: 'Расходники',
    categorySlug: 'rashodniki',
    brand: 'Avenue Professional',
    name: 'Soft Gel Tips Full Cover Long Square',
    title: 'Soft Gel Tips Full Cover Long Square',
    price: 220,
    rating: 5,
    tags: ['расходники', 'салон', 'маникюр'],
    images: ['https://www.avenueprofessional.net/assets/images/1746908150IMG_3130.jpeg'],
    image: 'https://www.avenueprofessional.net/assets/images/1746908150IMG_3130.jpeg',
    shortDesc:
      'Полное покрытие пластины. Идеально для быстрого наращивания и дизайнов.',
    description:
      'Полное покрытие пластины. Идеально для быстрого наращивания и дизайнов.',
    specs: { 'Покрытие': 'Full Cover', 'Форма': 'Long Square' },
    inStock: true
  }
];

export const getProductsByCategory = (categoryId) =>
  products.filter(
    (product) =>
      product.categorySlug === categoryId ||
      product.category === categoryId
  );

export const getProductById = (id) => products.find((product) => product.id === id);
