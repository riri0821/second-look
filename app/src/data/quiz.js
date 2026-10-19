import { QUIZ_FIL } from './quiz.fil';

// "Real or scam?" quiz. All names, numbers and links are made up for teaching.
// `parts` uses the same format as lessons; flags are only shown after answering.

export const QUIZ = [
  {
    from: '+1 (619) 555-0144',
    parts: ['USPS: Your parcel is held at our warehouse. Pay the ', { text: '$1.99 redelivery fee', flag: 'danger' }, ' here: ', { text: 'usps-parcel-care.top', flag: 'danger' }],
    scam: true,
    why: 'USPS does not text asking for fees, and ".top" is not their website. The small fee is a trick to get your card details.',
  },
  {
    from: 'Amazon',
    parts: ['Your order of "Kitchen Scale" has shipped. Track it in the Amazon app under Your Orders.'],
    scam: false,
    why: 'No link, no urgency, nothing to pay. It just tells you to use the official app. That is what real delivery updates look like.',
  },
  {
    from: '+1 (305) 555-0111',
    parts: ['Hi Mom, I ', { text: 'dropped my phone', flag: 'warn' }, '. This is my new number. Can you ', { text: 'send me $400', flag: 'danger' }, ' for rent? I will pay you back tomorrow.'],
    scam: true,
    why: 'The "new number" story is a very common scam. Call your child on their old number before sending anything.',
  },
  {
    from: 'Netflix',
    parts: ['Your payment was ', { text: 'declined', flag: 'warn' }, '. Update your billing at ', { text: 'netflix-account-billing.com', flag: 'danger' }, ' to avoid losing access.'],
    scam: true,
    why: 'Netflix only uses netflix.com. Extra words like "account" and "billing" in the address are a giveaway.',
  },
  {
    from: '28849',
    parts: ['Your Chase verification code is 482913. Do not share this code with anyone. Chase will never ask for it.'],
    scam: false,
    why: 'This is a normal login code that you asked for. It warns you not to share it. Just never read it back to anyone who asks.',
  },
  {
    from: 'Apple Support',
    parts: ['Your Apple ID was used to sign in on a new device in ', { text: 'Moscow', flag: 'warn' }, '. If this was not you, ', { text: 'call 1-888-555-0177', flag: 'danger' }, ' immediately.'],
    scam: true,
    why: 'Scammers scare you into calling them, then ask for your password or remote access. Apple shows sign-in alerts on your own devices, not by text.',
  },
  {
    from: 'Dr. Patel\'s Office',
    parts: ['Reminder: you have an appointment on Tuesday at 10:30 AM. Reply C to confirm or call our office to reschedule.'],
    scam: false,
    why: 'It is about something you already know about, asks for nothing private, and has no link.',
  },
  {
    from: 'IRS-Notice',
    parts: ['You have an ', { text: 'unpaid tax balance', flag: 'warn' }, '. To avoid ', { text: 'arrest', flag: 'danger' }, ', pay today using ', { text: 'Google Play gift cards', flag: 'danger' }, '.'],
    scam: true,
    why: 'The IRS contacts people by mail, never threatens arrest by text, and never takes gift cards. Nobody real does.',
  },
  {
    from: 'Walmart Rewards',
    parts: [{ text: 'Congratulations!', flag: 'warn' }, ' You have been selected for a ', { text: 'free $500 gift card', flag: 'danger' }, '. Claim now: ', { text: 'walmart-rewards-claim.net', flag: 'danger' }],
    scam: true,
    why: 'A prize you never entered for, plus a website that is not walmart.com. Free gift card offers are almost always scams.',
  },
  {
    from: 'Bank of America',
    parts: ['A purchase of $54.20 at Target was made with your card ending 4417. If you do not recognize this, open the Bank of America app or call the number on your card.'],
    scam: false,
    why: 'It points you to the official app and the number on your own card, not to a link or a number in the message.',
  },
  {
    from: '+63 917 555 0123',
    parts: ['Hello, I am Linda from ', { text: 'Amazon HR', flag: 'warn' }, '. We have a ', { text: 'remote job paying $300/day', flag: 'danger' }, ' for liking products. Message me on WhatsApp to start.'],
    scam: true,
    why: 'Job offers you did not apply for, with easy money, are a well-known scam. They end with you paying "fees" to unlock earnings.',
  },
  {
    from: 'Microsoft',
    parts: ['Your computer has a ', { text: 'virus', flag: 'danger' }, '. Do not turn it off. ', { text: 'Call Microsoft Support at 1-844-555-0199', flag: 'danger' }, ' now.'],
    scam: true,
    why: 'Microsoft never texts or pops up asking you to call. Whoever answers will try to get into your computer.',
  },
];

export const quizFor = lang => (lang === 'fil' ? QUIZ_FIL : QUIZ);
