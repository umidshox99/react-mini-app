# Alohida Git repoga chiqarish va Vercel deploy

## 1. GitHub’da yangi repo yarating

- github.com → **New repository**
- Nom: masalan `tg-stars-react-mini`
- **README, .gitignore qo‘shmang** (bo‘sh repo)
- Create repository

## 2. Lokalda faqat `react-mini-app` ni yangi repo sifatida push qiling

Terminalda (macOS/Linux):

```bash
cd /Users/umidjonshoniyozov/StudioProjects/tg_stars/react-mini-app

# Yangi git (agar ichida .git yo‘q bo‘lsa)
rm -rf .git
git init

git add .
git commit -m "Initial: React Telegram Mini App"

git branch -M main
git remote add origin https://github.com/umidshox99/tg-stars-react-mini.git
git push -u origin main
```

`tg-stars-react-mini` o‘rniga o‘zingiz yaratgan repo nomini yozing.

## 3. Vercel’da yangi project

- **New Project** → **Import** → `umidshox99/tg-stars-react-mini` (yangi repo’ni tanlang)
- **Root Directory** bo‘sh qoldiring (`.` — butun repo)
- Vercel avtomatik **Vite** ni aniqlaydi, **Build Command** va **Output** `vercel.json` dan olinadi
- **Deploy** bosing

Shundan keyin build to‘g‘ri ishlashi kerak.
