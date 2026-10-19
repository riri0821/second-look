// Filipino quiz. Lahat ng pangalan, numero at link ay gawa-gawa lang para sa pagtuturo.

export const QUIZ_FIL = [
  {
    from: '+63 917 555 0144',
    parts: ['LBC: Naka-hold ang parcel mo. Bayaran ang ', { text: 'P25 na redelivery fee', flag: 'danger' }, ' dito: ', { text: 'lbc-parcel-care.top', flag: 'danger' }],
    scam: true,
    why: 'Hindi nagte-text ang LBC para humingi ng bayad, at hindi ".top" ang website nila. Bitag ang maliit na bayad para makuha ang card details mo.',
  },
  {
    from: 'Shopee',
    parts: ['Naipadala na ang order mo na "Electric Fan". I-track ito sa Shopee app sa My Purchases.'],
    scam: false,
    why: 'Walang link, walang pagmamadali, walang babayaran. Sinasabi lang nitong gamitin ang opisyal na app. Ganito ang itsura ng totoong update.',
  },
  {
    from: '+63 905 555 0111',
    parts: ['Ma, ', { text: 'nawala ang phone ko', flag: 'warn' }, '. Ito na bagong number ko. ', { text: 'Padalhan mo ako ng P5,000 sa GCash', flag: 'danger' }, ' pambayad sa upa, babayaran kita bukas.'],
    scam: true,
    why: 'Napakakaraniwang scam ang "bagong number". Tawagan muna ang anak mo sa dati niyang numero bago magpadala ng kahit ano.',
  },
  {
    from: 'Netflix',
    parts: ['Hindi natuloy ang bayad mo. I-update ang billing sa ', { text: 'netflix-account-billing.com', flag: 'danger' }, ' para hindi mawala ang access.'],
    scam: true,
    why: 'netflix.com lang ang gamit ng Netflix. Palatandaan ang dagdag na salitang "account" at "billing" sa address.',
  },
  {
    from: 'BPI',
    parts: ['Ang OTP mo ay 482913. Huwag itong ibigay kahit kanino, kahit sa BPI. Hindi namin ito hihingin kailanman.'],
    scam: false,
    why: 'Normal na login code ito na ikaw mismo ang humingi. Binabalaan ka pa nitong huwag ibigay. Basta huwag itong ibigay sa sinumang humingi.',
  },
  {
    from: 'Globe Rewards',
    parts: [{ text: 'Congratulations!', flag: 'warn' }, ' Napili ka para sa ', { text: 'libreng iPhone', flag: 'danger' }, '. I-claim ngayon: ', { text: 'globe-rewards-claim.net', flag: 'danger' }],
    scam: true,
    why: 'Premyo sa pa-contest na hindi mo sinalihan, at hindi globe.com.ph ang website. Halos laging scam ang libreng premyo.',
  },
  {
    from: 'Dr. Santos Clinic',
    parts: ['Paalala: may appointment ka sa Martes, 10:30 AM. Mag-reply ng C para kumpirmahin o tumawag sa clinic para mag-reschedule.'],
    scam: false,
    why: 'Tungkol ito sa bagay na alam mo na, walang hinihinging pribadong impormasyon, at walang link.',
  },
  {
    from: 'BIR-Notice',
    parts: ['May ', { text: 'hindi bayad na buwis', flag: 'warn' }, ' ka. Para hindi ka ', { text: 'kasuhan', flag: 'danger' }, ', magbayad ngayon gamit ang ', { text: 'GCash load o gift card', flag: 'danger' }, '.'],
    scam: true,
    why: 'Hindi nananakot ng kaso sa text ang BIR at hindi tumatanggap ng load o gift card. Walang totoong ahensya ang gumagawa nito.',
  },
  {
    from: '+63 917 555 0177',
    parts: ['Hello po, ako si Liza ng ', { text: 'Lazada HR', flag: 'warn' }, '. May ', { text: 'sideline na P3,000 kada araw', flag: 'danger' }, ' sa pag-like ng products. I-message ako sa WhatsApp.'],
    scam: true,
    why: 'Kilalang scam ang trabahong hindi mo inaplayan na may madaling pera. Ikaw pa ang pagbabayarin ng "fees" para ma-withdraw ang kita.',
  },
  {
    from: 'BDO',
    parts: ['May bayad na P1,250.00 sa SM Supermarket gamit ang card mo na nagtatapos sa 4417. Kung hindi mo ito kilala, buksan ang BDO app o tumawag sa numero sa card mo.'],
    scam: false,
    why: 'Itinuturo ka nito sa opisyal na app at sa numero sa sarili mong card, hindi sa link o numerong nasa mensahe.',
  },
  {
    from: 'SSS',
    parts: ['Ang SSS benefits mo na ', { text: 'P15,000', flag: 'warn' }, ' ay handa nang i-claim. ', { text: 'I-verify ang account mo', flag: 'danger' }, ' sa ', { text: 'sss-benefits-ph.com', flag: 'danger' }],
    scam: true,
    why: 'sss.gov.ph lang ang website ng SSS. Hindi sila nagte-text ng link para mag-claim ng benefits.',
  },
  {
    from: '+63 998 555 0199',
    parts: ['May ', { text: 'virus', flag: 'danger' }, ' ang phone mo. ', { text: 'I-install ang AnyDesk', flag: 'danger' }, ' para maayos ito ng technician namin ngayon din.'],
    scam: true,
    why: 'Pinapa-install ka ng app para makontrol nila ang phone mo. Walang totoong kumpanya ang nagte-text nang ganito.',
  },
];
