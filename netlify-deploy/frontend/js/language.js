(function () {
  const STORAGE_KEY = 'electrophone_site_language';
  const dictionaries = {
    fr: {
      searchPlaceholder: 'Rechercher un téléphone ou un accessoire...',
      searchAria: 'Rechercher un téléphone ou un accessoire',
      all: 'Tout',
      headphones: 'Casques',
      chargers: 'Chargeurs',
      cables: 'Câbles',
      phones: 'Téléphones',
      accessories: 'Accessoires',
      heroTitle: 'Choisissez votre téléphone en toute confiance',
      heroText: 'Découvrez les téléphones et accessoires disponibles, consultez les caractéristiques et les prix en dirhams, puis commandez via WhatsApp.',
      visitStore: 'Visitez le magasin',
      mapLocation: 'Voir notre emplacement sur Google Maps',
      phonesAvailable: 'Téléphones disponibles',
      nosPhones: 'Nos téléphones',
      phoneCount: 'téléphone',
      phoneCountPlural: 'téléphones',
      accessoriesAvailable: 'Accessoires disponibles',
      nosAccessories: 'Accessoires téléphones',
      accessoryCount: 'accessoire',
      accessoryCountPlural: 'accessoires',
      question: 'Une question ?',
      contactUs: 'Contactez-nous',
      followUs: 'Suivez-nous ou écrivez-nous sur nos comptes officiels.',
      mapTitle: 'Emplacement du magasin sur Google Maps',
      mapDirections: 'Itinéraire vers le magasin',
      mapConsent: 'La carte Google Maps est désactivée tant que vous n’avez pas donné votre accord pour les contenus tiers.',
      allowMap: 'Autoriser la carte',
      viewLocation: 'Voir l’emplacement',
      openMapPhone: 'Ouvrir la carte sur votre téléphone',
      rights: 'Tous droits réservés',
      privacy: 'Confidentialité',
      terms: 'Conditions générales',
      cookies: 'Préférences cookies',
      addCart: 'Ajouter au panier',
      orderWhatsapp: 'Commander sur WhatsApp',
      askPrice: 'Demander le prix sur WhatsApp',
      priceSoon: 'Prix bientôt disponible',
      noPhoneSearch: 'Aucun téléphone ne correspond à cette recherche.',
      noPhoneCategory: 'Aucun téléphone dans cette catégorie pour le moment.',
      noAccessorySearch: 'Aucun accessoire ne correspond à cette recherche.',
      noAccessory: 'Aucun accessoire publié pour le moment.'
    },
    ar: {
      searchPlaceholder: 'قلّب على هاتف أو إكسسوار...',
      searchAria: 'البحث عن هاتف أو إكسسوار',
      all: 'الكل',
      headphones: 'سماعات',
      chargers: 'الشواحن',
      cables: 'الكابلات',
      phones: 'الهواتف',
      accessories: 'الإكسسوارات',
      heroTitle: 'اختار هاتفك بثقة',
      heroText: 'شوف الهواتف والإكسسوارات المتوفرة، اطلع على المواصفات والأسعار بالدرهم، ثم طلب عبر واتساب.',
      visitStore: 'زور المحل',
      mapLocation: 'شوف موقعنا على خرائط Google',
      phonesAvailable: 'الهواتف المتوفرة',
      nosPhones: 'هواتفنا',
      phoneCount: 'هاتف',
      phoneCountPlural: 'هواتف',
      accessoriesAvailable: 'الإكسسوارات المتوفرة',
      nosAccessories: 'إكسسوارات الهواتف',
      accessoryCount: 'إكسسوار',
      accessoryCountPlural: 'إكسسوارات',
      question: 'عندك سؤال؟',
      contactUs: 'تواصل معنا',
      followUs: 'تابعنا أو تواصل معنا على حساباتنا الرسمية.',
      mapTitle: 'موقع المحل على خرائط Google',
      mapDirections: 'المسار إلى المحل',
      mapConsent: 'خريطة Google Maps معطلة حتى توافق على المحتوى الخارجي.',
      allowMap: 'السماح بالخريطة',
      viewLocation: 'شوف الموقع',
      openMapPhone: 'فتح الخريطة فالتليفون',
      rights: 'جميع الحقوق محفوظة',
      privacy: 'سياسة الخصوصية',
      terms: 'الشروط العامة',
      cookies: 'تفضيلات الكوكيز',
      addCart: 'زِد للسلة',
      orderWhatsapp: 'طلب عبر واتساب',
      askPrice: 'سول على الثمن عبر واتساب',
      priceSoon: 'الثمن قريباً',
      noPhoneSearch: 'مكاينش هاتف كيطابق هاد البحث.',
      noPhoneCategory: 'مكاينش هواتف فهاد الفئة دابا.',
      noAccessorySearch: 'مكاينش إكسسوار كيطابق هاد البحث.',
      noAccessory: 'مكاينش إكسسوارات منشورة دابا.'
    },
    en: {
      searchPlaceholder: 'Search for a phone or accessory...',
      searchAria: 'Search for a phone or accessory',
      all: 'All',
      headphones: 'Headphones',
      chargers: 'Chargers',
      cables: 'Cables',
      phones: 'Phones',
      accessories: 'Accessories',
      heroTitle: 'Choose your phone with confidence',
      heroText: 'Discover available phones and accessories, check specifications and prices in dirhams, then order via WhatsApp.',
      visitStore: 'Visit the store',
      mapLocation: 'View our location on Google Maps',
      phonesAvailable: 'Available phones',
      nosPhones: 'Our phones',
      phoneCount: 'phone',
      phoneCountPlural: 'phones',
      accessoriesAvailable: 'Available accessories',
      nosAccessories: 'Phone accessories',
      accessoryCount: 'accessory',
      accessoryCountPlural: 'accessories',
      question: 'Have a question?',
      contactUs: 'Contact us',
      followUs: 'Follow us or message us on our official accounts.',
      mapTitle: 'Store location on Google Maps',
      mapDirections: 'Directions to the store',
      mapConsent: 'The Google Maps map is disabled until you consent to third-party content.',
      allowMap: 'Allow map',
      viewLocation: 'View location',
      openMapPhone: 'Open the map on your phone',
      rights: 'All rights reserved',
      privacy: 'Privacy policy',
      terms: 'Terms and conditions',
      cookies: 'Cookie preferences',
      addCart: 'Add to cart',
      orderWhatsapp: 'Order on WhatsApp',
      askPrice: 'Ask for the price on WhatsApp',
      priceSoon: 'Price available soon',
      noPhoneSearch: 'No phone matches this search.',
      noPhoneCategory: 'No phones in this category at the moment.',
      noAccessorySearch: 'No accessory matches this search.',
      noAccessory: 'No accessories published at the moment.'
    }
  };

  let language = localStorage.getItem(STORAGE_KEY);
  if (!dictionaries[language]) language = 'fr';

  function t(key) {
    return dictionaries[language][key] || dictionaries.fr[key] || key;
  }

  function apply() {
    document.documentElement.lang = language === 'ar' ? 'ar' : (language === 'en' ? 'en' : 'fr');
    document.documentElement.dir = language === 'ar' ? 'rtl' : 'ltr';
    document.querySelectorAll('[data-i18n]').forEach(element => {
      element.textContent = t(element.dataset.i18n);
    });
    document.querySelectorAll('[data-i18n-placeholder]').forEach(element => {
      element.placeholder = t(element.dataset.i18nPlaceholder);
    });
    document.querySelectorAll('[data-i18n-aria]').forEach(element => {
      element.setAttribute('aria-label', t(element.dataset.i18nAria));
    });
    const select = document.getElementById('siteLanguage');
    if (select) select.value = language;
  }

  function setLanguage(nextLanguage) {
    if (!dictionaries[nextLanguage]) return;
    language = nextLanguage;
    localStorage.setItem(STORAGE_KEY, language);
    apply();
    window.dispatchEvent(new CustomEvent('language:changed', { detail: { language } }));
  }

  const select = document.getElementById('siteLanguage');
  if (select) select.addEventListener('change', () => setLanguage(select.value));

  window.ElectrophoneLanguage = { get: () => language, t, set: setLanguage, apply };
  apply();
})();
