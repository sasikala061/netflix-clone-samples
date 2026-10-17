#!/usr/bin/env bash
set -euo pipefail

REPO_ROOT="$(pwd)"
echo "Working in ${REPO_ROOT}"

read -p "This will create files & commit to the current repo. Continue? (y/N) " CONF
if [[ "${CONF}" != "y" && "${CONF}" != "Y" ]]; then
  echo "Aborting."
  exit 1
fi

mkdir -p apps/react-cra/src apps/nextjs-tmdb/pages apps/nextjs-fullstack/pages apps/nextjs-fullstack/pages/api/auth apps/react-firebase apps/static-demo mobile/flutter/lib mobile/android infra/functions .github/workflows docs examples assets i18n

cat > README.md <<'EOF'
# netflix-clone-samples

Netflix-style mono-repo with multiple sample apps: React (CRA), Next.js (TMDB), Next.js fullstack + admin console, React + Firebase, static demo, Flutter, Android.

Theme: dark by default, primary color #E50914. Localization: EN / HI / TE.
EOF

cat > LICENSE <<'EOF'
MIT License
Copyright (c) 2026 sasikala061
EOF

cat > .gitignore <<'EOF'
node_modules/
.env
.env.local
.next/
build/
dist/
.DS_Store
.vscode/
.idea/
android/.gradle/
*.apk
*.aab
EOF

cat > examples/.env.example <<'EOF'
TMDB_API_KEY=
FIREBASE_CONFIG_JSON={}
SENDGRID_API_KEY=
SMTP_HOST=
SMTP_PORT=
SMTP_USER=
SMTP_PASS=
ADMIN_EMAIL=admin@example.com
VERCEL_TOKEN=
EOF

cat > docs/DEPLOYMENT_CHECKLIST.md <<'EOF'
1) Add secrets: TMDB_API_KEY, FIREBASE_CONFIG_JSON, SENDGRID_API_KEY, ADMIN_EMAIL, VERCEL_TOKEN
2) Firebase: create project, enable Auth + Firestore
3) Vercel: connect repo, add env vars
4) TMDB key from themoviedb.org/settings/api
EOF

cat > docs/RUN_LOCALLY.md <<'EOF'
Next.js: cd apps/nextjs-fullstack && npm install && npm run dev
React CRA: cd apps/react-cra && npx create-react-app .
Flutter: cd mobile/flutter && flutter pub get && flutter run
EOF

cat > assets/theme.css <<'EOF'
:root {
  --bg: #0b0b0b;
  --surface: #121212;
  --text: #e6e6e6;
  --muted: #b3b3b3;
  --netflix-red: #E50914;
}
body { background: var(--bg); color: var(--text); font-family: Inter, Arial, sans-serif; }
.header { background: linear-gradient(90deg, rgba(229,9,20,1) 0%, rgba(180,10,20,0.9) 100%); color: white; }
EOF

cat > assets/design-tokens.json <<'EOF'
{
  "primary": "#E50914",
  "background": "#141414",
  "theme": "dark",
  "languages": ["EN","HI","TE"]
}
EOF

cat > i18n/en.json <<'EOF'
{
  "welcome": "Welcome to Netflix-style Demo",
  "login": "Login",
  "signup": "Sign up",
  "watchlist": "Watchlist",
  "admin": "Admin Console"
}
EOF

cat > i18n/hi.json <<'EOF'
{
  "welcome": "Netflix शैली डेमो में आपका स्वागत है",
  "login": "लॉगिन",
  "signup": "साइन अप",
  "watchlist": "वॉचलिस्ट",
  "admin": "एडमिन कंसोल"
}
EOF

cat > i18n/te.json <<'EOF'
{
  "welcome": "నెట్‌ఫ్లిక్స్ శైలి డెమో కు స్వాగతం",
  "login": "లాగిన్",
  "signup": "సైన్ అప్",
  "watchlist": "వాచ్‌లిస్ట్",
  "admin": "అడ్మిన్ కన్సోల్"
}
EOF

mkdir -p .github/workflows
cat > .github/workflows/ci.yml <<'EOF'
name: CI
on:
  push:
    branches: [ main ]
  pull_request:
    branches: [ main ]
jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '18'
      - run: echo "CI placeholder"
EOF

cat > vercel.json <<'EOF'
{
  "version": 2,
  "builds": [
    { "src": "apps/nextjs-fullstack/package.json", "use": "@vercel/next" }
  ]
}
EOF

cat > infra/functions/index.js <<'EOF'
// Sample notification helper
const sgMail = require('@sendgrid/mail');
if (process.env.SENDGRID_API_KEY) {
  sgMail.setApiKey(process.env.SENDGRID_API_KEY);
}
exports.notifyNewSignup = async (userEmail) => {
  const adminEmail = process.env.ADMIN_EMAIL || 'admin@example.com';
  if (!process.env.SENDGRID_API_KEY) {
    console.log('Notification skipped. Admin:', adminEmail, 'User:', userEmail);
    return;
  }
  const msg = {
    to: adminEmail,
    from: 'noreply@example.com',
    subject: 'New user signup request',
    text: `User ${userEmail} requested access.`,
  };
  await sgMail.send(msg);
};
EOF

cat > apps/nextjs-fullstack/package.json <<'EOF'
{
  "name": "nextjs-fullstack",
  "version": "0.1.0",
  "private": true,
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start"
  },
  "dependencies": {
    "next": "14.0.0",
    "react": "18.2.0",
    "react-dom": "18.2.0"
  }
}
EOF

cat > apps/nextjs-fullstack/pages/index.js <<'EOF'
import React from 'react'
export default function Home() {
  return (
    <main style={{padding:40}}>
      <h1>Netflix-style Demo (Next.js Fullstack)</h1>
      <p>Dark theme with primary color <strong style={{color:'#E50914'}}>#E50914</strong></p>
      <p><a href="/admin">Admin Console</a></p>
    </main>
  )
}
EOF

cat > apps/nextjs-fullstack/pages/admin.js <<'EOF'
import React from 'react'
export default function Admin() {
  return (
    <main style={{padding:40}}>
      <h1>Admin Console (placeholder)</h1>
      <p>Admin email: admin@example.com</p>
    </main>
  )
}
EOF

cat > apps/nextjs-fullstack/pages/api/auth/register.js <<'EOF'
export default function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end()
  const { email } = req.body || {}
  if (!email) return res.status(400).json({ error: 'email required' })
  return res.status(201).json({ message: 'registration received', email })
}
EOF

cat > apps/nextjs-fullstack/README.md <<'EOF'
Run: cd apps/nextjs-fullstack && npm install && npm run dev
EOF

cat > apps/nextjs-tmdb/package.json <<'EOF'
{
  "name": "nextjs-tmdb",
  "version": "0.1.0",
  "private": true,
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start"
  },
  "dependencies": {
    "next": "14.0.0",
    "react": "18.2.0",
    "react-dom": "18.2.0"
  }
}
EOF

cat > apps/nextjs-tmdb/pages/index.js <<'EOF'
import React, { useEffect, useState } from 'react'
export default function Home() {
  const [movies, setMovies] = useState([])
  useEffect(() => {
    setMovies([{ id: 1, title: 'Mock Movie', overview: 'Add TMDB_API_KEY' }])
  }, [])
  return (
    <main style={{padding:24}}>
      <h1>Next.js TMDB Demo</h1>
      <ul>
        {movies.map(m => <li key={m.id}><strong>{m.title}</strong></li>)}
      </ul>
    </main>
  )
}
EOF

cat > apps/react-cra/README.md <<'EOF'
React CRA sample - run npx create-react-app . inside this folder
EOF

cat > apps/react-firebase/README.md <<'EOF'
React + Firebase sample placeholder
EOF

cat > apps/static-demo/index.html <<'EOF'
<!doctype html>
<html>
<head>
  <meta charset="utf-8" />
  <title>Static Netflix-style Demo</title>
  <link rel="stylesheet" href="../assets/theme.css">
</head>
<body>
  <header class="header" style="padding:20px"><h1>Netflix-style Static Demo</h1></header>
  <main style="padding:24px;"><p>Minimal static demo.</p></main>
</body>
</html>
EOF

cat > mobile/flutter/pubspec.yaml <<'EOF'
name: netflix_clone_flutter
environment:
  sdk: ">=2.18.0 <3.0.0"
dependencies:
  flutter:
    sdk: flutter
EOF

cat > mobile/flutter/lib/main.dart <<'EOF'
import 'package:flutter/material.dart';
void main() => runApp(MyApp());
class MyApp extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'Netflix-style Flutter Demo',
      theme: ThemeData(brightness: Brightness.dark, primaryColor: Color(0xFFE50914)),
      home: Scaffold(
        appBar: AppBar(title: Text('Netflix-style Demo')),
        body: Center(child: Text('EN / HI / TE')),
      ),
    );
  }
}
EOF

cat > mobile/flutter/README.md <<'EOF'
Flutter placeholder - flutter pub get && flutter run
EOF

cat > mobile/android/README.md <<'EOF'
Android skeleton - Open in Android Studio
EOF

cat > infra/README.md <<'EOF'
Infra sample notification helper
EOF

cat > docs/ADMIN_NOTES.md <<'EOF'
Admin: admin@example.com in examples/.env.example
EOF

git add .
git commit -m "Initial scaffold: Netflix clone samples with dark theme #E50914 and EN/HI/TE i18n"
git branch -M main
git push -u origin main
echo "Done!"