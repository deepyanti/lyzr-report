# Lyzr – Organic Performance Report
### Deploy to a live URL in ~5 minutes (no experience needed)

---

## What you need
- A free **GitHub** account → [github.com](https://github.com)
- A free **Vercel** account → [vercel.com](https://vercel.com) (sign up with your GitHub)

---

## Step 1 — Create a GitHub repo

1. Go to [github.com/repo/create](https://github.com/repo/create)
2. Name it anything, e.g. `lyzr-report`
3. Tick **"Add a README file"** (so the repo isn't empty)
4. Click **"Create repository"**

---

## Step 2 — Upload these files

1. Inside your new repo click **"Add file" → "New file"**
2. Upload each file below, one at a time, committing after each:

```
package.json
vite.config.js
index.html
src/main.jsx
src/index.css
src/App.jsx
public/favicon.svg
```

> **Tip:** when creating `src/main.jsx` etc., type the path
> exactly as shown (including the folder) in the filename box.
> GitHub will create the folder automatically.

3. After the last upload, click **"Commit changes"** on each file.

---

## Step 3 — Deploy on Vercel

1. Go to [vercel.com](https://vercel.com) → **"Add New" → "Project"**
2. Click **"Import Git Repository"** and select your `lyzr-report` repo
3. Vercel auto-detects Vite. Leave all defaults as they are.
4. Click **"Deploy"**
5. Wait ~15 seconds. Vercel gives you a live URL like:
   `https://lyzr-report.vercel.app`

**That's it — you're live.**

---

## Bonus: run it locally first

If you want to preview before deploying, open a terminal and run:

```bash
cd lyzr-report
npm install
npm run dev
```

Then open [http://localhost:5173](http://localhost:5173) in your browser.

---

## File map

| File                | What it does                                      |
|---------------------|---------------------------------------------------|
| `package.json`      | Lists dependencies (React, Vite)                  |
| `vite.config.js`    | Tells Vite to use the React plugin                |
| `index.html`        | HTML shell + Google Fonts link                    |
| `src/main.jsx`      | Mounts the app into the page                      |
| `src/index.css`     | Global reset + scrollbar styling                  |
| `src/App.jsx`       | The entire report — all sections & components     |
| `public/favicon.svg`| The lyzr shield icon in the browser tab           |
