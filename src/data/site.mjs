// Mark Morente: company facts used by every page, schema.org, llms.txt and the API.
// Facts here are owner-verified (see content/BRIEF.md). Don't add claims without confirmation.

export const site = {
  url: 'https://www.markmorente.com', // canonical host is www, URLs have no trailing slash
  host: 'www.markmorente.com',
  name: 'Mark Morente',
  legalName: 'Mark Morente Menswear',
  tagline: "Wholesale men's suit & tuxedo manufacturer in Istanbul",
  description:
    "Mark Morente is a men's suit and tuxedo manufacturer in Istanbul, Turkey, producing for wholesalers, retailers and brands worldwide. Buy ready-stock models in size-run lots or have suits made under your own label (private label / OEM, MOQ 100 units per style). Typical production lead time is 12–15 days depending on the order. Business buyers only.",
  founded: 1994, // logo: "Est. 1994"
  city: 'Istanbul',
  country: 'Turkey',
  countryCode: 'TR',
  whatsapp: '905321711494',
  phoneDisplay: '+90 532 171 14 94',
  telegram: 'https://t.me/markmorentesuits',
  telegramHandle: '@markmorentesuits',
  instagram: 'https://www.instagram.com/mark.morente/',
  instagramHandle: '@mark.morente',
  facts: {
    capacity: '1,000+ suits per day',
    moq: '100 units per style (made to order)',
    stockLot: 'One lot = one model in a size run, 6–7 suits (EU 46–56/58)',
    leadTime: '12–15 days typical production time, depending on quantity, model and fabric',
    technology: ['CAD pattern design', 'ERP-controlled production', '3D prototyping', 'In-house pattern making and sampling'],
  },
  markets: [
    { slug: 'africa', name: 'Africa' },
    { slug: 'europe', name: 'Europe' },
    { slug: 'central-asia', name: 'Central Asia & Caucasus' },
    { slug: 'middle-east', name: 'Middle East' },
    { slug: 'north-america', name: 'North America' },
  ],
  audience: ['Wholesalers & importers', 'Menswear retailers & chains', 'Formalwear & wedding stores', 'Suit rental companies', 'Fashion & private label brands', 'Corporate & uniform buyers'],
};

// WhatsApp deep link with a natural B2B message (no tracking codes in the text).
export function waLink(message) {
  return `https://wa.me/${site.whatsapp}?text=${encodeURIComponent(`Hello Mark Morente, I'm contacting you from your website. ${message}`)}`;
}
