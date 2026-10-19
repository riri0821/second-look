// Brands scammers commonly impersonate, with the websites they really use.
// key: one lowercase word used to spot the brand inside website names.
// name: how people write it. domains: the brand's real websites.
// aliases: other words in a message that mean this brand.

export const BRAND_LIST = [
  // Payments and money apps
  { key: 'paypal', name: 'PayPal', domains: ['paypal.com', 'paypal.me'] },
  { key: 'venmo', name: 'Venmo', domains: ['venmo.com'] },
  { key: 'zelle', name: 'Zelle', domains: ['zellepay.com', 'zelle.com'] },
  { key: 'cashapp', name: 'Cash App', domains: ['cash.app', 'cash.me', 'squareup.com'], aliases: ['cash app'] },
  { key: 'stripe', name: 'Stripe', domains: ['stripe.com'] },
  { key: 'wise', name: 'Wise', domains: ['wise.com'] },
  { key: 'revolut', name: 'Revolut', domains: ['revolut.com'] },
  { key: 'westernunion', name: 'Western Union', domains: ['westernunion.com'], aliases: ['western union'] },
  { key: 'moneygram', name: 'MoneyGram', domains: ['moneygram.com'] },

  // US banks and cards
  { key: 'chase', name: 'Chase', domains: ['chase.com', 'jpmorganchase.com'] },
  { key: 'bankofamerica', name: 'Bank of America', domains: ['bankofamerica.com', 'bofa.com'], aliases: ['bank of america'] },
  { key: 'wellsfargo', name: 'Wells Fargo', domains: ['wellsfargo.com', 'wf.com'], aliases: ['wells fargo'] },
  { key: 'citibank', name: 'Citibank', domains: ['citi.com', 'citibank.com'], aliases: ['citi'] },
  { key: 'capitalone', name: 'Capital One', domains: ['capitalone.com'], aliases: ['capital one'] },
  { key: 'usbank', name: 'U.S. Bank', domains: ['usbank.com'], aliases: ['us bank', 'u.s. bank'] },
  { key: 'pnc', name: 'PNC', domains: ['pnc.com'] },
  { key: 'truist', name: 'Truist', domains: ['truist.com'] },
  { key: 'tdbank', name: 'TD Bank', domains: ['td.com', 'tdbank.com'], aliases: ['td bank'] },
  { key: 'navyfederal', name: 'Navy Federal', domains: ['navyfederal.org'], aliases: ['navy federal'] },
  { key: 'usaa', name: 'USAA', domains: ['usaa.com'] },
  { key: 'discover', name: 'Discover', domains: ['discover.com'] },
  { key: 'americanexpress', name: 'American Express', domains: ['americanexpress.com', 'amex.com'], aliases: ['american express', 'amex'] },
  { key: 'visa', name: 'Visa', domains: ['visa.com'] },
  { key: 'mastercard', name: 'Mastercard', domains: ['mastercard.com'] },
  { key: 'schwab', name: 'Charles Schwab', domains: ['schwab.com'], aliases: ['charles schwab'] },
  { key: 'fidelity', name: 'Fidelity', domains: ['fidelity.com'] },
  { key: 'vanguard', name: 'Vanguard', domains: ['vanguard.com'] },
  { key: 'ally', name: 'Ally Bank', domains: ['ally.com'], aliases: ['ally bank'] },
  { key: 'sofi', name: 'SoFi', domains: ['sofi.com'] },
  { key: 'chime', name: 'Chime', domains: ['chime.com'] },

  // Other countries' banks often targeted
  { key: 'hsbc', name: 'HSBC', domains: ['hsbc.com', 'hsbc.co.uk'] },
  { key: 'barclays', name: 'Barclays', domains: ['barclays.co.uk', 'barclays.com'] },
  { key: 'lloyds', name: 'Lloyds Bank', domains: ['lloydsbank.com'], aliases: ['lloyds bank'] },
  { key: 'natwest', name: 'NatWest', domains: ['natwest.com'] },
  { key: 'santander', name: 'Santander', domains: ['santander.com', 'santander.co.uk', 'santanderbank.com'] },

  // Philippines: banks
  { key: 'bdo', name: 'BDO', domains: ['bdo.com.ph'], aliases: ['banco de oro'] },
  { key: 'bpi', name: 'BPI', domains: ['bpi.com.ph'], aliases: ['bank of the philippine islands'] },
  { key: 'metrobank', name: 'Metrobank', domains: ['metrobank.com.ph'] },
  { key: 'landbank', name: 'LANDBANK', domains: ['landbank.com'], aliases: ['land bank'] },
  { key: 'pnb', name: 'PNB', domains: ['pnb.com.ph'], aliases: ['philippine national bank'] },
  { key: 'securitybank', name: 'Security Bank', domains: ['securitybank.com'], aliases: ['security bank'] },
  { key: 'unionbank', name: 'UnionBank', domains: ['unionbankph.com'], aliases: ['union bank'] },
  { key: 'rcbc', name: 'RCBC', domains: ['rcbc.com'] },
  { key: 'chinabank', name: 'China Bank', domains: ['chinabank.ph'], aliases: ['china bank'] },
  { key: 'eastwest', name: 'EastWest Bank', domains: ['eastwestbanker.com'], aliases: ['eastwest bank'] },
  { key: 'psbank', name: 'PSBank', domains: ['psbank.com.ph'] },
  { key: 'dbp', name: 'DBP', domains: ['dbp.ph'] },
  { key: 'gotyme', name: 'GoTyme', domains: ['gotyme.com.ph'] },
  { key: 'seabank', name: 'SeaBank', domains: ['seabank.ph'] },
  { key: 'tonik', name: 'Tonik', domains: ['tonikbank.com'] },
  { key: 'cimb', name: 'CIMB', domains: ['cimbbank.com.ph'] },

  // Philippines: e-wallets and remittance
  { key: 'gcash', name: 'GCash', domains: ['gcash.com'] },
  { key: 'maya', name: 'Maya', domains: ['maya.ph', 'paymaya.com'], aliases: ['paymaya'] },
  { key: 'coinsph', name: 'Coins.ph', domains: ['coins.ph'], aliases: ['coins.ph'] },
  { key: 'grab', name: 'Grab', domains: ['grab.com'], aliases: ['grabpay'] },
  { key: 'shopeepay', name: 'ShopeePay', domains: ['shopee.ph'] },
  { key: 'palawan', name: 'Palawan Express', domains: ['palawanpawnshop.com'], aliases: ['palawan express', 'palawan pawnshop'] },
  { key: 'cebuana', name: 'Cebuana Lhuillier', domains: ['cebuanalhuillier.com'], aliases: ['cebuana lhuillier'] },
  { key: 'mlhuillier', name: 'M Lhuillier', domains: ['mlhuillier.com'], aliases: ['m lhuillier'] },

  // Philippines: telcos and internet
  { key: 'globe', name: 'Globe', domains: ['globe.com.ph'], aliases: ['globe telecom', 'globeone'] },
  { key: 'smart', name: 'Smart', domains: ['smart.com.ph'], aliases: ['smart communications'] },
  { key: 'dito', name: 'DITO', domains: ['dito.ph'] },
  { key: 'pldt', name: 'PLDT', domains: ['pldthome.com', 'pldt.com'] },
  { key: 'converge', name: 'Converge', domains: ['convergeict.com'] },
  { key: 'tnt', name: 'TNT', domains: ['smart.com.ph'], aliases: ['talk n text'] },

  // Philippines: delivery and shopping
  { key: 'lbc', name: 'LBC', domains: ['lbcexpress.com'] },
  { key: 'jtexpress', name: 'J&T Express', domains: ['jtexpress.ph'], aliases: ['j&t', 'j&t express'] },
  { key: 'jrs', name: 'JRS Express', domains: ['jrs-express.com'], aliases: ['jrs express'] },
  { key: 'ninjavan', name: 'Ninja Van', domains: ['ninjavan.co'], aliases: ['ninja van'] },
  { key: 'flashexpress', name: 'Flash Express', domains: ['flashexpress.ph'], aliases: ['flash express'] },
  { key: 'phlpost', name: 'PHLPost', domains: ['phlpost.gov.ph'], aliases: ['philippine postal'] },
  { key: 'lalamove', name: 'Lalamove', domains: ['lalamove.com'] },
  { key: 'lazada', name: 'Lazada', domains: ['lazada.com.ph', 'lazada.com'] },
  { key: 'shopee', name: 'Shopee', domains: ['shopee.ph', 'shopee.com'] },
  { key: 'zalora', name: 'Zalora', domains: ['zalora.com.ph'] },
  { key: 'foodpanda', name: 'foodpanda', domains: ['foodpanda.ph'] },

  // Philippines: government
  { key: 'bir', name: 'the BIR', domains: ['bir.gov.ph'], aliases: ['bureau of internal revenue'] },
  { key: 'sss', name: 'SSS', domains: ['sss.gov.ph'], aliases: ['social security system'] },
  { key: 'philhealth', name: 'PhilHealth', domains: ['philhealth.gov.ph'] },
  { key: 'pagibig', name: 'Pag-IBIG', domains: ['pagibigfund.gov.ph'], aliases: ['pag-ibig', 'pag ibig', 'hdmf'] },
  { key: 'dfa', name: 'the DFA', domains: ['dfa.gov.ph', 'passport.gov.ph'], aliases: ['passport appointment'] },
  { key: 'lto', name: 'the LTO', domains: ['lto.gov.ph'], aliases: ['land transportation office'] },
  { key: 'nbi', name: 'the NBI', domains: ['nbi.gov.ph'], aliases: ['nbi clearance'] },
  { key: 'dswd', name: 'the DSWD', domains: ['dswd.gov.ph'], aliases: ['ayuda'] },
  { key: 'psa', name: 'the PSA', domains: ['psa.gov.ph'], aliases: ['philsys', 'national id'] },
  { key: 'bsp', name: 'the BSP', domains: ['bsp.gov.ph'], aliases: ['bangko sentral'] },
  { key: 'mmda', name: 'the MMDA', domains: ['mmda.gov.ph'] },
  { key: 'dmw', name: 'the DMW', domains: ['dmw.gov.ph'], aliases: ['poea', 'owwa'] },
  { key: 'pcso', name: 'PCSO', domains: ['pcso.gov.ph'], aliases: ['lotto'] },
  { key: 'easytrip', name: 'Easytrip', domains: ['easytrip.ph'] },
  { key: 'autosweep', name: 'Autosweep', domains: ['autosweeprfid.com'] },

  // Philippines: utilities and travel
  { key: 'meralco', name: 'Meralco', domains: ['meralco.com.ph'] },
  { key: 'maynilad', name: 'Maynilad', domains: ['mayniladwater.com.ph'] },
  { key: 'manilawater', name: 'Manila Water', domains: ['manilawater.com'], aliases: ['manila water'] },
  { key: 'cebupacific', name: 'Cebu Pacific', domains: ['cebupacificair.com'], aliases: ['cebu pacific', 'cebu pac'] },
  { key: 'philippineairlines', name: 'Philippine Airlines', domains: ['philippineairlines.com'], aliases: ['philippine airlines'] },
  { key: 'airasia', name: 'AirAsia', domains: ['airasia.com'] },

  // Crypto
  { key: 'coinbase', name: 'Coinbase', domains: ['coinbase.com'] },
  { key: 'binance', name: 'Binance', domains: ['binance.com', 'binance.us'] },
  { key: 'kraken', name: 'Kraken', domains: ['kraken.com'] },
  { key: 'metamask', name: 'MetaMask', domains: ['metamask.io'] },
  { key: 'crypto', name: 'Crypto.com', domains: ['crypto.com'] },

  // Shopping
  { key: 'amazon', name: 'Amazon', domains: ['amazon.com', 'amazon.co.uk', 'amazon.ca', 'amazon.de', 'amazon.com.au', 'amazon.in', 'amazon.co.jp', 'amazon.fr', 'amazon.es', 'amazon.it', 'a.co', 'amzn.to'] },
  { key: 'walmart', name: 'Walmart', domains: ['walmart.com'] },
  { key: 'target', name: 'Target', domains: ['target.com'] },
  { key: 'costco', name: 'Costco', domains: ['costco.com'] },
  { key: 'bestbuy', name: 'Best Buy', domains: ['bestbuy.com'], aliases: ['best buy'] },
  { key: 'ebay', name: 'eBay', domains: ['ebay.com', 'ebay.co.uk'] },
  { key: 'etsy', name: 'Etsy', domains: ['etsy.com'] },
  { key: 'shein', name: 'Shein', domains: ['shein.com'] },
  { key: 'temu', name: 'Temu', domains: ['temu.com'] },
  { key: 'aliexpress', name: 'AliExpress', domains: ['aliexpress.com'] },
  { key: 'homedepot', name: 'Home Depot', domains: ['homedepot.com'], aliases: ['home depot'] },

  // Delivery
  { key: 'usps', name: 'USPS', domains: ['usps.com'], aliases: ['postal service'] },
  { key: 'ups', name: 'UPS', domains: ['ups.com'] },
  { key: 'fedex', name: 'FedEx', domains: ['fedex.com'] },
  { key: 'dhl', name: 'DHL', domains: ['dhl.com', 'dhl.de'] },
  { key: 'royalmail', name: 'Royal Mail', domains: ['royalmail.com'], aliases: ['royal mail'] },
  { key: 'canadapost', name: 'Canada Post', domains: ['canadapost-postescanada.ca', 'canadapost.ca'], aliases: ['canada post'] },
  { key: 'auspost', name: 'Australia Post', domains: ['auspost.com.au'], aliases: ['australia post'] },
  { key: 'evri', name: 'Evri', domains: ['evri.com'] },

  // Tech and accounts
  { key: 'apple', name: 'Apple', domains: ['apple.com', 'icloud.com', 'apple.co'], aliases: ['apple id', 'icloud'] },
  { key: 'icloud', name: 'iCloud', domains: ['icloud.com', 'apple.com'] },
  { key: 'microsoft', name: 'Microsoft', domains: ['microsoft.com', 'live.com', 'office.com', 'microsoftonline.com', 'outlook.com', 'xbox.com', 'windows.com'] },
  { key: 'outlook', name: 'Outlook', domains: ['outlook.com', 'live.com', 'office.com', 'microsoft.com'] },
  { key: 'office365', name: 'Microsoft 365', domains: ['office.com', 'microsoft.com', 'microsoftonline.com'], aliases: ['office 365', 'microsoft 365'] },
  { key: 'google', name: 'Google', domains: ['google.com', 'gmail.com', 'youtube.com', 'goo.gl', 'g.co'] },
  { key: 'gmail', name: 'Gmail', domains: ['gmail.com', 'google.com'] },
  { key: 'yahoo', name: 'Yahoo', domains: ['yahoo.com'] },
  { key: 'dropbox', name: 'Dropbox', domains: ['dropbox.com'] },
  { key: 'docusign', name: 'DocuSign', domains: ['docusign.com', 'docusign.net'] },
  { key: 'adobe', name: 'Adobe', domains: ['adobe.com'] },
  { key: 'norton', name: 'Norton', domains: ['norton.com'] },
  { key: 'mcafee', name: 'McAfee', domains: ['mcafee.com'] },
  { key: 'geeksquad', name: 'Geek Squad', domains: ['bestbuy.com'], aliases: ['geek squad'] },

  // Social and messaging
  { key: 'facebook', name: 'Facebook', domains: ['facebook.com', 'fb.com', 'fb.me', 'meta.com'] },
  { key: 'instagram', name: 'Instagram', domains: ['instagram.com'] },
  { key: 'whatsapp', name: 'WhatsApp', domains: ['whatsapp.com', 'wa.me'] },
  { key: 'tiktok', name: 'TikTok', domains: ['tiktok.com'] },
  { key: 'linkedin', name: 'LinkedIn', domains: ['linkedin.com', 'lnkd.in'] },
  { key: 'twitter', name: 'X (Twitter)', domains: ['twitter.com', 'x.com', 't.co'] },
  { key: 'snapchat', name: 'Snapchat', domains: ['snapchat.com'] },
  { key: 'telegram', name: 'Telegram', domains: ['telegram.org', 't.me'] },
  { key: 'discord', name: 'Discord', domains: ['discord.com', 'discord.gg'] },

  // Streaming and gaming
  { key: 'netflix', name: 'Netflix', domains: ['netflix.com'] },
  { key: 'disneyplus', name: 'Disney+', domains: ['disneyplus.com'], aliases: ['disney+', 'disney plus'] },
  { key: 'hulu', name: 'Hulu', domains: ['hulu.com'] },
  { key: 'spotify', name: 'Spotify', domains: ['spotify.com'] },
  { key: 'primevideo', name: 'Prime Video', domains: ['primevideo.com', 'amazon.com'], aliases: ['prime video'] },
  { key: 'steam', name: 'Steam', domains: ['steampowered.com', 'steamcommunity.com'] },
  { key: 'roblox', name: 'Roblox', domains: ['roblox.com'] },
  { key: 'playstation', name: 'PlayStation', domains: ['playstation.com', 'sony.com'] },

  // Phone and internet providers
  { key: 'verizon', name: 'Verizon', domains: ['verizon.com', 'vzw.com'] },
  { key: 'att', name: 'AT&T', domains: ['att.com'], aliases: ['at&t'] },
  { key: 'tmobile', name: 'T-Mobile', domains: ['t-mobile.com'], aliases: ['t-mobile'] },
  { key: 'xfinity', name: 'Xfinity', domains: ['xfinity.com', 'comcast.com', 'comcast.net'] },
  { key: 'spectrum', name: 'Spectrum', domains: ['spectrum.com', 'spectrum.net'] },

  // Government and official bodies
  { key: 'irs', name: 'the IRS', domains: ['irs.gov'], aliases: ['internal revenue service'] },
  { key: 'ssa', name: 'Social Security', domains: ['ssa.gov'], aliases: ['social security administration'] },
  { key: 'medicare', name: 'Medicare', domains: ['medicare.gov'] },
  { key: 'dmv', name: 'the DMV', domains: ['dmv.ca.gov', 'dmv.org'] },
  { key: 'ezpass', name: 'E-ZPass', domains: ['e-zpassny.com', 'ezpassnj.com', 'e-zpassiag.com'], aliases: ['e-zpass', 'toll services', 'unpaid toll'] },
  { key: 'fbi', name: 'the FBI', domains: ['fbi.gov', 'ic3.gov'] },
  { key: 'ftc', name: 'the FTC', domains: ['ftc.gov', 'reportfraud.ftc.gov'] },
  { key: 'hmrc', name: 'HMRC', domains: ['gov.uk'] },
  { key: 'cra', name: 'the CRA', domains: ['canada.ca'], aliases: ['canada revenue agency'] },
  { key: 'ato', name: 'the ATO', domains: ['ato.gov.au'], aliases: ['australian taxation office'] },

  // Travel and other common lures
  { key: 'airbnb', name: 'Airbnb', domains: ['airbnb.com'] },
  { key: 'booking', name: 'Booking.com', domains: ['booking.com'] },
  { key: 'uber', name: 'Uber', domains: ['uber.com'] },
  { key: 'doordash', name: 'DoorDash', domains: ['doordash.com'] },
  { key: 'delta', name: 'Delta', domains: ['delta.com'] },
  { key: 'united', name: 'United Airlines', domains: ['united.com'], aliases: ['united airlines'] },
];

// Brand words that are also everyday words. In a message they only count when written
// with the brand's capital letters ("Target", "UPS"), and inside website names they are
// only matched exactly, never as a near-miss spelling.
export const COMMON_WORDS = new Set([
  'target', 'visa', 'discover', 'apple', 'smart', 'globe', 'delta', 'united', 'chase',
  'booking', 'crypto', 'steam', 'maya', 'wise', 'ally', 'ups', 'uber', 'cra', 'ato', 'att',
  'grab', 'dito', 'tnt', 'bir', 'converge', 'palawan', 'psa', 'lotto', 'ayuda',
]);
// Inside a website name these are too generic to mean the brand at all.
export const GENERIC_IN_HOSTS = new Set(['target', 'visa', 'discover', 'smart', 'globe', 'delta', 'united', 'booking', 'crypto', 'steam', 'maya', 'wise', 'ally', 'cra', 'ato', 'att', 'grab', 'tnt', 'converge', 'palawan']);
