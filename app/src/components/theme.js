// The only three text sizes in the app: Large, Medium, Small.
export const T = { L: 28, M: 18, S: 15 };

// Black and white everywhere; color is reserved for verdicts and red flags so it always means something.
export const C = {
  bg: '#FFFFFF',
  surface: '#F5F5F5',
  border: '#E5E5E5',
  text: '#0A0A0A',
  muted: '#6B6B6B',
  faint: '#A3A3A3',
};

export const VERDICTS = {
  danger: { label: 'Likely a scam', hint: "Don't click the link or reply.", color: '#DC2626', tint: '#FEF2F2', icon: 'alert' },
  suspicious: { label: 'Be careful', hint: 'Some warning signs. Check with the sender another way.', color: '#D97706', tint: '#FFFBEB', icon: 'help' },
  no_red_flags: { label: 'No red flags', hint: 'Nothing suspicious found, but no check is perfect.', color: '#16A34A', tint: '#F0FDF4', icon: 'checkmark' },
};

// Highlight styles for red flags inside example messages.
export const FLAG = {
  danger: { color: VERDICTS.danger.color, tint: '#FEE2E2' },
  warn: { color: VERDICTS.suspicious.color, tint: '#FEF3C7' },
  safe: { color: VERDICTS.no_red_flags.color, tint: '#DCFCE7' },
};

// One font (the phone's system font), sized for easy reading by everyone.
export const type = {
  label: { fontSize: T.M, fontWeight: '600', color: C.muted },
  h1: { fontSize: T.L, fontWeight: '800', color: C.text, letterSpacing: -0.8 },
  h2: { fontSize: T.L, fontWeight: '800', color: C.text, letterSpacing: -0.3 },
  body: { fontSize: T.M, color: C.text, lineHeight: 26 },
  sub: { fontSize: T.M, color: C.muted, lineHeight: 24 },
};

// Big, easy-to-tap buttons.
export const button = {
  primary: { backgroundColor: C.text, borderRadius: 14, minHeight: 56, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 20 },
  primaryText: { color: '#fff', fontSize: T.M, fontWeight: '700' },
  secondary: { backgroundColor: C.bg, borderRadius: 14, minHeight: 56, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 20, borderWidth: 1.5, borderColor: C.text },
  secondaryText: { color: C.text, fontSize: T.M, fontWeight: '700' },
};
