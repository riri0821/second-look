// Filipino lessons. Same ids and card format as lessons.js, with Philippine examples.
// Simpleng salita, walang em dash.

export const LESSONS_FIL = [
  {
    id: 'signs',
    icon: 'warning-outline',
    title: 'Ang 5 babala',
    summary: 'Ang pagkakapareho ng halos lahat ng scam na mensahe.',
    minutes: 1,
    cards: [
      {
        kind: 'text',
        title: 'May pattern ang mga scam',
        body: 'Milyon-milyong mensahe ang ipinapadala ng mga scammer, kaya inuulit nila ang gumagana. Kapag alam mo na ang pattern, makikita mo na ito kahit saan.',
      },
      {
        kind: 'example',
        title: 'Ganito ang karaniwang scam',
        from: '+63 917 555 0198',
        parts: [
          { text: 'URGENT', flag: 'danger' },
          ': Ang BDO account mo ay ',
          { text: 'na-lock', flag: 'danger' },
          '. Para ma-unlock, ',
          { text: 'i-verify ang card number mo', flag: 'danger' },
          ' sa ',
          { text: 'bdo-secure-login.co/verify', flag: 'warn' },
          ' sa loob ng 2 oras.',
        ],
        caption: 'Babala ang bawat naka-highlight. Pindutin ang Susunod para malaman ang ibig sabihin ng bawat isa.',
      },
      {
        kind: 'text',
        title: '1. Minamadali ka',
        body: '"Urgent", "sa loob ng 2 oras", "huling paalala". Sinasadya ang pagmamadali para kumilos ka bago makapag-isip. Binibigyan ka ng sapat na oras ng mga totoong kumpanya.',
      },
      {
        kind: 'text',
        title: '2. Tinatakot ka, o pinapasaya',
        body: 'Na-lock ang account mo. May utang ka. Nanalo ka ng premyo. Nagiging pabaya ang tao kapag malakas ang emosyon, kaya ginagawa ang scam para pukawin ito.',
      },
      {
        kind: 'text',
        title: '3. Humihingi ng pribadong impormasyon',
        body: 'Password, card number, OTP, o gift card. Hindi magte-text ang bangko mo para hingin ang mga ito. Walang lehitimong kumpanya ang nagpapabayad gamit ang gift card o load.',
      },
      {
        kind: 'text',
        title: '4. May link na pipindutin',
        body: 'Dadalhin ka ng link sa pekeng page na mukhang totoo. Lahat ng ita-type mo roon ay mapupunta sa scammer.',
      },
      {
        kind: 'text',
        title: '5. Hindi mo ito inaasahan',
        body: 'Package na hindi mo inorder. Bangkong hindi mo ginagamit. Premyo sa pa-contest na hindi mo sinalihan. Kung bigla na lang dumating, magduda ka.',
      },
      {
        kind: 'text',
        title: 'Ang isang tuntuning dapat tandaan',
        body: 'Kapag minamadali ka ng mensahe, bagalan mo. Isara ito, at ikaw mismo ang kumontak sa kumpanya gamit ang opisyal nilang app o ang numero sa likod ng card mo.',
      },
    ],
  },
  {
    id: 'links',
    icon: 'link-outline',
    title: 'Paano basahin ang link',
    summary: 'Alamin kung saan talaga papunta ang link bago ito pindutin.',
    minutes: 2,
    cards: [
      {
        kind: 'text',
        title: 'Isang bahagi lang ng link ang mahalaga',
        body: 'Puwedeng mahaba ang link at puno ng pangalan ng totoong kumpanya. Pero isang bahagi lang ang nagsasabi kung kanino ang website: ang pangalan bago ang dulo, tulad ng .com o .com.ph.',
      },
      {
        kind: 'example',
        title: 'Ito ay totoong GCash',
        from: 'Link',
        parts: ['https://www.', { text: 'gcash.com', flag: 'safe' }, '/help'],
        caption: 'Ang bahagi bago ang .com ay "gcash". Ito ang totoong website ng GCash.',
      },
      {
        kind: 'example',
        title: 'Hindi ito GCash',
        from: 'Link',
        parts: ['https://gcash.com.', { text: 'account-check.net', flag: 'danger' }, '/login'],
        caption: 'Nagsisimula ito sa "gcash.com", pero ang totoong may-ari ay "account-check.net". Basahin mula kanan, hindi mula kaliwa.',
      },
      {
        kind: 'text',
        title: 'Ang sikreto: basahin mula kanan pakaliwa',
        body: 'Hanapin ang unang isang slash ( / ) pagkatapos ng simula. Bago nito ang dulo, tulad ng .com. Ang salita bago ang dulong iyon ang totoong may-ari.',
      },
      {
        kind: 'example',
        title: 'Itinatago ng pinaikling link ang lahat',
        from: 'Link',
        parts: ['I-track ang parcel mo: ', { text: 'bit.ly/3xK9pQ', flag: 'warn' }],
        caption: 'Itinatago ng maiikling link tulad ng bit.ly kung saan sila papunta. I-paste ito sa Second Look at susundan namin ito para sa iyo.',
      },
    ],
  },
  {
    id: 'lookalikes',
    icon: 'eye-outline',
    title: 'Mga pekeng kamukhang website',
    summary: 'Kilalanin ang mga address na ginaya ang totoong kumpanya, letra por letra.',
    minutes: 1,
    cards: [
      {
        kind: 'text',
        title: 'Isang letra lang ang pagkakaiba',
        body: 'Bumibili ang mga scammer ng website address na halos kapareho ng totoo. Sa isang tingin, hindi mo mapapansin. Iyon ang buong punto.',
      },
      {
        kind: 'example',
        title: 'Hanapin ang pinalitan',
        from: 'Link',
        parts: ['https://www.', { text: 'metr0bank', flag: 'danger' }, '.com.ph/login'],
        caption: 'Ang "o" sa "metrobank" ay naging numerong 0 (zero).',
      },
      {
        kind: 'example',
        title: 'Numero 1 sa halip na letrang L',
        from: 'Link',
        parts: ['https://', { text: 'paypa1', flag: 'danger' }, '-support.com'],
        caption: 'Numerong 1 ang huling letra, hindi L. Idinagdag pa ang "-support" para magmukhang opisyal.',
      },
      {
        kind: 'example',
        title: 'Mga dagdag na salita',
        from: 'Link',
        parts: ['https://', { text: 'sss-benefits-update', flag: 'danger' }, '.com'],
        caption: 'sss.gov.ph lang ang ginagamit ng SSS. Karaniwang panloloko ang dagdag na salitang "benefits", "update" o "secure".',
      },
      {
        kind: 'text',
        title: 'Huwag umasa sa mata lang',
        body: 'Mahirap itong makita, kahit ng mga eksperto. Sa halip na basahing mabuti, buksan ang app ng kumpanya o i-type mismo ang address nila.',
      },
    ],
  },
  {
    id: 'delivery',
    icon: 'cube-outline',
    title: 'Mga scam tungkol sa package',
    summary: 'Ang pinakakaraniwang scam na text.',
    minutes: 1,
    cards: [
      {
        kind: 'example',
        title: 'Malamang nakita mo na ito',
        from: '+63 951 555 0123',
        parts: [
          'LBC: Naka-hold ang package mo dahil ',
          { text: 'kulang ang address', flag: 'warn' },
          '. Paki-update sa loob ng ',
          { text: '24 oras', flag: 'danger' },
          ': ',
          { text: 'lbc-redeliver.top', flag: 'danger' },
        ],
        caption: 'Courier na hindi nagte-text nang ganito, kakaibang website, at deadline.',
      },
      {
        kind: 'text',
        title: 'Bakit ito gumagana',
        body: 'Halos lagi tayong may hinihintay na package, lalo na mula sa Shopee o Lazada. Kailangan lang tumama ang mensahe sa tamang araw.',
      },
      {
        kind: 'text',
        title: 'Ano ang mangyayari kapag pinindot mo',
        body: 'Makakakita ka ng page na mukhang LBC, J&T o Ninja Van na humihingi ng maliit na "redelivery fee". Bitag ang bayad na iyon. Card details mo ang gusto nila, hindi ang ilang piso.',
      },
      {
        kind: 'text',
        title: 'Ang dapat gawin',
        body: 'Hindi nagte-text ang courier para humingi ng bayad o pa-update ng address sa link. Para tingnan ang totoong package, buksan ang app ng tindahan kung saan ka umorder, o i-type ang tracking number sa opisyal na website ng courier.',
      },
    ],
  },
  {
    id: 'account',
    icon: 'lock-closed-outline',
    title: 'Mga scam sa bangko at e-wallet',
    summary: 'Kapag sinasabi ng mensahe na nanganganib ang pera o account mo.',
    minutes: 1,
    cards: [
      {
        kind: 'example',
        title: 'Pekeng alert mula sa e-wallet',
        from: 'GCash',
        parts: [
          'May ',
          { text: 'kahina-hinalang transaksyon', flag: 'warn' },
          ' sa account mo. ',
          { text: 'Na-suspend', flag: 'danger' },
          ' ang account. I-reply ang ',
          { text: '6-digit OTP', flag: 'danger' },
          ' na ipinadala namin para ma-cancel.',
        ],
        caption: 'GCash ang nakalagay na nagpadala, pero kahit sino ay puwedeng maglagay ng pangalan.',
      },
      {
        kind: 'text',
        title: 'Huwag ibigay ang OTP kahit kanino',
        body: 'Ang 6-digit na OTP ang susi sa account mo. Kapag may humingi nito, sinusubukan nilang mag-log in bilang ikaw. Hindi kailanman hihingin ng bangko o GCash na basahin mo ito sa kanila.',
      },
      {
        kind: 'text',
        title: 'Puwedeng pekein ang pangalan ng nagpadala',
        body: 'Puwedeng lumabas na "BDO", "GCash" o "Maya" ang nagpadala pero galing pa rin sa scammer. Minsan, lumalabas pa ito sa parehong thread ng mga totoong mensahe.',
      },
      {
        kind: 'text',
        title: 'Ang ligtas na gawin',
        body: 'Tawagan ang numero sa likod ng card mo, o buksan ang opisyal na app ng bangko o e-wallet mo. Kung may totoong problema, sasabihin nila roon.',
      },
    ],
  },
  {
    id: 'clicked',
    icon: 'medkit-outline',
    title: 'Ano ang gagawin kung na-click mo na',
    summary: 'Na-click mo ang link o nakapagbigay ng detalye? Narito ang gagawin, hakbang-hakbang.',
    minutes: 2,
    cards: [
      {
        kind: 'text',
        title: 'Una: huwag mag-panic',
        body: 'Bihirang makasama ang pagbukas lang ng link. Ang mahalaga ay kung ano ang na-type o na-download mo. Naaayos ang karamihan kapag kumilos agad.',
      },
      {
        kind: 'text',
        title: 'Kung nag-type ka ng password',
        body: 'Palitan agad ang password na iyon sa totoong website o app. Kung ginagamit mo rin ito sa iba, palitan din doon.',
      },
      {
        kind: 'text',
        title: 'Kung nagbigay ka ng card details',
        body: 'Tawagan ngayon ang bangko mo gamit ang numero sa likod ng card. Ipa-block ang card at humingi ng bago. Bantayan ang statement mo para sa mga hindi kilalang singil.',
      },
      {
        kind: 'text',
        title: 'Kung nagbigay ka ng OTP o remote access',
        body: 'Kontakin agad ang bangko o e-wallet mo. Kung may kumonekta sa phone o computer mo, idiskonekta ito sa internet at humingi ng tulong sa taong pinagkakatiwalaan mo.',
      },
      {
        kind: 'text',
        title: 'I-report ito',
        body: 'Sabihan agad ang bangko o e-wallet mo para mabantayan nila ang account mo. I-block at i-report ang nagpadala sa messages app mo. Nakakatulong ito para hindi na umabot sa iba ang parehong scam.',
      },
      {
        kind: 'text',
        title: 'Nangyayari ito kahit sa matatalino',
        body: 'Gawa ng mga propesyonal ang mga scam na ito at may nabibiktima araw-araw. Walang dapat ikahiya. Ang pinakamabuting gawin ay sabihin agad sa iba.',
      },
    ],
  },
];
