import { createI18n } from 'vue-i18n'
import en from '../locales/en.json'
import zh from '../locales/zh.json'

export type MessageSchema = typeof en

const savedLanguage = localStorage.getItem('app-language') || 'en'

export const i18n = createI18n<[MessageSchema], 'en' | 'zh'>({
  legacy: false,
  locale: savedLanguage,
  fallbackLocale: 'en',
  messages: {
    en,
    zh
  }
})

export function setLanguage(lang: 'en' | 'zh') {
  (i18n.global.locale as any).value = lang
  localStorage.setItem('app-language', lang)
  document.documentElement.lang = lang
}

export function getCurrentLanguage(): 'en' | 'zh' {
  return (i18n.global.locale as any).value || 'en'
}
