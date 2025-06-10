# Internationalization (i18n) Setup

This directory contains the internationalization setup for the Classp application.

## Languages Supported
- English (en) - Default language
- Traditional Chinese (zh-TW) - 繁體中文

## Structure

```
src/i18n/
├── config.ts          # Main i18n configuration
├── locales/
│   ├── en.json        # English translations
│   └── zh-TW.json     # Traditional Chinese translations
└── README.md          # This file
```

## Usage

The i18n system is automatically initialized in `src/main.tsx`. To use translations in components:

```tsx
import { useTranslation } from 'react-i18next';

const MyComponent: React.FC = () => {
  const { t } = useTranslation();
  
  return (
    <div>
      <h1>{t('common.title')}</h1>
      <p>{t('common.description')}</p>
    </div>
  );
};
```

## Language Switching

A `LanguageSwitcher` component is available in `src/components/LanguageSwitcher.tsx` and is integrated into the main navigation bar. Users can toggle between English and Traditional Chinese.

## Adding New Translations

1. Add new keys to both `locales/en.json` and `locales/zh-TW.json`
2. Use the `t()` function in your components to access the translations
3. Follow the nested structure pattern for organization (e.g., `page.section.item`)

## Translation Keys Structure

- `common.*` - Common UI elements (buttons, labels, etc.)
- `navigation.*` - Navigation menu items
- `login.*` - Login page content
- `teacherDashboard.*` - Teacher dashboard content
- `wishlist.*` - Wishlist page content
- `about.*` - About page content
- `contact.*` - Contact page content
- `changelog.*` - Changelog page content
- `validation.*` - Form validation messages
- `status.*` - Status messages

## Notes

- Language preference is stored in localStorage
- Browser language detection is enabled as fallback
- All user-facing text should use the translation system for consistency
- Technical validation messages may remain in English for clarity 