import { BRAND } from './products'

export interface SiteSettings {
  name: string
  tagline: string
  sourceSite: string
  email: string
  phoneWhatsApp: string
  whatsappNumber: string
  location: string
  instagram: string
  facebook: string
  tiktok: string
  twitterX: string
  youtube: string
  whatsappChannel: string
  logoUrl: string
  storyImageUrl: string
  homeHeadline: string
  homeDescription: string
  aboutHeadline: string
  aboutNote: string
  faqs: { q: string; a: string }[]
}

export const DEFAULT_SITE_SETTINGS: SiteSettings = {
  name: BRAND.name,
  tagline: BRAND.tagline,
  sourceSite: BRAND.sourceSite,
  email: BRAND.email,
  phoneWhatsApp: BRAND.phoneWhatsApp,
  whatsappNumber: BRAND.phoneDigits,
  location: BRAND.location,
  instagram: BRAND.instagram,
  facebook: BRAND.facebook,
  tiktok: BRAND.tiktok,
  twitterX: BRAND.twitterX,
  youtube: BRAND.youtube,
  whatsappChannel: BRAND.whatsappChannel,
  logoUrl: '/logo.png',
  storyImageUrl: '/story-art.jpg',
  homeHeadline: 'WE GOT FLAVOR.',
  homeDescription: 'Sauces, jams, honey & teas made by a mother-daughter team — order on WhatsApp in one tap.',
  aboutHeadline: 'A mother-daughter dream, bottled.',
  aboutNote: BRAND.aboutNote,
  faqs: [
    { q: 'How do I place an order?', a: 'The fastest way is WhatsApp — tap any Order on WhatsApp button and your message is pre-written for you.' },
    { q: 'Do you deliver outside Nairobi?', a: 'Yes — we send orders across Kenya by courier. Message us with your town and we will confirm delivery cost and timing.' },
    { q: 'Can my shop, hotel or restaurant stock Kaputei?', a: 'Absolutely — wholesale and bulk hospitality packs are available. WhatsApp us for a quote.' },
    { q: 'Where are you located?', a: 'Our kitchen is in Nairobi. Reach out before visiting so we can make sure someone is around.' },
    { q: 'What is the story behind Kaputei?', a: 'Kaputei Farm Products was born from a mother-daughter dream, with mental health awareness and emotional healing at its heart.' },
  ],
}

export function makeWhatsAppLink(settings: SiteSettings, message: string) {
  return `https://wa.me/${settings.whatsappNumber.replace(/\D/g, '')}?text=${encodeURIComponent(message)}`
}
