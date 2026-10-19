import { LESSONS_FIL } from './lessons.fil';

// Lesson content. Each lesson is a short series of cards.
// Card kinds:
//   { kind: 'text', title, body }
//   { kind: 'example', title, from, parts, caption }  parts: strings and { text, flag: 'danger'|'warn'|'safe' }
// Keep sentences short and plain. No jargon, no em dashes.

export const LESSONS = [
  {
    id: 'signs',
    icon: 'warning-outline',
    title: 'The 5 warning signs',
    summary: 'What almost every scam message has in common.',
    minutes: 1,
    cards: [
      {
        kind: 'text',
        title: 'Scams follow a pattern',
        body: 'Scammers send millions of messages, so they reuse what works. Once you know the pattern, you will start to see it everywhere.',
      },
      {
        kind: 'example',
        title: 'Here is a typical one',
        from: '+1 (213) 555-0198',
        parts: [
          { text: 'URGENT', flag: 'danger' },
          ': Your bank account has been ',
          { text: 'locked', flag: 'danger' },
          '. To restore access, ',
          { text: 'verify your card number', flag: 'danger' },
          ' at ',
          { text: 'secure-bank-login.co/verify', flag: 'warn' },
          ' within 2 hours.',
        ],
        caption: 'Every highlighted part is a warning sign. Swipe to see what each one means.',
      },
      {
        kind: 'text',
        title: '1. It rushes you',
        body: '"Urgent", "within 2 hours", "final notice". Rushing you is the point. Scammers want you to act before you stop and think. Real companies give you time.',
      },
      {
        kind: 'text',
        title: '2. It scares you, or excites you',
        body: 'Your account is locked. You owe money. You won a prize. Strong feelings make people careless, so scams are built to cause them.',
      },
      {
        kind: 'text',
        title: '3. It asks for something private',
        body: 'Passwords, card numbers, one-time codes, or gift cards. Your bank will never text you asking for these. Nobody legitimate asks to be paid in gift cards.',
      },
      {
        kind: 'text',
        title: '4. It has a link to tap',
        body: 'The link takes you to a fake page that looks real. Anything you type there goes straight to the scammer.',
      },
      {
        kind: 'text',
        title: '5. You did not expect it',
        body: 'A delivery you did not order. A bank you do not use. A prize for a contest you never entered. If it came out of nowhere, be suspicious.',
      },
      {
        kind: 'text',
        title: 'The one rule to remember',
        body: 'When a message pushes you to act fast, slow down. Close it, and contact the company yourself using their official app or the number on the back of your card.',
      },
    ],
  },
  {
    id: 'links',
    icon: 'link-outline',
    title: 'How to read a link',
    summary: 'Find out where a link really goes before you tap it.',
    minutes: 2,
    cards: [
      {
        kind: 'text',
        title: 'Only one part of a link matters',
        body: 'A link can be long and full of real company names. But only one part tells you who owns the website: the name right before the ending, like .com or .org.',
      },
      {
        kind: 'example',
        title: 'This one is really Amazon',
        from: 'Link',
        parts: ['https://www.', { text: 'amazon.com', flag: 'safe' }, '/orders/123'],
        caption: 'The part before .com is "amazon". This is Amazon\'s real website.',
      },
      {
        kind: 'example',
        title: 'This one is not Amazon',
        from: 'Link',
        parts: ['https://amazon.com.', { text: 'account-check.net', flag: 'danger' }, '/login'],
        caption: 'It starts with "amazon.com", but the real owner is "account-check.net". Read from the right, not the left.',
      },
      {
        kind: 'text',
        title: 'The trick: read right to left',
        body: 'Find the first single slash ( / ) after the start. Just before it is the ending, like .com. The word right before that ending is the real owner.',
      },
      {
        kind: 'example',
        title: 'Shortened links hide everything',
        from: 'Link',
        parts: ['Track your parcel: ', { text: 'bit.ly/3xK9pQ', flag: 'warn' }],
        caption: 'Short links like bit.ly hide where they go. Paste them into Second Look and we will follow them for you.',
      },
    ],
  },
  {
    id: 'lookalikes',
    icon: 'eye-outline',
    title: 'Fake look-alike websites',
    summary: 'Spot addresses that copy real companies, letter by letter.',
    minutes: 1,
    cards: [
      {
        kind: 'text',
        title: 'One letter can be the difference',
        body: 'Scammers buy website addresses that look almost exactly like real ones. At a glance, you will not notice. That is the whole idea.',
      },
      {
        kind: 'example',
        title: 'Spot the swap',
        from: 'Link',
        parts: ['https://www.', { text: 'paypa1', flag: 'danger' }, '.com/signin'],
        caption: 'The last letter of "paypal" is the number 1, not the letter L.',
      },
      {
        kind: 'example',
        title: 'Zero instead of O',
        from: 'Link',
        parts: ['https://', { text: 'amaz0n', flag: 'danger' }, '-support.com'],
        caption: 'A zero replaces the O, and "-support" is added to sound official.',
      },
      {
        kind: 'example',
        title: 'Extra words',
        from: 'Link',
        parts: ['https://', { text: 'netflix-billing-update', flag: 'danger' }, '.com'],
        caption: 'Netflix only uses netflix.com. Extra words like "billing", "secure" or "update" are a common trick.',
      },
      {
        kind: 'text',
        title: 'Do not rely on your eyes',
        body: 'These are hard to spot, even for experts. Instead of reading closely, open the company\'s app or type their address yourself.',
      },
    ],
  },
  {
    id: 'delivery',
    icon: 'cube-outline',
    title: 'Package delivery scams',
    summary: 'The most common scam text there is.',
    minutes: 1,
    cards: [
      {
        kind: 'example',
        title: 'You have probably seen this',
        from: '+44 7700 900123',
        parts: [
          'USPS: Your package is on hold due to an ',
          { text: 'incomplete address', flag: 'warn' },
          '. Please update within ',
          { text: '24 hours', flag: 'danger' },
          ': ',
          { text: 'usps-redeliver.top', flag: 'danger' },
        ],
        caption: 'A US delivery company, a UK phone number, a strange website, and a deadline.',
      },
      {
        kind: 'text',
        title: 'Why it works',
        body: 'Most of us are waiting for a package at any given time. The message just has to land on the right day.',
      },
      {
        kind: 'text',
        title: 'What happens if you tap',
        body: 'You see a page that looks like USPS, FedEx or UPS asking for a small "redelivery fee" of a dollar or two. The fee is the trap. They want your card details, not your two dollars.',
      },
      {
        kind: 'text',
        title: 'What to do instead',
        body: 'Delivery companies do not text you asking for fees or address updates. To check a real package, open the store where you ordered it, or go to the delivery company\'s website and type in your tracking number.',
      },
    ],
  },
  {
    id: 'account',
    icon: 'lock-closed-outline',
    title: 'Bank and "account locked" scams',
    summary: 'When a message claims your money or account is at risk.',
    minutes: 1,
    cards: [
      {
        kind: 'example',
        title: 'A fake bank alert',
        from: 'Chase Alert',
        parts: [
          'We detected ',
          { text: 'unusual activity', flag: 'warn' },
          ' on your account. Your card is ',
          { text: 'suspended', flag: 'danger' },
          '. Reply with the ',
          { text: '6-digit code', flag: 'danger' },
          ' we just sent you to cancel the charge.',
        ],
        caption: 'The sender name says Chase, but anyone can set a sender name.',
      },
      {
        kind: 'text',
        title: 'Never share a code',
        body: 'Those 6-digit codes are the key to your account. If someone asks for one, they are trying to log in as you. Your bank will never ask you to read it back.',
      },
      {
        kind: 'text',
        title: 'Sender names can be faked',
        body: 'A message can show "Chase", "PayPal" or "Apple" as the sender and still come from a scammer. Some even appear in the same thread as real messages.',
      },
      {
        kind: 'text',
        title: 'The safe move',
        body: 'Call the number on the back of your card, or open your bank\'s app. If something is really wrong, they will tell you there.',
      },
    ],
  },
  {
    id: 'clicked',
    icon: 'medkit-outline',
    title: 'What to do if you already clicked',
    summary: 'Clicked a link or shared details? Here is what to do, step by step.',
    minutes: 2,
    cards: [
      {
        kind: 'text',
        title: 'First: do not panic',
        body: 'Opening a link alone rarely causes harm. What matters is what you typed in or downloaded. Acting quickly fixes most problems.',
      },
      {
        kind: 'text',
        title: 'If you typed a password',
        body: 'Change that password right away, on the real website or app. If you use the same password anywhere else, change it there too.',
      },
      {
        kind: 'text',
        title: 'If you entered card details',
        body: 'Call your bank now using the number on the back of your card. Ask them to block the card and send a new one. Watch your statement for charges you do not recognize.',
      },
      {
        kind: 'text',
        title: 'If you shared a code or gave remote access',
        body: 'Contact your bank immediately. If someone connected to your computer or phone, disconnect it from the internet and ask a trusted person or store for help.',
      },
      {
        kind: 'text',
        title: 'Report it',
        body: 'In the Philippines, call the CICC scam hotline 1326 or report at cicc.gov.ph. In the US, forward scam texts to 7726 and report at ReportFraud.ftc.gov. Reporting helps stop the same scam reaching others.',
      },
      {
        kind: 'text',
        title: 'It happens to smart people',
        body: 'These scams are made by professionals and they fool people every day. There is nothing to be embarrassed about. Telling someone quickly is the best thing you can do.',
      },
    ],
  },
];

export const lessonsFor = lang => (lang === 'fil' ? LESSONS_FIL : LESSONS);
export const getLesson = (id, lang) => lessonsFor(lang).find(l => l.id === id);
