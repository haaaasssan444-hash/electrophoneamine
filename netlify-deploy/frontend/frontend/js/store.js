(function () {
  const KEY = 'productsData';
  const CATALOG_RESET_KEY = 'electrophone_catalog_reset_v1';
  const CATALOG_SEED_KEY = 'electrophone_catalog_seed_v1';
  const NEW_PHONES_SEED_KEY = 'electrophone_new_phones_20261026_v1';
  const IPHONE_13_PRO_SEED_KEY = 'electrophone_iphone13pro_128_20261026_v1';
  const IPHONE_13_PRO_PRICE_UPDATE_KEY = 'electrophone_iphone13pro_128_4300_v1';
  const IPHONE_14_PRO_GOLD_SEED_KEY = 'electrophone_iphone14pro_gold_128_20261026_v1';
  const IPHONE_16_PRO_256_87_SEED_KEY = 'electrophone_iphone16pro_256_87_20261026_v1';
  const IPHONE_16_PRO_256_76_SEED_KEY = 'electrophone_iphone16pro_256_76_20261027_v1';
  const SAMSUNG_S26_ULTRA_SEED_KEY = 'electrophone_samsung_s26_ultra_20261026_v1';
  const MORE_PHONES_SEED_KEY = 'electrophone_more_phones_20261026_v1';
  const STOCK_PHONES_SEED_KEY = 'electrophone_stock_phones_20261027_v2';
  const NEW_INVENTORY_SEED_KEY = 'electrophone_new_inventory_20261027_v1';
  const MORE_NEW_INVENTORY_SEED_KEY = 'electrophone_more_new_inventory_20261027_v1';
  const LATEST_INVENTORY_SEED_KEY = 'electrophone_latest_inventory_20261027_v1';
  const POCO_INVENTORY_SEED_KEY = 'electrophone_poco_inventory_20261027_v1';
  const OPPO_A73_SEED_KEY = 'electrophone_oppo_a73_128_6_20261027_v1';
  const FJ_STAR_FJ_A6_SEED_KEY = 'electrophone_accessory_fj_star_fj_a6_20261027_v1';
  const JBL_980BT_SEED_KEY = 'electrophone_accessory_980bt_20261027_v1';
  const AWDA_BL_A9_SEED_KEY = 'electrophone_accessory_awda_bl_a9_20261027_v1';
  const P9_PRO_MAX_SEED_KEY = 'electrophone_accessory_p9_pro_max_20261027_v1';
  const P9_PRO_MAX_WHITE_SEED_KEY = 'electrophone_accessory_p9_pro_max_white_20261027_v1';
  const CAT_EAR_VIV_23M_SEED_KEY = 'electrophone_accessory_cat_ear_viv_23m_20261027_v1';
  const SMART_CHARGER_45W_SEED_KEY = 'electrophone_accessory_smart_charger_45w_20261027_v1';
  const OHAYO_Q24_SEED_KEY = 'electrophone_accessory_ohayo_q24_20261027_v1';
  const FJ_STAR_5A_CHARGER_SEED_KEY = 'electrophone_accessory_fj_star_5a_charger_20261027_v1';
  const JAWDA_D14_CHARGER_SEED_KEY = 'electrophone_accessory_jawda_d14_charger_20261027_v1';
  const SAMSUNG_25W_CHARGER_SEED_KEY = 'electrophone_accessory_samsung_25w_charger_20261027_v1';
  const UIRON_CR34_CHARGER_SEED_KEY = 'electrophone_accessory_uiron_cr34_charger_20261027_v1';
  const HEADPHONE_PACKAGE_IMAGE_ORDER_KEY = 'electrophone_headphone_package_image_order_v1';
  const PHONE_PRICE_RULE_KEY = 'electrophone_phone_price_ending_00_v1';
  const FEATURED_IMAGE_UPDATE_KEY = 'electrophone_iphone16_primary_image_v1';
  const INVENTORY_IMAGE_UPDATE_KEY = 'electrophone_inventory_images_20261027_v1';
  const SOCIAL_DEFAULTS_KEY = 'electrophone_social_defaults_v1';
  const WHATSAPP_DEFAULT_KEY = 'electrophone_whatsapp_default_v1';
  const WHATSAPP_PHONE_UPDATE_KEY = 'electrophone_whatsapp_phone_0665343844_v1';
  const DEFAULT_WHATSAPP_PHONE = '212665343844';
  const DEFAULT_INSTAGRAM_URL = 'https://www.instagram.com/hassan_elmorabit0/';
  const STORE_SCRIPT_URL = document.currentScript && document.currentScript.src;

  const FEATURED_PRODUCTS = [
    {
      id: 'featured-iphone-13-256-blue',
      brand: 'iphone',
      model: '13 Normal',
      storage: '256GB',
      ram: '4GB',
      name: 'iPhone 13 256GB - أزرق',
      price: 3800,
      oldPrice: 4200,
      img: 'asset:phones/iphone-13-blue.jpg',
      images: [
        'asset:phones/iphone-13-blue.jpg',
        'asset:phones/iphone-13-blue-back.jpg',
        'asset:phones/iphone-13-blue-side.jpg'
      ],
      condition: 'حالة ممتازة',
      quantity: 1,
      summary: 'أزرق أنيق • بطارية 76% • ضمان 7 أيام',
      desc: 'iPhone 13 باللون الأزرق وسعة 256GB. حالة ممتازة، وصحة البطارية 76% حسب معلومات المنتج. يتضمن ضمان المحل لمدة 7 أيام للفحص. السعر: 3,800 درهم.'
    },
    {
      id: 'featured-iphone-16-pro-128',
      brand: 'iphone',
      model: '16 Pro',
      storage: '128GB',
      ram: '8GB',
      name: 'iPhone 16 Pro 128GB - Desert Titanium',
      price: 7299,
      oldPrice: 13500,
      img: 'asset:phones/iphone-16-pro-white-back.jpg',
      images: [
        'asset:phones/iphone-16-pro-white-back.jpg',
        'asset:phones/iphone-16-pro-front.jpg',
        'asset:phones/iphone-16-pro-camera.jpg',
        'asset:phones/iphone-16-pro-side.jpg',
        'asset:phones/iphone-16-pro-bottom.jpg'
      ],
      condition: 'حالة ممتازة',
      quantity: 1,
      summary: 'Desert Titanium • بطارية 76% • عرض خاص',
      desc: 'iPhone 16 Pro بلون Desert Titanium وسعة 128GB، مع شاشة 6.3 بوصة ProMotion 120Hz ومعالج A18 Pro. صحة البطارية 76% حسب معلومات المنتج. يتضمن ضمان المحل للفحص. السعر: 7,299 درهم.'
    }
  ];

  const NEW_PHONE_PRODUCTS = [
    {
      id: 'featured-iphone-14-pro-128-white-gold',
      brand: 'iphone',
      model: '14 Pro',
      storage: '128GB',
      ram: '6GB',
      name: 'iPhone 14 Pro 128GB - أبيض ذهبي',
      price: 5500,
      img: 'asset:phones/iphone-14-pro-white-back.jpg',
      images: [
        'asset:phones/iphone-14-pro-white-back.jpg',
        'asset:phones/iphone-14-pro-side.jpg',
        'asset:phones/iphone-14-pro-angle.jpg'
      ],
      condition: 'مستعمل نظيف',
      quantity: 1,
      summary: 'أبيض ذهبي • بطارية 91% • ضمان 7 أيام',
      desc: 'iPhone 14 Pro بسعة 128GB ولون أبيض ذهبي. بطارية 91%، شاشة Super Retina XDR بحجم 6.1 بوصة وبتردد 120Hz، ومعالج A16 Bionic. Face ID خدام وiCloud خاوي. معاه كابل أصلي، فاتورة وضمان المحل لمدة 7 أيام. السعر: 5,500 درهم.'
    },
    {
      id: 'featured-iphone-15-128',
      brand: 'iphone',
      model: '15 Normal',
      storage: '128GB',
      ram: '6GB',
      name: 'iPhone 15 128GB - رمادي',
      price: 5000,
      img: 'asset:phones/iphone-15-gray-back.jpg',
      images: [
        'asset:phones/iphone-15-gray-back.jpg',
        'asset:phones/iphone-15-front.jpg',
        'asset:phones/iphone-15-angle.jpg'
      ],
      condition: 'حالة ممتازة',
      quantity: 1,
      summary: 'رمادي • بطارية 93% • Dynamic Island',
      desc: 'iPhone 15 العادي بسعة 128GB ولون رمادي حسب الصور. بطارية 93%، شاشة 6.1 بوصة مع Dynamic Island، معالج A16 Bionic، كاميرا رئيسية 48MP ومنفذ USB-C. Face ID خدام وiCloud خاوي. معاه كابل Type-C، فاتورة وضمان المحل لمدة 7 أيام. السعر: 5,000 درهم.'
    }
  ];

  const IPHONE_13_PRO_PRODUCT = {
    id: 'featured-iphone-13-pro-128-silver',
    brand: 'iphone',
    model: '13 Pro',
    storage: '128GB',
    ram: '6GB',
    name: 'iPhone 13 Pro 128GB - Silver',
    price: 4300,
    img: 'asset:phones/iphone-13-pro-silver-back.jpg',
    images: [
      'asset:phones/iphone-13-pro-silver-back.jpg',
      'asset:phones/iphone-13-pro-silver-side.jpg',
      'asset:phones/iphone-13-pro-silver-angle.jpg'
    ],
    condition: 'حالة ممتازة',
    quantity: 1,
    summary: 'أبيض Silver • بطارية 88% • ProMotion 120Hz',
    desc: 'iPhone 13 Pro بسعة 128GB ولون أبيض Silver. بطارية 88%، شاشة Super Retina XDR بحجم 6.1 بوصة مع ProMotion 120Hz، ومعالج A15 Bionic. Face ID وTrue Tone خدامين وiCloud خاوي. معاه كابل، فاتورة وضمان المحل لمدة 7 أيام. السعر: 4,300 درهم.'
  };

  const IPHONE_14_PRO_GOLD_PRODUCT = {
    id: 'featured-iphone-14-pro-128-gold',
    brand: 'iphone',
    model: '14 Pro',
    storage: '128GB',
    ram: '6GB',
    name: 'iPhone 14 Pro 128GB - Gold',
    price: 5499,
    img: 'asset:phones/iphone-14-pro-gold-angle.jpg',
    images: [
      'asset:phones/iphone-14-pro-gold-angle.jpg',
      'asset:phones/iphone-14-pro-gold-side.jpg',
      'asset:phones/iphone-14-pro-gold-back.jpg'
    ],
    condition: 'حالة ممتازة',
    quantity: 1,
    summary: 'Gold • بطارية 91% • Dynamic Island',
    desc: 'iPhone 14 Pro بسعة 128GB ولون Gold. بطارية 91%، شاشة Super Retina XDR بحجم 6.1 بوصة مع 120Hz وDynamic Island، ومعالج A16 Bionic وكاميرا Pro بدقة 48MP. Face ID وTrue Tone خدامين وiCloud خاوي. معاه كابل، فاتورة وضمان المحل لمدة 7 أيام. السعر: 5,499 درهم.'
  };

  const IPHONE_16_PRO_256_87_PRODUCT = {
    id: 'featured-iphone-16-pro-256-desert-titanium-87',
    brand: 'iphone',
    model: '16 Pro',
    storage: '256GB',
    ram: '8GB',
    name: 'iPhone 16 Pro 256GB - Desert Titanium',
    price: 7500,
    img: 'asset:phones/iphone-16-pro-256-desert-titanium-87-angle.jpg',
    images: [
      'asset:phones/iphone-16-pro-256-desert-titanium-87-angle.jpg',
      'asset:phones/iphone-16-pro-256-desert-titanium-87-back.jpg',
      'asset:phones/iphone-16-pro-256-desert-titanium-87-side.jpg'
    ],
    condition: 'حالة جيدة جدا',
    quantity: 1,
    summary: 'Desert Titanium • بطارية 87% • 256GB',
    desc: 'iPhone 16 Pro بسعة 256GB ولون Desert Titanium. بطارية أصلية 87%، حالة جيدة جدا 9.5/10، Face ID وTrue Tone خدامين، وiCloud نقي والهاتف مفتوح لجميع الشبكات. ما تفتحش وما تصلحش. معاه كابل أصلي وضمان المحل 15 يوم. التوصيل متوفر مع الدفع عند الاستلام.'
  };

  const IPHONE_16_PRO_256_76_PRODUCT = {
    id: 'stock-iphone-16-pro-256-dark-76',
    brand: 'iphone',
    model: '16 Pro',
    storage: '256GB',
    name: 'iPhone 16 Pro 256GB - Dark Titanium',
    price: 7000,
    img: 'asset:phones/stock-iphone-16-pro-256-dark-76-3.jpg',
    images: [
      'asset:phones/stock-iphone-16-pro-256-dark-76-3.jpg',
      'asset:phones/stock-iphone-16-pro-256-dark-76-4.jpg',
      'asset:phones/stock-iphone-16-pro-256-dark-76-2.jpg',
      'asset:phones/stock-iphone-16-pro-256-dark-76-1.jpg'
    ],
    condition: 'متوفر',
    quantity: 1,
    summary: 'لون داكن • 256GB • بطارية 76%',
    desc: 'iPhone 16 Pro بسعة 256GB؛ الصور تظهر لونا داكنا. شاشة Super Retina XDR بقياس 6.3 بوصة مع ProMotion حتى 120Hz، ومعالج A18 Pro، ونظام كاميرات Pro مع زر Camera Control ومنفذ USB-C. نسبة البطارية 76% حسب اسم المجلد، يرجى تأكيدها من إعدادات الهاتف. الصور المتاحة كتبيّن الجهة الخلفية للكاميرا والجانب والأسفل والواجهة.'
  };

  const SAMSUNG_S26_ULTRA_PRODUCTS = [
    {
      id: 'featured-samsung-s26-ultra-512-white-silver',
      brand: 'samsung',
      model: 'Galaxy S26 Ultra',
      storage: '512GB',
      ram: '12GB',
      name: 'Samsung Galaxy S26 Ultra 512GB - Titanium White Silver',
      price: 10500,
      img: 'asset:phones/samsung-s26-ultra-512-white-back.jpg',
      images: [
        'asset:phones/samsung-s26-ultra-512-white-back.jpg',
        'asset:phones/samsung-s26-ultra-512-white-angle.jpg'
      ],
      condition: 'جديد مسدود',
      quantity: 1,
      summary: '512GB • RAM 12GB • Titanium White Silver • S Pen',
      desc: 'Samsung Galaxy S26 Ultra بسعة 512GB وذاكرة RAM 12GB، بلون Titanium White Silver. جديد 100% ومسدود فالكرتونة، معاه S Pen والكابل وضمان Samsung. الثمن كيشمل التوصيل حسب معلومات المحل.'
    },
    {
      id: 'featured-samsung-s26-ultra-256-black',
      brand: 'samsung',
      model: 'Galaxy S26 Ultra',
      storage: '256GB',
      ram: '12GB',
      name: 'Samsung Galaxy S26 Ultra 256GB - Titanium Black',
      price: 8700,
      img: 'asset:phones/samsung-s26-ultra-256-black-back.jpg',
      images: [
        'asset:phones/samsung-s26-ultra-256-black-back.jpg',
        'asset:phones/samsung-s26-ultra-256-black-angle.jpg',
        'asset:phones/samsung-s26-ultra-256-black-side.jpg'
      ],
      condition: 'جديد مسدود',
      quantity: 1,
      summary: '256GB • RAM 12GB • Titanium Black • S Pen',
      desc: 'Samsung Galaxy S26 Ultra بسعة 256GB وذاكرة RAM 12GB، بلون Titanium Black. جديد 100% ومسدود فالكرتونة، معاه S Pen والكابل وضمان Samsung. التوصيل متوفر حسب معلومات المحل.'
    }
  ];

  const MORE_PHONE_PRODUCTS = [
    {
      id: 'featured-iphone-13-pro-max-128-sierra-blue',
      brand: 'iphone',
      model: '13 Pro Max',
      storage: '128GB',
      ram: '6GB',
      name: 'iPhone 13 Pro Max 128GB - Sierra Blue',
      price: 4900,
      img: 'asset:phones/iphone-13-pro-max-sierra-blue-angle.jpg',
      images: [
        'asset:phones/iphone-13-pro-max-sierra-blue-angle.jpg',
        'asset:phones/iphone-13-pro-max-sierra-blue-side.jpg',
        'asset:phones/iphone-13-pro-max-sierra-blue-back.jpg'
      ],
      condition: 'حالة جيدة جدا',
      quantity: 1,
      summary: 'Sierra Blue • بطارية 94% • Unlocked رسمي',
      desc: 'iPhone 13 Pro Max A2484 بسعة 128GB ولون Sierra Blue. بطارية أصلية 94%، شاشة 6.7 بوصة ProMotion 120Hz، كاميرات Pro ثلاثية، وFace ID خدام. الهاتف مفتوح رسمي لجميع الشبكات وiCloud خاوي. معاه كابل، فاتورة وضمان المحل لمدة 15 يوم. الثمن: 4,900 درهم.'
    },
    {
      id: 'featured-samsung-galaxy-s21-plus-128-silver',
      brand: 'samsung',
      model: 'Galaxy S21 Plus 5G',
      storage: '128GB',
      ram: '8GB',
      name: 'Samsung Galaxy S21+ 128GB - Phantom Silver',
      price: 2600,
      img: 'asset:phones/samsung-s21-plus-phantom-silver-angle.jpg',
      images: [
        'asset:phones/samsung-s21-plus-phantom-silver-angle.jpg',
        'asset:phones/samsung-s21-plus-phantom-silver-side.jpg',
        'asset:phones/samsung-s21-plus-phantom-silver-back.jpg'
      ],
      condition: 'حالة جيدة جدا',
      quantity: 1,
      summary: 'Phantom Silver • 128GB • RAM 8GB',
      desc: 'Samsung Galaxy S21 Plus 5G بسعة 128GB وذاكرة RAM 8GB، بلون Phantom Silver. حالة جيدة جدا، شاشة Dynamic AMOLED 2X بتردد 120Hz، وكاميرا ثلاثية. الهاتف خدام مزيان. معاه كابل، فاتورة وضمان المحل لمدة 7 أيام.'
    },
    {
      id: 'featured-samsung-galaxy-s24-256-marble-gray',
      brand: 'samsung',
      model: 'Galaxy S24 5G',
      storage: '256GB',
      ram: '8GB',
      name: 'Samsung Galaxy S24 256GB - Marble Gray',
      price: 4200,
      img: 'asset:phones/samsung-galaxy-s24-marble-gray-back.jpg',
      images: [
        'asset:phones/samsung-galaxy-s24-marble-gray-back.jpg',
        'asset:phones/samsung-galaxy-s24-marble-gray-angle.jpg',
        'asset:phones/samsung-galaxy-s24-marble-gray-side.jpg'
      ],
      condition: 'بحالة ممتازة',
      quantity: 1,
      summary: 'Marble Gray • 256GB • RAM 8GB • Galaxy AI',
      desc: 'Samsung Galaxy S24 5G SM-S921B بسعة 256GB وذاكرة RAM 8GB، بلون Marble Gray. بحالة ممتازة 10/10، شاشة Dynamic AMOLED 2X بتردد 120Hz، ومعالج Snapdragon 8 Gen 3 for Galaxy. معاه كابل Type-C وفاتورة وضمان المحل لمدة 7 أيام. التوصيل متوفر لجميع مدن المغرب.'
    }
  ];

  const NEW_INVENTORY_PRODUCTS = [
    {
      id: 'phone-iphone-13-128-red-92-20261027',
      brand: 'iphone',
      model: '13 Normal',
      storage: '128GB',
      name: 'iPhone 13 128GB - أحمر',
      price: 3500,
      img: 'asset:phones/iphone-13-128-red-92-back.jpg',
      images: [
        'asset:phones/iphone-13-128-red-92-back.jpg',
        'asset:phones/iphone-13-128-red-92-angle.jpg',
        'asset:phones/iphone-13-128-red-92-front.jpg'
      ],
      condition: 'مستعمل',
      quantity: 1,
      summary: 'أحمر • 128GB • صحة البطارية 92%',
      desc: 'iPhone 13 عادي باللون الأحمر وسعة 128GB. صحة البطارية 92%.'
    },
    {
      id: 'phone-samsung-a36-128-black-6-20261027',
      brand: 'samsung',
      model: 'Galaxy A36',
      storage: '128GB',
      ram: '6GB',
      name: 'Samsung Galaxy A36 128GB - أسود',
      price: 1800,
      img: 'asset:phones/samsung-a36-128-black-6-back.jpg',
      images: [
        'asset:phones/samsung-a36-128-black-6-back.jpg',
        'asset:phones/samsung-a36-128-black-6-angle.jpg',
        'asset:phones/samsung-a36-128-black-6-front.jpg'
      ],
      condition: 'متوفر',
      quantity: 1,
      summary: 'أسود • 128GB • RAM 6GB',
      desc: 'Samsung Galaxy A36 باللون الأسود، بسعة 128GB وذاكرة RAM 6GB.'
    },
    {
      id: 'phone-samsung-a26-128-pink-6-20261027',
      brand: 'samsung',
      model: 'Galaxy A26',
      storage: '128GB',
      ram: '6GB',
      name: 'Samsung Galaxy A26 128GB - وردي',
      price: 2900,
      img: 'asset:phones/samsung-a26-128-pink-6-back.jpg',
      images: [
        'asset:phones/samsung-a26-128-pink-6-back.jpg',
        'asset:phones/samsung-a26-128-pink-6-angle.jpg',
        'asset:phones/samsung-a26-128-pink-6-front.jpg'
      ],
      condition: 'متوفر',
      quantity: 1,
      summary: 'وردي • 128GB • RAM 6GB',
      desc: 'Samsung Galaxy A26 باللون الوردي، بسعة 128GB وذاكرة RAM 6GB.'
    },
    {
      id: 'phone-samsung-a36-128-blue-6-20261027',
      brand: 'samsung',
      model: 'Galaxy A36',
      storage: '128GB',
      ram: '6GB',
      name: 'Samsung Galaxy A36 128GB - أزرق',
      price: 3700,
      img: 'asset:phones/samsung-a36-128-blue-6-back.jpg',
      images: [
        'asset:phones/samsung-a36-128-blue-6-back.jpg',
        'asset:phones/samsung-a36-128-blue-6-angle.jpg',
        'asset:phones/samsung-a36-128-blue-6-front.jpg'
      ],
      condition: 'متوفر',
      quantity: 1,
      summary: 'أزرق • 128GB • RAM 6GB',
      desc: 'Samsung Galaxy A36 باللون الأزرق، بسعة 128GB وذاكرة RAM 6GB.'
    },
    {
      id: 'phone-vivo-5g-128-6-20261027',
      brand: 'vivo',
      model: '5G',
      storage: '128GB',
      ram: '6GB',
      name: 'vivo 5G 128GB - RAM 6GB',
      price: 1500,
      img: 'asset:phones/vivo-5g-128-6-back.jpg',
      images: [
        'asset:phones/vivo-5g-128-6-back.jpg',
        'asset:phones/vivo-5g-128-6-angle.jpg',
        'asset:phones/vivo-5g-128-6-front.jpg'
      ],
      condition: 'متوفر',
      quantity: 1,
      summary: '5G • 128GB • RAM 6GB',
      desc: 'هاتف vivo 5G بسعة 128GB وذاكرة RAM 6GB. الموديل المحدد غير مذكور.'
    }
  ];

  const MORE_NEW_INVENTORY_PRODUCTS = [
    {
      id: 'phone-honor-magic-4-lite-5g-128-blue-8-20261027',
      brand: 'honor',
      model: 'Magic 4 Lite 5G',
      storage: '128GB',
      ram: '8GB',
      name: 'HONOR Magic 4 Lite 5G 128GB - أزرق',
      price: 1500,
      img: 'asset:phones/honor-magic-4-lite-5g-128-blue-8-back.jpg',
      images: [
        'asset:phones/honor-magic-4-lite-5g-128-blue-8-back.jpg',
        'asset:phones/honor-magic-4-lite-5g-128-blue-8-angle.jpg',
        'asset:phones/honor-magic-4-lite-5g-128-blue-8-front.jpg'
      ],
      condition: 'متوفر',
      quantity: 1,
      summary: 'أزرق • 5G • 128GB • RAM 8GB',
      desc: 'HONOR Magic 4 Lite 5G باللون الأزرق، بسعة 128GB وذاكرة RAM 8GB.'
    },
    {
      id: 'phone-infinix-smart-8-128-4-20261027',
      brand: 'infinix',
      model: 'Smart 8',
      storage: '128GB',
      ram: '4GB',
      name: 'Infinix Smart 8 128GB - RAM 4GB',
      price: 1000,
      img: 'asset:phones/infinix-smart-8-128-4-back.jpg',
      images: [
        'asset:phones/infinix-smart-8-128-4-back.jpg',
        'asset:phones/infinix-smart-8-128-4-angle.jpg',
        'asset:phones/infinix-smart-8-128-4-front.jpg'
      ],
      condition: 'متوفر',
      quantity: 1,
      summary: '128GB • RAM 4GB',
      desc: 'Infinix Smart 8 بسعة 128GB وذاكرة RAM 4GB.'
    },
    {
      id: 'phone-oppo-a17k-64-3-20261027',
      brand: 'oppo',
      model: 'A17k',
      storage: '64GB',
      ram: '3GB',
      name: 'OPPO A17k 64GB - RAM 3GB',
      price: 1300,
      img: 'asset:phones/oppo-a17k-64-3-back.jpg',
      images: [
        'asset:phones/oppo-a17k-64-3-back.jpg',
        'asset:phones/oppo-a17k-64-3-angle.jpg',
        'asset:phones/oppo-a17k-64-3-front.jpg'
      ],
      condition: 'متوفر',
      quantity: 1,
      summary: '64GB • RAM 3GB',
      desc: 'OPPO A17k بسعة 64GB وذاكرة RAM 3GB.'
    },
    {
      id: 'phone-oppo-a73-128-6-20261027',
      brand: 'oppo',
      model: 'A73',
      storage: '128GB',
      ram: '6GB',
      name: 'OPPO A73 128GB - RAM 6GB',
      price: 1500,
      img: 'asset:phones/stock2-oppo-3.jpg',
      images: [
        'asset:phones/stock2-oppo-3.jpg',
        'asset:phones/stock2-oppo-1.jpg',
        'asset:phones/stock2-oppo-2.jpg'
      ],
      condition: 'متوفر',
      quantity: 1,
      summary: '128GB • RAM 6GB • أزرق داكن',
      desc: 'OPPO A73 باللون الأزرق الداكن حسب الصور، بسعة 128GB وذاكرة RAM 6GB.'
    },
    {
      id: 'phone-samsung-s21-plus-128-gray-8-20261027',
      brand: 'samsung',
      model: 'Galaxy S21 Plus',
      storage: '128GB',
      ram: '8GB',
      name: 'Samsung Galaxy S21+ 128GB - فضي',
      price: 2900,
      img: 'asset:phones/samsung-s21-plus-128-8-gray-back.jpg',
      images: [
        'asset:phones/samsung-s21-plus-128-8-gray-back.jpg',
        'asset:phones/samsung-s21-plus-128-8-gray-angle.jpg',
        'asset:phones/samsung-s21-plus-128-8-gray-front.jpg'
      ],
      condition: 'متوفر',
      quantity: 1,
      summary: 'فضي • 128GB • RAM 8GB',
      desc: 'Samsung Galaxy S21+ باللون الفضي، بسعة 128GB وذاكرة RAM 8GB.'
    },
    {
      id: 'phone-samsung-a15-256-8-20261027',
      brand: 'samsung',
      model: 'Galaxy A15',
      storage: '256GB',
      ram: '8GB',
      name: 'Samsung Galaxy A15 256GB - RAM 8GB',
      price: 1700,
      img: 'asset:phones/samsung-a15-256-8-white-back.jpg',
      images: [
        'asset:phones/samsung-a15-256-8-white-back.jpg',
        'asset:phones/samsung-a15-256-8-white-angle.jpg',
        'asset:phones/samsung-a15-256-8-white-front.jpg'
      ],
      condition: 'متوفر',
      quantity: 1,
      summary: '256GB • RAM 8GB • أبيض',
      desc: 'Samsung Galaxy A15 باللون الأبيض، بسعة 256GB وذاكرة RAM 8GB.'
    },
    {
      id: 'phone-samsung-a54-128-6-black-20261027',
      brand: 'samsung',
      model: 'Galaxy A54',
      storage: '128GB',
      ram: '6GB',
      name: 'Samsung Galaxy A54 128GB - RAM 6GB',
      price: 2300,
      img: 'asset:phones/samsung-a54-128-6-black-back.jpg',
      images: [
        'asset:phones/samsung-a54-128-6-black-back.jpg',
        'asset:phones/samsung-a54-128-6-black-angle.jpg',
        'asset:phones/samsung-a54-128-6-black-front.jpg'
      ],
      condition: 'متوفر',
      quantity: 1,
      summary: 'أسود • 128GB • RAM 6GB',
      desc: 'Samsung Galaxy A54 باللون الأسود، بسعة 128GB وذاكرة RAM 6GB.'
    }
  ];

  const LATEST_INVENTORY_PRODUCTS = [
    {
      id: 'phone-honor-10-lite-128-6-blue-20261027',
      brand: 'honor',
      model: '10 Lite',
      storage: '128GB',
      ram: '6GB',
      name: 'HONOR 10 Lite 128GB - أزرق',
      price: 1000,
      img: 'asset:phones/honor-10-lite-128-6-blue-back.jpg',
      images: [
        'asset:phones/honor-10-lite-128-6-blue-back.jpg',
        'asset:phones/honor-10-lite-128-6-blue-angle.jpg',
        'asset:phones/honor-10-lite-128-6-blue-front.jpg'
      ],
      condition: 'متوفر',
      quantity: 1,
      summary: 'أزرق • 128GB • RAM 6GB',
      desc: 'HONOR 10 Lite باللون الأزرق، بسعة 128GB وذاكرة RAM 6GB.'
    },
    {
      id: 'phone-honor-20-lite-256-8-blue-20261027',
      brand: 'honor',
      model: '20 Lite',
      storage: '256GB',
      ram: '8GB',
      name: 'HONOR 20 Lite 256GB - أزرق',
      price: 1500,
      img: 'asset:phones/honor-20-lite-256-8-blue-back.jpg',
      images: [
        'asset:phones/honor-20-lite-256-8-blue-back.jpg',
        'asset:phones/honor-20-lite-256-8-blue-angle.jpg',
        'asset:phones/honor-20-lite-256-8-blue-front.jpg'
      ],
      condition: 'متوفر',
      quantity: 1,
      summary: 'أزرق • 256GB • RAM 8GB',
      desc: 'HONOR 20 Lite باللون الأزرق، بسعة 256GB وذاكرة RAM 8GB.'
    },
    {
      id: 'phone-redmi-note-12-128-6-blue-20261027',
      brand: 'redmi',
      model: 'Note 12',
      storage: '128GB',
      ram: '6GB',
      name: 'Redmi Note 12 128GB - أزرق',
      price: 1500,
      img: 'asset:phones/redmi-note-12-128-6-blue-back.jpg',
      images: [
        'asset:phones/redmi-note-12-128-6-blue-back.jpg',
        'asset:phones/redmi-note-12-128-6-blue-angle.jpg',
        'asset:phones/redmi-note-12-128-6-blue-front.jpg'
      ],
      condition: 'متوفر',
      quantity: 1,
      summary: 'أزرق • 128GB • RAM 6GB',
      desc: 'Redmi Note 12 باللون الأزرق، بسعة 128GB وذاكرة RAM 6GB.'
    },
    {
      id: 'phone-samsung-s20-plus-128-8-black-20261027',
      brand: 'samsung',
      model: 'Galaxy S20 Plus',
      storage: '128GB',
      ram: '8GB',
      name: 'Samsung Galaxy S20+ 128GB - أسود',
      price: 1900,
      img: 'asset:phones/samsung-s20-plus-128-8-black-back.jpg',
      images: [
        'asset:phones/samsung-s20-plus-128-8-black-back.jpg',
        'asset:phones/samsung-s20-plus-128-8-black-angle.jpg',
        'asset:phones/samsung-s20-plus-128-8-black-front.jpg'
      ],
      condition: 'متوفر',
      quantity: 1,
      summary: 'أسود • 128GB • RAM 8GB',
      desc: 'Samsung Galaxy S20+ باللون الأسود، بسعة 128GB وذاكرة RAM 8GB.'
    },
    {
      id: 'phone-samsung-s21-128-8-gray-20261027',
      brand: 'samsung',
      model: 'Galaxy S21',
      storage: '128GB',
      ram: '8GB',
      name: 'Samsung Galaxy S21 128GB - رمادي',
      price: 2200,
      img: 'asset:phones/samsung-s21-128-8-gray-back.jpg',
      images: [
        'asset:phones/samsung-s21-128-8-gray-back.jpg',
        'asset:phones/samsung-s21-128-8-gray-angle.jpg',
        'asset:phones/samsung-s21-128-8-gray-front.jpg'
      ],
      condition: 'متوفر',
      quantity: 1,
      summary: 'رمادي • 128GB • RAM 8GB',
      desc: 'Samsung Galaxy S21 باللون الرمادي، بسعة 128GB وذاكرة RAM 8GB.'
    },
    {
      id: 'phone-xiaomi-11-lite-128-8-black-20261027',
      brand: 'xiaomi',
      model: '11 Lite',
      storage: '128GB',
      ram: '8GB',
      name: 'Xiaomi 11 Lite 128GB - أسود',
      price: 1700,
      img: 'asset:phones/xiaomi-11-lite-128-8-black-back.jpg',
      images: [
        'asset:phones/xiaomi-11-lite-128-8-black-back.jpg',
        'asset:phones/xiaomi-11-lite-128-8-black-angle.jpg',
        'asset:phones/xiaomi-11-lite-128-8-black-front.jpg'
      ],
      condition: 'متوفر',
      quantity: 1,
      summary: 'أسود • 128GB • RAM 8GB',
      desc: 'Xiaomi 11 Lite باللون الأسود، بسعة 128GB وذاكرة RAM 8GB.'
    },
    {
      id: 'phone-poco-256-8-20261027',
      brand: 'poco',
      model: 'POCO',
      storage: '256GB',
      ram: '8GB',
      name: 'POCO 256GB - RAM 8GB',
      price: 2200,
      img: 'asset:phones/poco-256-8-marble-back.jpg',
      images: [
        'asset:phones/poco-256-8-marble-back.jpg',
        'asset:phones/poco-256-8-marble-angle.jpg',
        'asset:phones/poco-256-8-marble-front.jpg'
      ],
      condition: 'متوفر',
      quantity: 1,
      summary: '256GB • RAM 8GB • لون فاتح',
      desc: 'هاتف POCO بسعة 256GB وذاكرة RAM 8GB، بلون فاتح حسب الصور. الموديل المحدد غير مذكور.'
    }
  ];

  const STOCK_PHONE_PRODUCTS = [
    {
      id: 'stock-iphone-13-256-blue-76',
      brand: 'iphone',
      model: '13 Normal',
      storage: '256GB',
      name: 'iPhone 13 256GB - Blue',
      price: null,
      img: 'asset:phones/stock-iphone-13-256-blue-76-1.jpg',
      images: [
        'asset:phones/stock-iphone-13-256-blue-76-1.jpg',
        'asset:phones/stock-iphone-13-256-blue-76-2.jpg',
        'asset:phones/stock-iphone-13-256-blue-76-3.jpg'
      ],
      condition: 'متوفر',
      quantity: 1,
      summary: 'أزرق • 256GB • صحة البطارية 76% حسب اسم المجلد',
      desc: 'iPhone 13 باللون الأزرق وسعة 256GB. شاشة Super Retina XDR OLED بقياس 6.1 بوصة، ومعالج A15 Bionic، وكاميرا خلفية مزدوجة 12MP. نسبة البطارية 76% حسب اسم المجلد، يرجى تأكيدها من إعدادات الهاتف. الحالة والملحقات خاصها تأكيد مباشر.'
    },
    {
      id: 'stock-iphone-13-pro-128-silver-88',
      brand: 'iphone',
      model: '13 Pro',
      storage: '128GB',
      name: 'iPhone 13 Pro 128GB - Silver',
      price: null,
      img: 'asset:phones/stock-iphone-13-pro-128-silver-88-1.jpg',
      images: [
        'asset:phones/stock-iphone-13-pro-128-silver-88-1.jpg',
        'asset:phones/stock-iphone-13-pro-128-silver-88-2.jpg',
        'asset:phones/stock-iphone-13-pro-128-silver-88-3.jpg'
      ],
      condition: 'متوفر',
      quantity: 1,
      summary: 'Silver • 128GB • صحة البطارية 88% حسب اسم المجلد',
      desc: 'iPhone 13 Pro بسعة 128GB ولون Silver حسب الصور. شاشة Super Retina XDR بقياس 6.1 بوصة مع ProMotion حتى 120Hz، ومعالج A15 Bionic، وثلاث كاميرات خلفية Pro. نسبة البطارية 88% حسب اسم المجلد، يرجى تأكيدها من إعدادات الهاتف. الحالة والملحقات خاصها تأكيد مباشر.'
    },
    {
      id: 'stock-iphone-13-pro-max-128-sierra-blue-94',
      brand: 'iphone',
      model: '13 Pro Max',
      storage: '128GB',
      name: 'iPhone 13 Pro Max 128GB - Sierra Blue',
      price: null,
      img: 'asset:phones/stock-iphone-13-pro-max-128-sierra-blue-94-1.jpg',
      images: [
        'asset:phones/stock-iphone-13-pro-max-128-sierra-blue-94-1.jpg',
        'asset:phones/stock-iphone-13-pro-max-128-sierra-blue-94-2.jpg',
        'asset:phones/stock-iphone-13-pro-max-128-sierra-blue-94-3.jpg'
      ],
      condition: 'متوفر',
      quantity: 1,
      summary: 'Sierra Blue • 128GB • صحة البطارية 94% حسب اسم المجلد',
      desc: 'iPhone 13 Pro Max بسعة 128GB ولون Sierra Blue حسب الصور. شاشة Super Retina XDR بقياس 6.7 بوصة مع ProMotion حتى 120Hz، ومعالج A15 Bionic، وثلاث كاميرات خلفية Pro. نسبة البطارية 94% حسب اسم المجلد، يرجى تأكيدها من إعدادات الهاتف. الحالة والملحقات خاصها تأكيد مباشر.'
    },
    {
      id: 'stock-iphone-14-pro-128-gold-91',
      brand: 'iphone',
      model: '14 Pro',
      storage: '128GB',
      name: 'iPhone 14 Pro 128GB - Gold',
      price: null,
      img: 'asset:phones/stock-iphone-14-pro-128-gold-91-1.jpg',
      images: [
        'asset:phones/stock-iphone-14-pro-128-gold-91-1.jpg',
        'asset:phones/stock-iphone-14-pro-128-gold-91-2.jpg',
        'asset:phones/stock-iphone-14-pro-128-gold-91-3.jpg'
      ],
      condition: 'متوفر',
      quantity: 1,
      summary: 'ذهبي • 128GB • صحة البطارية 91% حسب اسم المجلد',
      desc: 'iPhone 14 Pro بسعة 128GB ولون ذهبي حسب الصور. شاشة Super Retina XDR بقياس 6.1 بوصة مع ProMotion حتى 120Hz وDynamic Island، ومعالج A16 Bionic، وكاميرا رئيسية 48MP. نسبة البطارية 91% حسب اسم المجلد، يرجى تأكيدها من إعدادات الهاتف. الحالة والملحقات خاصها تأكيد مباشر.'
    },
    {
      id: 'stock-iphone-14-pro-128-silver-91',
      brand: 'iphone',
      model: '14 Pro',
      storage: '128GB',
      name: 'iPhone 14 Pro 128GB - Silver',
      price: null,
      img: 'asset:phones/stock-iphone-14-pro-128-silver-91-1.jpg',
      images: [
        'asset:phones/stock-iphone-14-pro-128-silver-91-1.jpg',
        'asset:phones/stock-iphone-14-pro-128-silver-91-2.jpg',
        'asset:phones/stock-iphone-14-pro-128-silver-91-3.jpg'
      ],
      condition: 'متوفر',
      quantity: 1,
      summary: 'فضي/أبيض حسب الصور • 128GB • بطارية 91% حسب اسم المجلد',
      desc: 'iPhone 14 Pro بسعة 128GB؛ الصور المحددة لهذا الهاتف تظهر لونا فضيا/أبيض. شاشة Super Retina XDR بقياس 6.1 بوصة مع ProMotion حتى 120Hz وDynamic Island، ومعالج A16 Bionic، وكاميرا رئيسية 48MP. نسبة البطارية 91% حسب اسم المجلد، يرجى تأكيدها من إعدادات الهاتف. الحالة والملحقات خاصها تأكيد مباشر.'
    },
    {
      id: 'stock-iphone-14-pro-128-gold-91-2',
      brand: 'iphone',
      model: '14 Pro',
      storage: '128GB',
      name: 'iPhone 14 Pro 128GB - Gold (2)',
      price: null,
      img: 'asset:phones/stock-iphone-14-pro-128-gold-91-2-1.jpg',
      images: [
        'asset:phones/stock-iphone-14-pro-128-gold-91-2-1.jpg',
        'asset:phones/stock-iphone-14-pro-128-gold-91-2-2.jpg',
        'asset:phones/stock-iphone-14-pro-128-gold-91-2-3.jpg'
      ],
      condition: 'متوفر',
      quantity: 1,
      summary: 'ذهبي/فاتح حسب الصور • 128GB • بطارية 91% حسب اسم المجلد',
      desc: 'iPhone 14 Pro بسعة 128GB؛ الصور المحددة لهذا الهاتف تظهر لونا ذهبيا/فاتحا. شاشة Super Retina XDR بقياس 6.1 بوصة مع ProMotion حتى 120Hz وDynamic Island، ومعالج A16 Bionic، وكاميرا رئيسية 48MP. نسبة البطارية 91% حسب اسم المجلد، يرجى تأكيدها من إعدادات الهاتف. الحالة والملحقات خاصها تأكيد مباشر.'
    },
    {
      id: 'stock-iphone-15-pro-128-gray-93',
      brand: 'iphone',
      model: '15 Pro',
      storage: '128GB',
      name: 'iPhone 15 Pro 128GB - Gray (تأكيد الطراز)',
      price: null,
      img: 'asset:phones/stock-iphone-15-pro-128-gray-93-1.jpg',
      images: [
        'asset:phones/stock-iphone-15-pro-128-gray-93-1.jpg',
        'asset:phones/stock-iphone-15-pro-128-gray-93-2.jpg',
        'asset:phones/stock-iphone-15-pro-128-gray-93-3.jpg'
      ],
      condition: 'تأكيد الطراز',
      quantity: 1,
      summary: 'رمادي/داكن • صور ثلاث كاميرات؛ تأكد من الطراز والبطارية',
      desc: 'الصور كتبيّن iPhone بثلاث كاميرات خلفية ومنفذ USB-C، وهادشي كيشير غالبا إلى iPhone 15 Pro، بينما اسم المجلد كايقول iPhone 15 العادي. تأكد من اسم الطراز والسعة وصحة البطارية من Settings > General > About قبل نشر الإعلان. إذا تأكد أنه iPhone 15 Pro 128GB، فمواصفاته تشمل شاشة 6.1 بوصة ProMotion حتى 120Hz ومعالج A17 Pro.'
    },
    {
      id: 'stock-iphone-16-pro-256-dark-76',
      brand: 'iphone',
      model: '16 Pro',
      storage: '256GB',
      name: 'iPhone 16 Pro 256GB - Dark Titanium',
      price: null,
      img: 'asset:phones/stock-iphone-16-pro-256-dark-76-1.jpg',
      images: [
        'asset:phones/stock-iphone-16-pro-256-dark-76-1.jpg',
        'asset:phones/stock-iphone-16-pro-256-dark-76-2.jpg',
        'asset:phones/stock-iphone-16-pro-256-dark-76-3.jpg',
        'asset:phones/stock-iphone-16-pro-256-dark-76-4.jpg'
      ],
      condition: 'متوفر',
      quantity: 1,
      summary: 'لون داكن حسب الصور • 256GB • بطارية 76% حسب اسم المجلد',
      desc: 'iPhone 16 Pro بسعة 256GB؛ الصور تظهر لونا داكنا. شاشة Super Retina XDR بقياس 6.3 بوصة مع ProMotion حتى 120Hz، ومعالج A18 Pro، ونظام كاميرات Pro مع زر Camera Control ومنفذ USB-C. نسبة البطارية 76% حسب اسم المجلد، يرجى تأكيدها من إعدادات الهاتف. تحقق من الاسم الدقيق للون والحالة والملحقات.'
    },
    {
      id: 'stock-iphone-16-pro-256-desert-87',
      brand: 'iphone',
      model: '16 Pro',
      storage: '256GB',
      name: 'iPhone 16 Pro 256GB - Desert Titanium',
      price: null,
      img: 'asset:phones/stock-iphone-16-pro-256-desert-87-1.jpg',
      images: [
        'asset:phones/stock-iphone-16-pro-256-desert-87-1.jpg',
        'asset:phones/stock-iphone-16-pro-256-desert-87-2.jpg',
        'asset:phones/stock-iphone-16-pro-256-desert-87-3.jpg'
      ],
      condition: 'متوفر',
      quantity: 1,
      summary: 'Desert Titanium • 256GB • بطارية 87% حسب اسم المجلد',
      desc: 'iPhone 16 Pro بسعة 256GB ولون Desert Titanium حسب اسم المجلد والصور. شاشة Super Retina XDR بقياس 6.3 بوصة مع ProMotion حتى 120Hz، ومعالج A18 Pro، ونظام كاميرات Pro مع زر Camera Control ومنفذ USB-C. نسبة البطارية 87% حسب اسم المجلد، يرجى تأكيدها من إعدادات الهاتف. الحالة والملحقات خاصها تأكيد مباشر.'
    },
    {
      id: 'stock-samsung-s26-ultra-512-white-12',
      brand: 'samsung',
      model: 'Galaxy S26 Ultra',
      storage: '512GB',
      ram: '12GB',
      name: 'Samsung Galaxy S26 Ultra 512GB - White/Silver',
      price: null,
      img: 'asset:phones/stock-samsung-s26-ultra-512-white-12-1.jpg',
      images: [
        'asset:phones/stock-samsung-s26-ultra-512-white-12-1.jpg',
        'asset:phones/stock-samsung-s26-ultra-512-white-12-2.jpg',
        'asset:phones/stock-samsung-s26-ultra-512-white-12-3.jpg'
      ],
      condition: 'تأكيد الطراز',
      quantity: 1,
      summary: '512GB • RAM 12GB حسب اسم المجلد • قلم ظاهر فالصور',
      desc: 'Samsung Galaxy من فئة Ultra بلون أبيض/فضي حسب الصور. السعة 512GB وذاكرة RAM 12GB حسب اسم المجلد. قلم S Pen ظاهر فالصور، خاص التأكد واش داخل مع الجهاز. تحقق من رقم الطراز والسعة والذاكرة من Settings > About phone قبل النشر؛ ما يمكنش تأكيد اسم S26 Ultra من الصور بوحدها.'
    },
    {
      id: 'stock-samsung-s26-ultra-256-black-12',
      brand: 'samsung',
      model: 'Galaxy S26 Ultra',
      storage: '256GB',
      ram: '12GB',
      name: 'Samsung Galaxy S26 Ultra 256GB - Black',
      price: null,
      img: 'asset:phones/stock-samsung-s26-ultra-256-black-12-1.jpg',
      images: [
        'asset:phones/stock-samsung-s26-ultra-256-black-12-1.jpg',
        'asset:phones/stock-samsung-s26-ultra-256-black-12-2.jpg',
        'asset:phones/stock-samsung-s26-ultra-256-black-12-3.jpg'
      ],
      condition: 'تأكيد الطراز',
      quantity: 1,
      summary: '256GB • RAM 12GB حسب اسم المجلد • قلم ظاهر فالصور',
      desc: 'Samsung Galaxy من فئة Ultra بلون أسود حسب الصور. السعة 256GB وذاكرة RAM 12GB حسب اسم المجلد. قلم S Pen ظاهر فالصور، خاص التأكد واش داخل مع الجهاز. تحقق من رقم الطراز والسعة والذاكرة من Settings > About phone قبل النشر؛ ما يمكنش تأكيد اسم S26 Ultra من الصور بوحدها.'
    },
    {
      id: 'stock-samsung-s21-plus-128-silver-8',
      brand: 'samsung',
      model: 'Galaxy S21+ 5G',
      storage: '128GB',
      ram: '8GB',
      name: 'Samsung Galaxy S21+ 5G 128GB - Phantom Silver',
      price: null,
      img: 'asset:phones/stock-samsung-s21-plus-128-silver-8-1.jpg',
      images: [
        'asset:phones/stock-samsung-s21-plus-128-silver-8-1.jpg',
        'asset:phones/stock-samsung-s21-plus-128-silver-8-2.jpg',
        'asset:phones/stock-samsung-s21-plus-128-silver-8-3.jpg'
      ],
      condition: 'متوفر',
      quantity: 1,
      summary: 'Phantom Silver • 128GB • RAM 8GB حسب اسم المجلد',
      desc: 'Samsung Galaxy S21+ 5G بسعة 128GB وذاكرة RAM 8GB حسب اسم المجلد، بلون Phantom Silver حسب الصور. شاشة Dynamic AMOLED 2X بقياس 6.7 بوصة وتردد حتى 120Hz وكاميرات خلفية ثلاثية. تحقق من رقم الطراز والمعالج وحالة الهاتف والملحقات قبل النشر.'
    },
    {
      id: 'stock-samsung-s24-256-gray-8',
      brand: 'samsung',
      model: 'Galaxy S24 5G',
      storage: '256GB',
      ram: '8GB',
      name: 'Samsung Galaxy S24 5G 256GB - Gray',
      price: null,
      img: 'asset:phones/stock-samsung-s24-256-gray-8-1.jpg',
      images: [
        'asset:phones/stock-samsung-s24-256-gray-8-1.jpg',
        'asset:phones/stock-samsung-s24-256-gray-8-2.jpg',
        'asset:phones/stock-samsung-s24-256-gray-8-3.jpg'
      ],
      condition: 'متوفر',
      quantity: 1,
      summary: 'رمادي • 256GB • RAM 8GB حسب اسم المجلد',
      desc: 'Samsung Galaxy S24 5G بسعة 256GB وذاكرة RAM 8GB حسب اسم المجلد، بلون رمادي حسب الصور. شاشة Dynamic AMOLED 2X بقياس 6.2 بوصة وتردد متكيف حتى 120Hz، وكاميرات خلفية ثلاثية. المعالج كيختلف حسب نسخة الجهاز والمنطقة؛ تحقق من رقم الطراز وحالة الهاتف والملحقات قبل النشر.'
    }
  ];

  const STOCK_PHONE_REPLACEMENTS = {
    'stock-iphone-13-256-blue-76': 'featured-iphone-13-256-blue',
    'stock-iphone-13-pro-128-silver-88': 'featured-iphone-13-pro-128-silver',
    'stock-iphone-13-pro-max-128-sierra-blue-94': 'featured-iphone-13-pro-max-128-sierra-blue',
    'stock-iphone-14-pro-128-gold-91': 'featured-iphone-14-pro-128-gold',
    'stock-iphone-14-pro-128-silver-91': 'featured-iphone-14-pro-128-white-gold',
    'stock-iphone-16-pro-256-desert-87': 'featured-iphone-16-pro-256-desert-titanium-87',
    'stock-samsung-s26-ultra-512-white-12': 'featured-samsung-s26-ultra-512-white-silver',
    'stock-samsung-s26-ultra-256-black-12': 'featured-samsung-s26-ultra-256-black',
    'stock-samsung-s21-plus-128-silver-8': 'featured-samsung-galaxy-s21-plus-128-silver',
    'stock-samsung-s24-256-gray-8': 'featured-samsung-galaxy-s24-256-marble-gray'
  };

  const ADDITIONAL_STOCK_PHONES = [
    { slug: 'a15-256-8', brand: 'samsung', model: 'Galaxy A15', storage: '256GB', ram: '8GB', name: 'Samsung Galaxy A15 256GB - RAM 8GB', summary: '256GB • RAM 8GB حسب اسم المجلد', note: 'السعة والذاكرة حسب اسم المجلد؛ تأكد من نسخة 4G أو 5G ورقم الطراز.' },
    { slug: 'a55', brand: 'samsung', model: 'Galaxy A55', name: 'Samsung Galaxy A55', summary: 'موديل A55 حسب اسم المجلد', note: 'تحقق من السعة والذاكرة ورقم الطراز.' },
    { slug: 'honor-10-lite', brand: 'honor', model: '10 Lite', name: 'HONOR 10 Lite', summary: 'موديل 10 Lite حسب اسم المجلد', note: 'تحقق من السعة والذاكرة ورقم الطراز.' },
    { slug: 'honor-20-lite', brand: 'honor', model: '20 Lite', name: 'HONOR 20 Lite', summary: 'موديل 20 Lite حسب اسم المجلد', note: 'تحقق من السعة والذاكرة ورقم الطراز.' },
    { slug: 'honor-x9b', brand: 'honor', model: 'X9b', name: 'HONOR X9b', summary: 'موديل X9b حسب اسم المجلد', note: 'تحقق من السعة والذاكرة ورقم الطراز.' },
    { slug: 'infinix', brand: 'infinix', model: '', name: 'Infinix - تحديد الموديل مطلوب', summary: 'هاتف Infinix؛ الموديل ما تحددش فاسم المجلد', note: 'حدد الموديل والسعة والذاكرة من إعدادات الهاتف قبل النشر.' },
    { slug: 'infinix-x6525', brand: 'infinix', model: 'X6525', name: 'Infinix X6525', summary: 'رقم X6525 حسب اسم المجلد', note: 'تحقق من الاسم التجاري والسعة والذاكرة من إعدادات الهاتف.' },
    { slug: 'iphone', brand: 'iphone', model: '', name: 'Apple iPhone - تحديد الموديل مطلوب', summary: 'هاتف iPhone؛ الموديل والسعة غير محددين', note: 'حدد الموديل والسعة من Settings > General > About قبل النشر.' },
    { slug: 'iphone-12-pro-max', brand: 'iphone', model: '12 Pro Max', name: 'iPhone 12 Pro Max', summary: 'موديل 12 Pro Max حسب اسم المجلد', note: 'تحقق من السعة وصحة البطارية من إعدادات الهاتف.' },
    { slug: 'iphone-13-bleu', brand: 'iphone', model: '13 Normal', name: 'iPhone 13 - Blue (السعة قيد التأكيد)', summary: 'iPhone 13 أزرق حسب اسم المجلد؛ السعة غير محددة', note: 'تحقق من السعة وصحة البطارية. تأكد أنه جهاز مستقل عن iPhone 13 الأزرق الموجود سابقا فالستور.' },
    { slug: 'iphone-17-pro-max', brand: 'iphone', model: '17 Pro Max', name: 'iPhone 17 Pro Max (تأكيد الطراز)', summary: 'اسم الموديل حسب اسم المجلد؛ خاص التأكيد من إعدادات الجهاز', note: 'أكد الموديل والسعة ورقم الجهاز من Settings > General > About قبل النشر.' , imageCount: 4 },
    { slug: 'oppo', brand: 'oppo', model: '', name: 'OPPO - تحديد الموديل مطلوب', summary: 'هاتف OPPO؛ الموديل ما تحددش فاسم المجلد', note: 'حدد الموديل والسعة والذاكرة من إعدادات الهاتف قبل النشر.' },
    { slug: 'oppo-a17-k', brand: 'oppo', model: 'A17k', name: 'OPPO A17k', summary: 'موديل A17k حسب اسم المجلد', note: 'تحقق من السعة والذاكرة ورقم الطراز.' },
    { slug: 'poco', brand: 'poco', model: '', name: 'POCO - تحديد الموديل مطلوب', summary: 'هاتف POCO؛ الموديل ما تحددش فاسم المجلد', note: 'حدد الموديل والسعة والذاكرة من إعدادات الهاتف قبل النشر.' },
    { slug: 'redmi-not-12', brand: 'redmi', model: 'Note 12', name: 'Xiaomi Redmi Note 12 (تأكيد النسخة)', summary: 'Redmi Note 12 حسب اسم المجلد', note: 'تحقق واش النسخة 4G أو 5G، والسعة والذاكرة من إعدادات الهاتف.' },
    { slug: 'redmi-not-13-pro', brand: 'redmi', model: 'Note 13 Pro', name: 'Xiaomi Redmi Note 13 Pro (تأكيد النسخة)', summary: 'Redmi Note 13 Pro حسب اسم المجلد', note: 'تحقق واش النسخة 4G أو 5G، والسعة والذاكرة من إعدادات الهاتف.' },
    { slug: 's20', brand: 'samsung', model: 'Galaxy S20+', name: 'Samsung Galaxy S20+', summary: 'موديل S20+ حسب اسم المجلد', note: 'تحقق من السعة والذاكرة ورقم الطراز.' },
    { slug: 's21-128gb', brand: 'samsung', model: 'Galaxy S21', storage: '128GB', name: 'Samsung Galaxy S21 128GB', summary: '128GB حسب اسم المجلد', note: 'تحقق من رقم الطراز والذاكرة وحالة الهاتف.' },
    { slug: 'samsang-a54-128-6', brand: 'samsung', model: 'Galaxy A54', storage: '128GB', ram: '6GB', name: 'Samsung Galaxy A54 128GB - RAM 6GB', summary: '128GB • RAM 6GB حسب اسم المجلد', note: 'السعة والذاكرة حسب اسم المجلد؛ تحقق منهما من إعدادات الهاتف.' },
    { slug: 'smsang', brand: 'samsung', model: '', name: 'Samsung - تحديد الموديل مطلوب', summary: 'هاتف Samsung؛ الموديل ما تحددش فاسم المجلد', note: 'حدد الموديل والسعة والذاكرة من إعدادات الهاتف قبل النشر.' },
    { slug: 'smsng-a-36', brand: 'samsung', model: 'Galaxy A36', name: 'Samsung Galaxy A36', summary: 'موديل A36 حسب اسم المجلد', note: 'تحقق من السعة والذاكرة ورقم الطراز.' },
    { slug: 'smsng-a13', brand: 'samsung', model: 'Galaxy A13', name: 'Samsung Galaxy A13', summary: 'موديل A13 حسب اسم المجلد', note: 'تحقق من السعة والذاكرة ورقم الطراز.' },
    { slug: 'smsng-a14', brand: 'samsung', model: 'Galaxy A14', name: 'Samsung Galaxy A14', summary: 'موديل A14 حسب اسم المجلد', note: 'تحقق من السعة والذاكرة واش النسخة 4G أو 5G.' },
    { slug: 'smsng-a52', brand: 'samsung', model: 'Galaxy A52', name: 'Samsung Galaxy A52', summary: 'موديل A52 حسب اسم المجلد', note: 'تحقق من السعة والذاكرة ورقم الطراز.' },
    { slug: 'smsng-pink', brand: 'samsung', model: '', name: 'Samsung - Pink (تحديد الموديل مطلوب)', summary: 'هاتف Samsung؛ اللون الوردي حسب اسم المجلد، والموديل غير محدد', note: 'حدد الموديل والسعة والذاكرة من إعدادات الهاتف قبل النشر.' },
    { slug: 'smsng-s21-fe', brand: 'samsung', model: 'Galaxy S21 FE', name: 'Samsung Galaxy S21 FE', summary: 'موديل S21 FE حسب اسم المجلد', note: 'تحقق من السعة والذاكرة ورقم الطراز.' },
    { slug: 'vivo', brand: 'vivo', model: '', name: 'vivo - تحديد الموديل مطلوب', summary: 'هاتف vivo؛ الموديل ما تحددش فاسم المجلد', note: 'حدد الموديل والسعة والذاكرة من إعدادات الهاتف قبل النشر.' },
    { slug: 'vivo-5g', brand: 'vivo', model: '', name: 'vivo 5G - تحديد الموديل مطلوب', summary: 'مجلد vivo 5G ما فيه حتى صورة؛ الموديل غير محدد', note: 'زيد صور الهاتف وحدد الموديل والسعة والذاكرة قبل عرض المنتج.' , imageCount: 0 },
    { slug: 'xiomi-11-lite-5g', brand: 'xiaomi', model: '11 Lite 5G', name: 'Xiaomi 11 Lite 5G', summary: 'موديل 11 Lite 5G حسب اسم المجلد', note: 'تحقق من نسخة الجهاز والسعة والذاكرة من الإعدادات.' },
    { slug: 'xr-64-85', brand: 'iphone', model: 'XR', storage: '64GB', name: 'iPhone XR 64GB', summary: '64GB • صحة البطارية 85% حسب اسم المجلد', note: 'تحقق من السعة وصحة البطارية من إعدادات الهاتف قبل النشر.' }
  ];

  const ADDITIONAL_STOCK_PHONE_PRODUCTS = ADDITIONAL_STOCK_PHONES.map(phone => {
    const imageCount = phone.imageCount === undefined ? 3 : phone.imageCount;
    const imagePrefix = `asset:phones/stock2-${phone.slug}`;
    const images = Array.from({ length: imageCount }, (_, index) => `${imagePrefix}-${index + 1}.jpg`);
    const specifications = [
      phone.model ? `الموديل: ${phone.model}.` : 'الموديل: خاصو التأكيد من الجهاز.',
      phone.storage ? `السعة: ${phone.storage}.` : '',
      phone.ram ? `الذاكرة: ${phone.ram}.` : ''
    ].filter(Boolean).join(' ');
    return {
      id: `additional-stock-${phone.slug}`,
      brand: phone.brand,
      model: phone.model || phone.name,
      ...(phone.storage ? { storage: phone.storage } : {}),
      ...(phone.ram ? { ram: phone.ram } : {}),
      name: phone.name,
      price: null,
      img: images[0] || '',
      images,
      condition: phone.model ? 'متوفر' : 'تأكيد الطراز',
      quantity: 1,
      summary: phone.summary,
      desc: `${phone.name}. ${specifications} ${phone.note} الحالة والملحقات خاصها تأكيد مباشر قبل النشر.`
    };
  });

  const PRICED_SEED_PRODUCTS = [
    ...FEATURED_PRODUCTS,
    ...NEW_PHONE_PRODUCTS,
    IPHONE_13_PRO_PRODUCT,
    IPHONE_14_PRO_GOLD_PRODUCT,
    IPHONE_16_PRO_256_87_PRODUCT,
    IPHONE_16_PRO_256_76_PRODUCT,
    ...SAMSUNG_S26_ULTRA_PRODUCTS,
    ...MORE_PHONE_PRODUCTS,
    ...NEW_INVENTORY_PRODUCTS,
    ...MORE_NEW_INVENTORY_PRODUCTS,
    ...LATEST_INVENTORY_PRODUCTS
  ];

  function applyPhonePriceRule(products) {
    return products.map(product => {
      const price = Number(product.price);
      if (!Number.isSafeInteger(price) || price <= 0 || price % 100 !== 0) return product;

      const salePrice = price - 1;
      const desc = typeof product.desc === 'string'
        ? product.desc.replace(/\s*السعر:\s*[\d,]+\s*درهم\.?/g, '')
        : product.desc;
      return {
        ...product,
        price: salePrice,
        oldPrice: Math.round(salePrice * 1.1),
        desc
      };
    });
  }

  if (!localStorage.getItem(CATALOG_RESET_KEY)) {
    localStorage.setItem(KEY, '[]');
    localStorage.setItem('electrophone_products', '[]');
    localStorage.setItem('electrophone_accessories', '[]');
    localStorage.setItem(CATALOG_RESET_KEY, 'true');
  }

  if (!localStorage.getItem(CATALOG_SEED_KEY)) {
    const savedProducts = localStorage.getItem(KEY);
    const products = savedProducts === null ? [] : JSON.parse(savedProducts);
    if (!Array.isArray(products) || products.some(product => !product || typeof product !== 'object')) {
      throw new Error('بيانات المنتجات المخزنة غير صالحة.');
    }
    const existingIds = new Set(products.map(product => String(product.id)));
    const newProducts = FEATURED_PRODUCTS.filter(product => !existingIds.has(String(product.id)));
    if (newProducts.length) saveProducts([...newProducts, ...products]);
    localStorage.setItem(CATALOG_SEED_KEY, 'true');
  }

  if (!localStorage.getItem(NEW_PHONES_SEED_KEY)) {
    const products = getProducts();
    const existingIds = new Set(products.map(product => String(product.id)));
    const newProducts = NEW_PHONE_PRODUCTS.filter(product => !existingIds.has(String(product.id)));
    if (newProducts.length) saveProducts([...newProducts, ...products]);
    localStorage.setItem(NEW_PHONES_SEED_KEY, 'true');
  }

  if (!localStorage.getItem(IPHONE_13_PRO_SEED_KEY)) {
    const products = getProducts();
    if (!products.some(product => String(product.id) === IPHONE_13_PRO_PRODUCT.id)) {
      saveProducts([IPHONE_13_PRO_PRODUCT, ...products]);
    }
    localStorage.setItem(IPHONE_13_PRO_SEED_KEY, 'true');
  }

  if (!localStorage.getItem(IPHONE_13_PRO_PRICE_UPDATE_KEY)) {
    const products = getProducts();
    const existingProduct = products.some(product => String(product.id) === IPHONE_13_PRO_PRODUCT.id);
    const updatedProducts = existingProduct
      ? products.map(product => String(product.id) === IPHONE_13_PRO_PRODUCT.id
        ? { ...product, price: IPHONE_13_PRO_PRODUCT.price }
        : product)
      : [IPHONE_13_PRO_PRODUCT, ...products];
    saveProducts(updatedProducts);
    localStorage.setItem(IPHONE_13_PRO_PRICE_UPDATE_KEY, 'true');
  }

  if (!localStorage.getItem(IPHONE_14_PRO_GOLD_SEED_KEY)) {
    const products = getProducts();
    if (!products.some(product => String(product.id) === IPHONE_14_PRO_GOLD_PRODUCT.id)) {
      saveProducts([IPHONE_14_PRO_GOLD_PRODUCT, ...products]);
    }
    localStorage.setItem(IPHONE_14_PRO_GOLD_SEED_KEY, 'true');
  }

  if (!localStorage.getItem(IPHONE_16_PRO_256_87_SEED_KEY)) {
    const products = getProducts();
    if (!products.some(product => String(product.id) === IPHONE_16_PRO_256_87_PRODUCT.id)) {
      saveProducts([IPHONE_16_PRO_256_87_PRODUCT, ...products]);
    }
    localStorage.setItem(IPHONE_16_PRO_256_87_SEED_KEY, 'true');
  }

  if (!localStorage.getItem(IPHONE_16_PRO_256_76_SEED_KEY)) {
    const products = getProducts();
    if (!products.some(product => String(product.id) === IPHONE_16_PRO_256_76_PRODUCT.id)) {
      saveProducts([IPHONE_16_PRO_256_76_PRODUCT, ...products]);
    }
    localStorage.setItem(IPHONE_16_PRO_256_76_SEED_KEY, 'true');
  }

  if (!localStorage.getItem(SAMSUNG_S26_ULTRA_SEED_KEY)) {
    const products = getProducts();
    const existingIds = new Set(products.map(product => String(product.id)));
    const newProducts = SAMSUNG_S26_ULTRA_PRODUCTS.filter(product => !existingIds.has(String(product.id)));
    if (newProducts.length) saveProducts([...newProducts, ...products]);
    localStorage.setItem(SAMSUNG_S26_ULTRA_SEED_KEY, 'true');
  }

  if (!localStorage.getItem(MORE_PHONES_SEED_KEY)) {
    const products = getProducts();
    const existingIds = new Set(products.map(product => String(product.id)));
    const newProducts = MORE_PHONE_PRODUCTS.filter(product => !existingIds.has(String(product.id)));
    if (newProducts.length) saveProducts([...newProducts, ...products]);
    localStorage.setItem(MORE_PHONES_SEED_KEY, 'true');
  }

  if (!localStorage.getItem(STOCK_PHONES_SEED_KEY)) {
    localStorage.setItem(STOCK_PHONES_SEED_KEY, 'true');
  }

  const ADDITIONAL_STOCK_PHONES_SEED_KEY = 'electrophone_additional_stock_phones_20261027_v1';
  if (!localStorage.getItem(ADDITIONAL_STOCK_PHONES_SEED_KEY)) {
    localStorage.setItem(ADDITIONAL_STOCK_PHONES_SEED_KEY, 'true');
  }

  if (!localStorage.getItem(NEW_INVENTORY_SEED_KEY)) {
    const products = getProducts();
    const existingIds = new Set(products.map(product => String(product.id)));
    const newProducts = NEW_INVENTORY_PRODUCTS.filter(product => !existingIds.has(String(product.id)));
    if (newProducts.length) saveProducts([...newProducts, ...products]);
    localStorage.setItem(NEW_INVENTORY_SEED_KEY, 'true');
  }

  if (!localStorage.getItem(MORE_NEW_INVENTORY_SEED_KEY)) {
    const products = getProducts();
    const existingIds = new Set(products.map(product => String(product.id)));
    const newProducts = MORE_NEW_INVENTORY_PRODUCTS.filter(product => !existingIds.has(String(product.id)));
    if (newProducts.length) saveProducts([...newProducts, ...products]);
    localStorage.setItem(MORE_NEW_INVENTORY_SEED_KEY, 'true');
  }

  if (!localStorage.getItem(LATEST_INVENTORY_SEED_KEY)) {
    const products = getProducts();
    const existingIds = new Set(products.map(product => String(product.id)));
    const newProducts = LATEST_INVENTORY_PRODUCTS.filter(product => !existingIds.has(String(product.id)));
    if (newProducts.length) saveProducts([...newProducts, ...products]);
    localStorage.setItem(LATEST_INVENTORY_SEED_KEY, 'true');
  }

  if (!localStorage.getItem(POCO_INVENTORY_SEED_KEY)) {
    const products = getProducts();
    const pocoProduct = LATEST_INVENTORY_PRODUCTS.find(product => product.id === 'phone-poco-256-8-20261027');
    if (pocoProduct && !products.some(product => String(product.id) === pocoProduct.id)) {
      saveProducts([pocoProduct, ...products]);
    }
    localStorage.setItem(POCO_INVENTORY_SEED_KEY, 'true');
  }

  if (!localStorage.getItem(OPPO_A73_SEED_KEY)) {
    const products = getProducts();
    const oppoA73 = MORE_NEW_INVENTORY_PRODUCTS.find(product => product.id === 'phone-oppo-a73-128-6-20261027');
    if (oppoA73 && !products.some(product => String(product.id) === oppoA73.id)) {
      saveProducts([oppoA73, ...products]);
    }
    localStorage.setItem(OPPO_A73_SEED_KEY, 'true');
  }

  if (!localStorage.getItem(PHONE_PRICE_RULE_KEY)) {
    saveProducts(getProducts());
    localStorage.setItem(PHONE_PRICE_RULE_KEY, 'true');
  }

  if (!localStorage.getItem(FEATURED_IMAGE_UPDATE_KEY)) {
    const products = getProducts();
    const featuredProduct = products.find(product => String(product.id) === 'featured-iphone-16-pro-128');
    if (featuredProduct) {
      const primaryImage = 'asset:phones/iphone-16-pro-white-back.jpg';
      const existingImages = Array.isArray(featuredProduct.images) ? featuredProduct.images : [];
      featuredProduct.img = primaryImage;
      featuredProduct.images = [
        primaryImage,
        ...existingImages.filter(image => image !== primaryImage)
      ];
      saveProducts(products);
    }
    localStorage.setItem(FEATURED_IMAGE_UPDATE_KEY, 'true');
  }

  if (!localStorage.getItem(INVENTORY_IMAGE_UPDATE_KEY)) {
    const inventoryImages = {
      'phone-honor-magic-4-lite-5g-128-blue-8-20261027': [
        'stock2-honor-x9b-2.jpg',
        'stock2-honor-x9b-1.jpg',
        'stock2-honor-x9b-3.jpg'
      ],
      'phone-honor-10-lite-128-6-blue-20261027': [
        'stock2-honor-10-lite-2.jpg',
        'stock2-honor-10-lite-1.jpg',
        'stock2-honor-10-lite-3.jpg'
      ],
      'phone-honor-20-lite-256-8-blue-20261027': [
        'stock2-honor-20-lite-3.jpg',
        'stock2-honor-20-lite-1.jpg',
        'stock2-honor-20-lite-2.jpg'
      ],
      'phone-infinix-smart-8-128-4-20261027': [
        'stock2-infinix-x6525-3.jpg',
        'stock2-infinix-x6525-1.jpg',
        'stock2-infinix-x6525-2.jpg'
      ],
      'phone-iphone-13-128-red-92-20261027': [
        'stock2-iphone-2.jpg',
        'stock2-iphone-3.jpg',
        'stock2-iphone-1.jpg'
      ],
      'phone-oppo-a17k-64-3-20261027': [
        'stock2-oppo-a17-k-3.jpg',
        'stock2-oppo-a17-k-1.jpg',
        'stock2-oppo-a17-k-2.jpg'
      ],
      'phone-poco-256-8-20261027': [
        'stock2-poco-3.jpg',
        'stock2-poco-1.jpg',
        'stock2-poco-2.jpg'
      ],
      'phone-redmi-note-12-128-6-blue-20261027': [
        'stock2-redmi-not-12-3.jpg',
        'stock2-redmi-not-12-1.jpg',
        'stock2-redmi-not-12-2.jpg'
      ],
      'phone-samsung-a36-128-black-6-20261027': [
        'stock2-smsang-3.jpg',
        'stock2-smsang-2.jpg',
        'stock2-smsang-1.jpg'
      ],
      'phone-samsung-s21-plus-128-gray-8-20261027': [
        'stock2-smsng-s21-fe-3.jpg',
        'stock2-smsng-s21-fe-1.jpg',
        'stock2-smsng-s21-fe-2.jpg'
      ],
      'phone-samsung-a15-256-8-20261027': [
        'stock2-a15-256-8-1.jpg',
        'stock2-a15-256-8-2.jpg',
        'stock2-a15-256-8-3.jpg'
      ],
      'phone-samsung-a26-128-pink-6-20261027': [
        'stock2-smsng-pink-3.jpg',
        'stock2-smsng-pink-2.jpg',
        'stock2-smsng-pink-1.jpg'
      ],
      'phone-samsung-a36-128-blue-6-20261027': [
        'stock2-a55-3.jpg',
        'stock2-a55-2.jpg',
        'stock2-a55-1.jpg'
      ],
      'phone-samsung-a54-128-6-black-20261027': [
        'stock2-smsng-a14-3.jpg',
        'stock2-smsng-a14-1.jpg',
        'stock2-smsng-a14-2.jpg'
      ],
      'phone-samsung-s20-plus-128-8-black-20261027': [
        'stock2-s20-1.jpg',
        'stock2-s20-2.jpg',
        'stock2-s20-3.jpg'
      ],
      'phone-samsung-s21-128-8-gray-20261027': [
        'stock2-s21-128gb-1.jpg',
        'stock2-s21-128gb-3.jpg',
        'stock2-s21-128gb-2.jpg'
      ],
      'phone-vivo-5g-128-6-20261027': [
        'stock2-vivo-3.jpg',
        'stock2-vivo-1.jpg',
        'stock2-vivo-2.jpg'
      ],
      'phone-xiaomi-11-lite-128-8-black-20261027': [
        'stock2-xiomi-11-lite-5g-3.jpg',
        'stock2-xiomi-11-lite-5g-1.jpg',
        'stock2-xiomi-11-lite-5g-2.jpg'
      ]
    };
    const products = getProducts();
    let updated = false;
    const updatedProducts = products.map(product => {
      const images = inventoryImages[String(product.id)];
      if (!images) return product;

      updated = true;
      const resolvedImages = images.map(image => `asset:phones/${image}`);
      return { ...product, img: resolvedImages[0], images: resolvedImages };
    });
    if (updated) saveProducts(updatedProducts);
    localStorage.setItem(INVENTORY_IMAGE_UPDATE_KEY, 'true');
  }

  if (!localStorage.getItem(FJ_STAR_FJ_A6_SEED_KEY)) {
    const savedAccessories = localStorage.getItem('electrophone_accessories');
    const accessories = savedAccessories === null ? [] : JSON.parse(savedAccessories);
    if (!Array.isArray(accessories) || accessories.some(accessory => !accessory || typeof accessory !== 'object')) {
      throw new Error('بيانات الإكسسوارات المخزنة غير صالحة.');
    }
    if (!accessories.some(accessory => String(accessory.id) === 'accessory-fj-star-fj-a6')) {
      accessories.unshift({
        id: 'accessory-fj-star-fj-a6',
        type: 'سماعة رأس لاسلكية',
        brand: 'FJ STAR',
        model: 'FJ-A6',
        name: 'سماعة FJ STAR FJ-A6 لاسلكية مع ANC',
        price: 250,
        img: 'asset:accessories/fj-star-fj-a6-package.jpg',
        images: [
          'asset:accessories/fj-star-fj-a6-package.jpg',
          'asset:accessories/fj-star-fj-a6-headphones.jpg',
          'asset:accessories/fj-star-fj-a6-set.jpg'
        ],
        condition: 'فالعلبة الأصلية',
        quantity: 1,
        summary: 'Bluetooth 5.3 • ANC • Stereo',
        desc: 'سماعة FJ STAR FJ-A6 لاسلكية، Bluetooth 5.3، مع خاصية ANC وإلغاء الضجيج. فالعلبة الأصلية. الثمن: 250 درهم.'
      });
      localStorage.setItem('electrophone_accessories', JSON.stringify(accessories));
    }
    localStorage.setItem(FJ_STAR_FJ_A6_SEED_KEY, 'true');
  }

  if (!localStorage.getItem(JBL_980BT_SEED_KEY)) {
    const savedAccessories = localStorage.getItem('electrophone_accessories');
    const accessories = savedAccessories === null ? [] : JSON.parse(savedAccessories);
    if (!Array.isArray(accessories) || accessories.some(accessory => !accessory || typeof accessory !== 'object')) {
      throw new Error('بيانات الإكسسوارات المخزنة غير صالحة.');
    }
    if (!accessories.some(accessory => String(accessory.id) === 'accessory-jbl-everest-980bt')) {
      accessories.unshift({
        id: 'accessory-jbl-everest-980bt',
        type: 'سماعة رأس لاسلكية',
        brand: 'JBL',
        model: 'Everest 980BT',
        name: 'سماعة JBL Everest 980BT Extra Bass',
        price: 130,
        img: 'asset:accessories/jbl-everest-980bt-package.jpg',
        images: [
          'asset:accessories/jbl-everest-980bt-package.jpg',
          'asset:accessories/jbl-everest-980bt-headphones.jpg'
        ],
        condition: 'فالعلبة الأصلية',
        quantity: 1,
        summary: 'Extra Bass • Bluetooth • FM Radio • MP3',
        desc: 'سماعة رأس لاسلكية مكتوب عليها Everest 980BT وExtra Bass. حسب معلومات العلبة: Bluetooth، راديو FM، مشغل MP3، مايكروفون، ومدة تشغيل مذكورة حتى 30 ساعة. فالعلبة الأصلية.'
      });
      localStorage.setItem('electrophone_accessories', JSON.stringify(accessories));
    }
    localStorage.setItem(JBL_980BT_SEED_KEY, 'true');
  }

  if (!localStorage.getItem(AWDA_BL_A9_SEED_KEY)) {
    const savedAccessories = localStorage.getItem('electrophone_accessories');
    const accessories = savedAccessories === null ? [] : JSON.parse(savedAccessories);
    if (!Array.isArray(accessories) || accessories.some(accessory => !accessory || typeof accessory !== 'object')) {
      throw new Error('بيانات الإكسسوارات المخزنة غير صالحة.');
    }
    if (!accessories.some(accessory => String(accessory.id) === 'accessory-awda-bl-a9')) {
      accessories.unshift({
        id: 'accessory-awda-bl-a9',
        type: 'سماعة ألعاب لاسلكية',
        brand: 'AWDA',
        model: 'BL-A9',
        name: 'سماعة AWDA BL-A9 لاسلكية',
        price: 160,
        img: 'asset:accessories/awda-bl-a9-package.jpg',
        images: [
          'asset:accessories/awda-bl-a9-package.jpg',
          'asset:accessories/awda-bl-a9-headset.jpg',
          'asset:accessories/awda-bl-a9-set.jpg'
        ],
        condition: 'فالعلبة الأصلية',
        quantity: 1,
        summary: 'Wireless 6.0 • مايكروفون • Noise Reduction',
        desc: 'سماعة AWDA BL-A9 لاسلكية مع مايكروفون. حسب المعلومات الظاهرة على العلبة: Wireless 6.0، تقليل الضجيج، وميزات للموسيقى والألعاب والأفلام. فالعلبة الأصلية.'
      });
      localStorage.setItem('electrophone_accessories', JSON.stringify(accessories));
    }
    localStorage.setItem(AWDA_BL_A9_SEED_KEY, 'true');
  }

  if (!localStorage.getItem(P9_PRO_MAX_SEED_KEY)) {
    const savedAccessories = localStorage.getItem('electrophone_accessories');
    const accessories = savedAccessories === null ? [] : JSON.parse(savedAccessories);
    if (!Array.isArray(accessories) || accessories.some(accessory => !accessory || typeof accessory !== 'object')) {
      throw new Error('بيانات الإكسسوارات المخزنة غير صالحة.');
    }
    if (!accessories.some(accessory => String(accessory.id) === 'accessory-p9-pro-max-blue')) {
      accessories.unshift({
        id: 'accessory-p9-pro-max-blue',
        type: 'سماعة رأس لاسلكية',
        brand: 'P9',
        model: 'Pro Max',
        name: 'سماعة P9 Pro Max - زرقاء',
        price: 100,
        img: 'asset:accessories/p9-pro-max-blue-package.jpg',
        images: [
          'asset:accessories/p9-pro-max-blue-package.jpg',
          'asset:accessories/p9-pro-max-blue-headphones.jpg',
          'asset:accessories/p9-pro-max-blue-set.jpg'
        ],
        condition: 'فالعلبة الأصلية',
        quantity: 1,
        summary: 'لاسلكية • لون أزرق',
        desc: 'سماعة رأس P9 Pro Max لاسلكية باللون الأزرق. فالعلبة الأصلية.'
      });
      localStorage.setItem('electrophone_accessories', JSON.stringify(accessories));
    }
    localStorage.setItem(P9_PRO_MAX_SEED_KEY, 'true');
  }

  if (!localStorage.getItem(P9_PRO_MAX_WHITE_SEED_KEY)) {
    const savedAccessories = localStorage.getItem('electrophone_accessories');
    const accessories = savedAccessories === null ? [] : JSON.parse(savedAccessories);
    if (!Array.isArray(accessories) || accessories.some(accessory => !accessory || typeof accessory !== 'object')) {
      throw new Error('بيانات الإكسسوارات المخزنة غير صالحة.');
    }
    if (!accessories.some(accessory => String(accessory.id) === 'accessory-p9-pro-max-white')) {
      accessories.unshift({
        id: 'accessory-p9-pro-max-white',
        type: 'سماعة رأس لاسلكية',
        brand: 'P9',
        model: 'Pro Max',
        name: 'سماعة P9 Pro Max - بيضاء',
        price: 100,
        img: 'asset:accessories/p9-pro-max-white-package.jpg',
        images: [
          'asset:accessories/p9-pro-max-white-package.jpg',
          'asset:accessories/p9-pro-max-white-headphones.jpg',
          'asset:accessories/p9-pro-max-white-set.jpg'
        ],
        condition: 'فالعلبة الأصلية',
        quantity: 1,
        summary: 'لاسلكية • لون أبيض',
        desc: 'سماعة رأس P9 Pro Max لاسلكية باللون الأبيض. فالعلبة الأصلية.'
      });
      localStorage.setItem('electrophone_accessories', JSON.stringify(accessories));
    }
    localStorage.setItem(P9_PRO_MAX_WHITE_SEED_KEY, 'true');
  }

  if (!localStorage.getItem(CAT_EAR_VIV_23M_SEED_KEY)) {
    const savedAccessories = localStorage.getItem('electrophone_accessories');
    const accessories = savedAccessories === null ? [] : JSON.parse(savedAccessories);
    if (!Array.isArray(accessories) || accessories.some(accessory => !accessory || typeof accessory !== 'object')) {
      throw new Error('بيانات الإكسسوارات المخزنة غير صالحة.');
    }
    if (!accessories.some(accessory => String(accessory.id) === 'accessory-cat-ear-viv-23m')) {
      accessories.unshift({
        id: 'accessory-cat-ear-viv-23m',
        type: 'سماعة رأس لاسلكية مضيئة',
        brand: 'Cat Ear',
        model: 'VIV-23M',
        name: 'سماعة Cat Ear VIV-23M',
        price: 180,
        img: 'asset:accessories/cat-ear-viv-23m-package.jpg',
        images: [
          'asset:accessories/cat-ear-viv-23m-package.jpg',
          'asset:accessories/cat-ear-viv-23m-headphones.jpg',
          'asset:accessories/cat-ear-viv-23m-lifestyle.jpg'
        ],
        condition: 'فالعلبة الأصلية',
        quantity: 1,
        summary: 'لاسلكية • أذنا قط مضيئتان • Bluetooth 5.0',
        desc: 'سماعة Cat Ear لاسلكية موديل VIV-23M بأذني قط مضيئتين. العلبة كتشير إلى Bluetooth 5.0. فالعلبة الأصلية.'
      });
      localStorage.setItem('electrophone_accessories', JSON.stringify(accessories));
    }
    localStorage.setItem(CAT_EAR_VIV_23M_SEED_KEY, 'true');
  }

  if (!localStorage.getItem(SMART_CHARGER_45W_SEED_KEY)) {
    const savedAccessories = localStorage.getItem('electrophone_accessories');
    const accessories = savedAccessories === null ? [] : JSON.parse(savedAccessories);
    if (!Array.isArray(accessories) || accessories.some(accessory => !accessory || typeof accessory !== 'object')) {
      throw new Error('بيانات الإكسسوارات المخزنة غير صالحة.');
    }
    if (!accessories.some(accessory => String(accessory.id) === 'accessory-smart-charger-45w')) {
      accessories.unshift({
        id: 'accessory-smart-charger-45w',
        type: 'شاحن سريع',
        brand: 'UIRON',
        model: 'AR-31 45W',
        name: 'شاحن UIRON Smart 45W',
        price: 150,
        img: 'asset:accessories/charger-45w-smart-package.jpg',
        images: [
          'asset:accessories/charger-45w-smart-package.jpg',
          'asset:accessories/charger-45w-smart-unit.jpg'
        ],
        condition: 'فالعلبة الأصلية',
        quantity: 1,
        summary: '45W • كابل مدمج • شحن سريع',
        desc: 'شاحن UIRON Smart Charger موديل AR-31 بقدرة 45W، مع كابل مدمج. فالعلبة الأصلية.'
      });
      localStorage.setItem('electrophone_accessories', JSON.stringify(accessories));
    }
    localStorage.setItem(SMART_CHARGER_45W_SEED_KEY, 'true');
  }

  if (!localStorage.getItem(OHAYO_Q24_SEED_KEY)) {
    const savedAccessories = localStorage.getItem('electrophone_accessories');
    const accessories = savedAccessories === null ? [] : JSON.parse(savedAccessories);
    if (!Array.isArray(accessories) || accessories.some(accessory => !accessory || typeof accessory !== 'object')) {
      throw new Error('بيانات الإكسسوارات المخزنة غير صالحة.');
    }
    if (!accessories.some(accessory => String(accessory.id) === 'accessory-ohayo-oh-q24')) {
      accessories.unshift({
        id: 'accessory-ohayo-oh-q24',
        type: 'شاحن سريع',
        brand: 'OHAYO',
        model: 'OH-Q24',
        name: 'شاحن OHAYO OH-Q24',
        price: 70,
        img: 'asset:accessories/charger-ohayo-q24-package.jpg',
        images: [
          'asset:accessories/charger-ohayo-q24-package.jpg',
          'asset:accessories/charger-ohayo-q24-unit.jpg'
        ],
        condition: 'فالعلبة الأصلية',
        quantity: 1,
        summary: '18W • Quick Charge 3.0 • كابل Micro USB',
        desc: 'شاحن سريع OHAYO موديل OH-Q24 بقدرة 18W مع كابل Micro USB. فالعلبة الأصلية.'
      });
      localStorage.setItem('electrophone_accessories', JSON.stringify(accessories));
    }
    localStorage.setItem(OHAYO_Q24_SEED_KEY, 'true');
  }

  if (!localStorage.getItem(FJ_STAR_5A_CHARGER_SEED_KEY)) {
    const savedAccessories = localStorage.getItem('electrophone_accessories');
    const accessories = savedAccessories === null ? [] : JSON.parse(savedAccessories);
    if (!Array.isArray(accessories) || accessories.some(accessory => !accessory || typeof accessory !== 'object')) {
      throw new Error('بيانات الإكسسوارات المخزنة غير صالحة.');
    }
    if (!accessories.some(accessory => String(accessory.id) === 'accessory-fj-star-5a-charger')) {
      accessories.unshift({
        id: 'accessory-fj-star-5a-charger',
        type: 'شاحن سريع',
        brand: 'FJ-STAR',
        model: '5A HIGH-END FJ-01',
        name: 'شاحن FJ-STAR 5A HIGH-END',
        price: 100,
        img: 'asset:accessories/charger-fj-star-5a-package.jpg',
        images: [
          'asset:accessories/charger-fj-star-5a-package.jpg',
          'asset:accessories/charger-fj-star-5a-unit.jpg'
        ],
        condition: 'فالعلبة الأصلية',
        quantity: 1,
        summary: '5A • Intelligent IC Chip • USB-C',
        desc: 'شاحن FJ-STAR HIGH-END موديل FJ-01؛ العلبة تذكر شحناً سريعاً 5A وشريحة Intelligent IC. فالعلبة الأصلية.'
      });
      localStorage.setItem('electrophone_accessories', JSON.stringify(accessories));
    }
    localStorage.setItem(FJ_STAR_5A_CHARGER_SEED_KEY, 'true');
  }

  if (!localStorage.getItem(JAWDA_D14_CHARGER_SEED_KEY)) {
    const savedAccessories = localStorage.getItem('electrophone_accessories');
    const accessories = savedAccessories === null ? [] : JSON.parse(savedAccessories);
    if (!Array.isArray(accessories) || accessories.some(accessory => !accessory || typeof accessory !== 'object')) {
      throw new Error('بيانات الإكسسوارات المخزنة غير صالحة.');
    }
    if (!accessories.some(accessory => String(accessory.id) === 'accessory-jawda-d14-qc4')) {
      accessories.unshift({
        id: 'accessory-jawda-d14-qc4',
        type: 'شاحن سريع',
        brand: 'JAWDA',
        model: 'D-14 QC 4.0',
        name: 'شاحن JAWDA D-14 QC 4.0',
        price: 80,
        img: 'asset:accessories/charger-jawda-d14-qc4-package.jpg',
        images: [
          'asset:accessories/charger-jawda-d14-qc4-package.jpg',
          'asset:accessories/charger-jawda-d14-qc4-unit.jpg'
        ],
        condition: 'فالعلبة الأصلية',
        quantity: 1,
        summary: 'Quick Charge 4.0 • شاحن مع كابل Type-C',
        desc: 'شاحن JAWDA D-14 للشحن السريع Quick Charge 4.0، مع كابل Type-C كما هو ظاهر على العلبة. فالعلبة الأصلية.'
      });
      localStorage.setItem('electrophone_accessories', JSON.stringify(accessories));
    }
    localStorage.setItem(JAWDA_D14_CHARGER_SEED_KEY, 'true');
  }

  if (!localStorage.getItem(SAMSUNG_25W_CHARGER_SEED_KEY)) {
    const savedAccessories = localStorage.getItem('electrophone_accessories');
    const accessories = savedAccessories === null ? [] : JSON.parse(savedAccessories);
    if (!Array.isArray(accessories) || accessories.some(accessory => !accessory || typeof accessory !== 'object')) {
      throw new Error('بيانات الإكسسوارات المخزنة غير صالحة.');
    }
    if (!accessories.some(accessory => String(accessory.id) === 'accessory-samsung-25w-pd')) {
      accessories.unshift({
        id: 'accessory-samsung-25w-pd',
        type: 'شاحن سريع',
        brand: 'Samsung',
        model: '25W PD USB-C',
        name: 'شاحن Samsung 25W PD USB-C',
        price: 200,
        img: 'asset:accessories/charger-samsung-25w-package.jpg',
        images: [
          'asset:accessories/charger-samsung-25w-package.jpg',
          'asset:accessories/charger-samsung-25w-unit.jpg'
        ],
        condition: 'فالعلبة الأصلية',
        quantity: 1,
        summary: '25W • USB-C PD • Super Fast Charging',
        desc: 'شاحن Samsung 25W PD بمدخل USB-C، مع كابل USB-C كما هو ظاهر على العلبة. فالعلبة الأصلية.'
      });
      localStorage.setItem('electrophone_accessories', JSON.stringify(accessories));
    }
    localStorage.setItem(SAMSUNG_25W_CHARGER_SEED_KEY, 'true');
  }

  if (!localStorage.getItem(UIRON_CR34_CHARGER_SEED_KEY)) {
    const savedAccessories = localStorage.getItem('electrophone_accessories');
    const accessories = savedAccessories === null ? [] : JSON.parse(savedAccessories);
    if (!Array.isArray(accessories) || accessories.some(accessory => !accessory || typeof accessory !== 'object')) {
      throw new Error('بيانات الإكسسوارات المخزنة غير صالحة.');
    }
    if (!accessories.some(accessory => String(accessory.id) === 'accessory-uiron-cr34-car-charger')) {
      accessories.unshift({
        id: 'accessory-uiron-cr34-car-charger',
        type: 'شاحن سيارة سريع',
        brand: 'UIRON',
        model: 'CR-34 QC+PD 48W',
        name: 'شاحن سيارة UIRON CR-34 48W',
        price: 120,
        img: 'asset:accessories/charger-uiron-cr34-package.jpg',
        images: [
          'asset:accessories/charger-uiron-cr34-package.jpg',
          'asset:accessories/charger-uiron-cr34-unit.jpg',
          'asset:accessories/charger-uiron-cr34-use.jpg'
        ],
        condition: 'فالعلبة الأصلية',
        quantity: 1,
        summary: '48W • QC + PD • كابل مرفق • شاحن سيارة',
        desc: 'شاحن سيارة UIRON موديل CR-34 بقدرة 48W، مع مخارج QC وPD وكابل مرفق كما هو موضح على العلبة. فالعلبة الأصلية.'
      });
      localStorage.setItem('electrophone_accessories', JSON.stringify(accessories));
    }
    localStorage.setItem(UIRON_CR34_CHARGER_SEED_KEY, 'true');
  }

  if (!localStorage.getItem(HEADPHONE_PACKAGE_IMAGE_ORDER_KEY)) {
    const savedAccessories = localStorage.getItem('electrophone_accessories');
    const accessories = savedAccessories === null ? [] : JSON.parse(savedAccessories);
    if (!Array.isArray(accessories) || accessories.some(accessory => !accessory || typeof accessory !== 'object')) {
      throw new Error('بيانات الإكسسوارات المخزنة غير صالحة.');
    }
    const packageImages = {
      'accessory-fj-star-fj-a6': 'asset:accessories/fj-star-fj-a6-package.jpg',
      'accessory-jbl-everest-980bt': 'asset:accessories/jbl-everest-980bt-package.jpg'
    };
    let updated = false;
    const updatedAccessories = accessories.map(accessory => {
      const packageImage = packageImages[String(accessory.id)];
      if (!packageImage) return accessory;

      const images = Array.isArray(accessory.images) ? accessory.images : [];
      updated = true;
      return {
        ...accessory,
        img: packageImage,
        images: [packageImage, ...images.filter(image => image !== packageImage)]
      };
    });
    if (updated) localStorage.setItem('electrophone_accessories', JSON.stringify(updatedAccessories));
    localStorage.setItem(HEADPHONE_PACKAGE_IMAGE_ORDER_KEY, 'true');
  }

  if (!localStorage.getItem(SOCIAL_DEFAULTS_KEY)) {
    const savedProfiles = localStorage.getItem('electrophone_social_links');
    const profiles = savedProfiles ? JSON.parse(savedProfiles) : {};
    if (!profiles || typeof profiles !== 'object' || Array.isArray(profiles)) {
      throw new Error('بيانات حسابات التواصل المخزنة غير صالحة.');
    }
    if (!profiles.instagram) {
      profiles.instagram = DEFAULT_INSTAGRAM_URL;
      localStorage.setItem('electrophone_social_links', JSON.stringify(profiles));
    }
    localStorage.setItem(SOCIAL_DEFAULTS_KEY, 'true');
  }

  if (!localStorage.getItem(WHATSAPP_DEFAULT_KEY)) {
    const savedPhone = (localStorage.getItem('shopWhatsAppPhone') || '').replace(/\D/g, '');
    if (!/^\d{8,15}$/.test(savedPhone)) {
      localStorage.setItem('shopWhatsAppPhone', DEFAULT_WHATSAPP_PHONE);
    }
    localStorage.setItem(WHATSAPP_DEFAULT_KEY, 'true');
  }

  if (!localStorage.getItem(WHATSAPP_PHONE_UPDATE_KEY)) {
    localStorage.setItem('shopWhatsAppPhone', DEFAULT_WHATSAPP_PHONE);
    localStorage.setItem(WHATSAPP_PHONE_UPDATE_KEY, 'true');
  }

  const products = getProducts();
  const seedProductsById = new Map(
    PRICED_SEED_PRODUCTS.map(product => [String(product.id), product])
  );
  const cleanedProducts = products
    .map(product => {
      const price = Number(product.price);
      if (Number.isFinite(price) && price > 0) return product;
      return seedProductsById.get(String(product.id));
    })
    .filter(product => {
      if (!product) return false;
      const price = Number(product.price);
      return Number.isFinite(price) && price > 0;
    });
  if (cleanedProducts.length !== products.length || cleanedProducts.some((product, index) => product !== products[index])) {
    saveProducts(cleanedProducts);
  }

  function getProducts() {
    const saved = localStorage.getItem(KEY);
    if (saved === null) {
      const legacyProducts = localStorage.getItem('electrophone_products');
      if (legacyProducts !== null) {
        const migratedProducts = JSON.parse(legacyProducts);
        if (!Array.isArray(migratedProducts)) {
          throw new Error('بيانات المنتجات القديمة المخزنة غير صالحة.');
        }
        saveProducts(migratedProducts);
        return migratedProducts;
      }
      saveProducts([]);
      return [];
    }

    const products = JSON.parse(saved);
    if (!Array.isArray(products) || products.some(product => !product || typeof product !== 'object')) {
      throw new Error('بيانات المنتجات المخزنة غير صالحة.');
    }
    return products;
  }

  function saveProducts(products) {
    if (!Array.isArray(products)) {
      throw new TypeError('قائمة المنتجات غير صالحة.');
    }
    const normalizedProducts = applyPhonePriceRule(products);
    const serialized = JSON.stringify(normalizedProducts);
    localStorage.setItem(KEY, serialized);
    localStorage.setItem('electrophone_products', serialized);
    window.dispatchEvent(new CustomEvent('products:updated', { detail: normalizedProducts }));
    return normalizedProducts;
  }

  function escapeHTML(value) {
    return String(value == null ? '' : value).replace(/[&<>"']/g, character => ({
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#39;'
    })[character]);
  }

  function resolveImage(image) {
    if (typeof image !== 'string' || !image.startsWith('asset:')) return image || '';
    if (!STORE_SCRIPT_URL) throw new Error('تعذر تحديد مسار صورة المنتج.');
    return new URL(`../assets/${image.slice('asset:'.length)}`, STORE_SCRIPT_URL).href;
  }

  window.ElectrophoneStore = { getProducts, saveProducts, escapeHTML, resolveImage };
})();
