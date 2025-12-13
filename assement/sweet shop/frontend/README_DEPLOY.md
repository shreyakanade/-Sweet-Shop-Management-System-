# Deploying the React frontend

This project is a Vite React app. To deploy to Vercel:
1. Push this repo to GitHub.
2. Import project in Vercel and set Build Command: `npm run build` and Output Directory: `dist`.
3. (Optional) Set environment variable VITE_API_BASE to your backend API base, e.g. `https://your-backend.com/api`.

To deploy to Netlify:
1. Push to GitHub.
2. Create a new site from Git, set build command `npm run build` and publish directory `dist`.
3. Set environment variable `VITE_API_BASE`.

Local dev:
- npm install
- npm run dev

Note: For CORS, ensure your Django backend allows the frontend origin (add django-cors-headers if needed).
