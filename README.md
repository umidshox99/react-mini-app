# Telegram Stars — React Mini App (test)

Telegram user ma'lumotini tekshirish uchun kichik React ekran. Deploy qilib, bot orqali ochib ko'ring.

## Ishga tushirish

```bash
cd react-mini-app
npm install
npm run dev
```

Brauzerda: http://localhost:5173

## Build va deploy

```bash
npm run build
```

`dist/` papkasi paydo bo'ladi. Uni serverga yuklang (Vercel, Netlify, yoki `starsbot.duckdns.org`).

### Vercel

- vercel.com → New Project → `react-mini-app` papkasini tanlang
- Build command: `npm run build`
- Output: `dist`

### Test

1. BotFather'da Web App URL ni shu sahifaga yo'naltiring (masalan `https://your-domain.com/react-mini-app/` yoki alohida subdomain).
2. Bot'dan Mini App'ni oching.
3. "Telegram debug" ni oching — `user` to'ldi bo'lsa, initData kelmoqda.
