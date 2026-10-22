// Reasons shown to people, in English and Filipino. Plain words, no jargon, no em dashes.
// Each entry is a function of its details so word order can differ between languages.

const en = {
  ip: () => 'The link uses a string of numbers instead of a website name. Real companies do not do this.',
  punycode: () => 'The website name uses letters from other alphabets that look like normal letters, to copy a real name.',
  at: () => 'The link contains an @ sign, a trick that hides where it really goes.',
  http: () => 'The website does not use a secure connection.',
  ending: ({ ending }) => `The website address ends in ".${ending}", an ending scammers use often.`,
  long: () => 'The website address is unusually long, a common way to look official.',
  dashes: () => 'The website name is split up with many dashes, a common scam pattern.',
  shortener: () => 'This is a shortened link, which hides where it really goes.',
  lookalike: ({ base, brand }) => `"${base}" is made to look like ${brand}, but it is not their website.`,
  usesName: ({ base, brand }) => `It uses the name ${brand}, but the real website is "${base}", which does not belong to them.`,
  disguised: ({ via, target }) => `The link is disguised. It starts at ${via}, a trusted website, but forwards you to ${target}.`,
  hidden: ({ target }) => `The link has another website address hidden inside it: ${target}.`,
  leadsTo: ({ host }) => `The link really leads to ${host}.`,
  brandNew: ({ age }) => `The website was created only ${age === 1 ? '1 day' : `${age} days`} ago. Scam websites are usually brand new.`,
  young: ({ age }) => `The website is only ${age} days old.`,
  google: () => 'Google lists this website as dangerous.',
  reported: ({ n }) => `${n} Second Look users have reported this website as a scam.`,
  vendors: ({ hits }) => `${hits === 1 ? 'A security company has' : `${hits} security companies have`} flagged this website as harmful.`,
  pressure: ({ words }) => `It uses pressure words like "${words.join('" and "')}" to rush you.`,
  claims: ({ brand, host }) => `The message claims to be from ${brand}, but the link goes to ${host}.`,
  remote: () => 'It asks you to install an app or allow remote access. Scammers use this to control your phone or computer.',
  code: () => 'It asks you to share a security code. That code unlocks your account, and no real company will ever ask for it.',
  giftCards: () => 'It asks for payment with gift cards or phone load. No real company or government office accepts this.',
  private: () => 'It asks for private details like card numbers or passwords. Real companies never ask for these by message.',
  irreversible: () => 'It asks for money in a way that cannot be reversed, like crypto or a wire transfer. Scammers prefer these.',
  threat: () => 'It threatens arrest or legal trouble. Government offices do not threaten people by text.',
  prize: () => 'It says you won something you never entered. Prize messages are one of the most common scams.',
  family: () => 'It claims to be someone you know in trouble asking for money. Call them on their usual number first.',
  job: () => 'It offers easy money or a job you did not apply for. These usually end with you paying "fees".',
  loan: () => 'It offers a loan you did not apply for. Fake lenders ask for "processing fees" and personal details.',
  call: () => 'It asks you to call or text a number in the message. Use the number on the company\'s official website instead.',
};

const fil = {
  ip: () => 'Puro numero ang link sa halip na pangalan ng website. Hindi ito ginagawa ng mga totoong kumpanya.',
  punycode: () => 'Gumagamit ang pangalan ng website ng mga letrang mukhang karaniwan pero galing sa ibang alpabeto, para gayahin ang totoong pangalan.',
  at: () => 'May @ sa link. Isa itong panloloko para itago kung saan talaga ito papunta.',
  http: () => 'Hindi secure ang koneksyon ng website.',
  ending: ({ ending }) => `Nagtatapos sa ".${ending}" ang address ng website. Madalas itong gamitin ng mga scammer.`,
  long: () => 'Sobrang haba ng address ng website. Karaniwang paraan ito para magmukhang opisyal.',
  dashes: () => 'Maraming gitling (-) ang pangalan ng website. Karaniwan ito sa mga scam.',
  shortener: () => 'Pinaikling link ito, kaya nakatago kung saan talaga ito papunta.',
  lookalike: ({ base, brand }) => `Ginawang kamukha ng ${brand} ang "${base}", pero hindi ito ang website nila.`,
  usesName: ({ base, brand }) => `Ginagamit nito ang pangalan ng ${brand}, pero ang totoong website ay "${base}", na hindi sa kanila.`,
  disguised: ({ via, target }) => `Nakabalatkayo ang link. Nagsisimula ito sa ${via}, isang kilalang website, pero dadalhin ka nito sa ${target}.`,
  hidden: ({ target }) => `May nakatagong ibang website sa loob ng link: ${target}.`,
  leadsTo: ({ host }) => `Ang totoong pupuntahan ng link ay ${host}.`,
  brandNew: ({ age }) => `${age === 1 ? '1 araw' : `${age} araw`} pa lang ang website. Kadalasang bagong-bago ang mga scam na website.`,
  young: ({ age }) => `${age} araw pa lang ang website.`,
  google: () => 'Nakalista ang website na ito sa Google bilang mapanganib.',
  reported: ({ n }) => `${n} gumagamit ng Second Look ang nag-report sa website na ito bilang scam.`,
  vendors: ({ hits }) => `${hits === 1 ? 'Isang security company ang nagmarka' : `${hits} security company ang nagmarka`} sa website na ito bilang mapanganib.`,
  pressure: ({ words }) => `Gumagamit ito ng mga salitang nagmamadali tulad ng "${words.join('" at "')}" para mataranta ka.`,
  claims: ({ brand, host }) => `Sinasabi ng mensahe na galing ito sa ${brand}, pero ang link ay papunta sa ${host}.`,
  remote: () => 'Pinapa-install ka nito ng app o pinapayagan ang remote access. Ginagamit ito ng scammer para kontrolin ang phone o computer mo.',
  code: () => 'Hinihingi nito ang security code o OTP mo. Ito ang susi sa account mo, at walang totoong kumpanya ang hihingi nito.',
  giftCards: () => 'Pinapabayad ka gamit ang gift card o load. Walang totoong kumpanya o ahensya ng gobyerno ang tumatanggap nito.',
  private: () => 'Hinihingi nito ang pribadong detalye tulad ng card number o password. Hindi ito hinihingi ng totoong kumpanya sa text.',
  irreversible: () => 'Humihingi ito ng pera sa paraang hindi na maibabalik, tulad ng crypto o wire transfer. Ito ang gusto ng mga scammer.',
  threat: () => 'Tinatakot ka nito ng aresto o kaso. Hindi nananakot sa text ang mga ahensya ng gobyerno.',
  prize: () => 'Sinasabi nitong nanalo ka sa isang bagay na hindi mo sinalihan. Isa ito sa pinakakaraniwang scam.',
  family: () => 'Nagpapanggap itong kakilala mong may problema at nanghihingi ng pera. Tawagan muna sila sa dati nilang numero.',
  job: () => 'Nag-aalok ito ng madaling pera o trabahong hindi mo inaplayan. Kadalasan, ikaw pa ang pagbabayarin ng "fees".',
  loan: () => 'Nag-aalok ito ng loan na hindi mo inaplayan. Humihingi ang pekeng lender ng "processing fee" at personal na detalye.',
  call: () => 'Pinapatawag o pinapa-text ka nito sa numerong nasa mensahe. Gamitin ang numero sa opisyal na website ng kumpanya.',
};

const LANGS = { en, fil };

export const SUPPORTED_LANGS = Object.keys(LANGS);

export function say(lang, key, details = {}) {
  const table = LANGS[lang] ?? en;
  return (table[key] ?? en[key])(details);
}
