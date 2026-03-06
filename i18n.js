// i18n.js
// Internationalization system

const KrishiI18n = {
  currentLang: localStorage.getItem('krishi-lang') || 'en',
  translations: {},

  async init() {
    const langs = ['en', 'hi', 'gu', 'mr'];
    for (const lang of langs) {
      try {
        const resp = await fetch(`locales/${lang}/translation.json`);
        if (resp.ok) {
          this.translations[lang] = await resp.json();
        }
      } catch (e) {
        console.warn(`Failed to load ${lang} translations`);
      }
    }

    // Fallback inline translations if fetch fails
    if (!this.translations.en) {
      this.translations.en = {
        'app-title': 'Krishi',
        'login': 'Login',
        'logout': 'Logout',
        'submit': 'Submit',
        'cancel': 'Cancel',
        'dashboard': 'Dashboard',
        'loading': 'Loading...',
        'welcome': 'Welcome',
        'search': 'Search batches, herbs, farmers...'
      };
    }

    this.applyTranslations();
    console.log(`🌐 i18n initialized: ${this.currentLang}`);
  },

  t(key) {
    const langData = this.translations[this.currentLang] || this.translations.en || {};
    return langData[key] || this.translations.en?.[key] || key;
  },

  setLanguage(lang) {
    this.currentLang = lang;
    localStorage.setItem('krishi-lang', lang);
    this.applyTranslations();
    document.documentElement.lang = lang;

    const langSelect = document.getElementById('language-select');
    if (langSelect) langSelect.value = lang;
  },

  applyTranslations() {
    document.querySelectorAll('[data-i18n]').forEach(el => {
      const key = el.getAttribute('data-i18n');
      const translated = this.t(key);
      if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') {
        el.placeholder = translated;
      } else {
        el.textContent = translated;
      }
    });

    document.querySelectorAll('[data-i18n-title]').forEach(el => {
      el.title = this.t(el.getAttribute('data-i18n-title'));
    });
  }
};

document.addEventListener('DOMContentLoaded', () => KrishiI18n.init());