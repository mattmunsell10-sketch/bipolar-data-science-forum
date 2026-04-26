# Bipolar Data Science Forum — Complete Setup Guide
## Plain-English, Step-by-Step, From Zero to Live

---

## What you're building

A real website with:
- A **research library** (12 linked studies, filterable by category)
- A **data science projects** section (post your own, stored in a database)
- A **community forum** (real posts, real accounts, live updates)
- **User profiles** with persistent badges (Diagnosed · BD I, Data Scientist, etc.)
- **Login / sign-up** with email and password
- Everything **hosted free** on GitHub Pages

---

## The big picture — what each piece does

```
Your Files (GitHub)          Firebase (Google)          Users
┌─────────────────┐          ┌────────────────┐         ┌─────────┐
│  index.html     │◄────────►│  Firestore DB  │◄───────►│ Browser │
│  login.html     │          │  (posts,       │         │         │
│  signup.html    │◄────────►│   projects,    │         └─────────┘
│  profile.html   │          │   users)       │
│  css/styles.css │          ├────────────────┤
│  js/firebase.js │◄────────►│  Auth          │
└─────────────────┘          │  (accounts)    │
         ▲                   └────────────────┘
         │
  GitHub Pages
  (free hosting)
```

**GitHub Pages** = stores your HTML/CSS/JS files and makes them available at a URL.
**Firebase** = Google's free database service. Stores posts, projects, and user accounts in the cloud.

---

## PART 1 — Set up Firebase (your database)

### Step 1.1 — Create a Google account
If you have Gmail, you're set. Otherwise go to accounts.google.com and create one.

### Step 1.2 — Go to Firebase
1. Open your browser and go to: **https://firebase.google.com**
2. Click the blue **"Get started"** button
3. Click **"Add project"**
4. Type a project name: `bipolar-data-science-forum`
5. It will ask about Google Analytics — click **"Disable"** (you don't need it)
6. Click **"Create project"**
7. Wait ~30 seconds, then click **"Continue"**

You now have a Firebase project. Think of it as a filing cabinet in the cloud.

### Step 1.3 — Get your config keys
These are the "passwords" that let your website talk to your Firebase database.

1. On the Firebase dashboard, look for a **"</>"** icon (it means "web app") — click it
2. Give the app a nickname: `bdsf-web`
3. Check the box that says **"Also set up Firebase Hosting"** — skip this for now, click **"Register app"**
4. You'll see a block of code that looks like this:

```javascript
const firebaseConfig = {
  apiKey: "AIzaSy...",
  authDomain: "bipolar-data-science-forum.firebaseapp.com",
  projectId: "bipolar-data-science-forum",
  storageBucket: "bipolar-data-science-forum.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abcdef"
};
```

5. **Copy this entire block** — you'll paste it into `js/firebase.js` in a moment
6. Click **"Continue to console"**

### Step 1.4 — Enable Email/Password login
1. In the left sidebar, click **"Authentication"**
2. Click the **"Sign-in method"** tab
3. Click **"Email/Password"**
4. Toggle the first switch to **Enabled**
5. Click **"Save"**

Done. People can now create accounts with email + password.

### Step 1.5 — Create the Firestore database
This is where posts, projects, and profiles are stored.

1. In the left sidebar, click **"Firestore Database"**
2. Click **"Create database"**
3. It asks about rules — choose **"Start in test mode"** (we'll secure it properly below)
4. Choose a server location — pick **"us-central"** (or closest to you)
5. Click **"Done"**

### Step 1.6 — Set security rules
This controls who can read and write what. Copy and paste these rules:

1. In Firestore, click the **"Rules"** tab
2. Delete everything there and paste this:

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {

    // Anyone can read posts and projects
    match /posts/{postId} {
      allow read: if true;
      allow create: if request.auth != null;
      allow update: if request.auth != null && (
        request.auth.uid == resource.data.authorId ||
        request.resource.data.diff(resource.data).affectedKeys().hasOnly(['likes'])
      );
      allow delete: if request.auth.uid == resource.data.authorId;
    }

    match /projects/{projectId} {
      allow read: if true;
      allow create: if request.auth != null;
      allow update, delete: if request.auth.uid == resource.data.authorId;
    }

    // Users can only read/write their own profile
    match /users/{userId} {
      allow read: if true;
      allow write: if request.auth.uid == userId;
    }
  }
}
```

3. Click **"Publish"**

What these rules mean in plain English:
- Anyone (even logged-out visitors) can **read** posts, projects, and profiles
- Only **signed-in users** can create posts and projects
- You can only **edit or delete your own** posts, projects, and profile
- Anyone can **like** a post (just increments a number)

---

## PART 2 — Set up GitHub (your file storage + hosting)

### Step 2.1 — Create a GitHub account
1. Go to **https://github.com**
2. Click **"Sign up"** — use your email, create a username and password
3. Verify your email

### Step 2.2 — Create a repository
A "repository" (or "repo") is just a folder on GitHub that stores your code.

1. Click the **"+"** button in the top-right → **"New repository"**
2. Repository name: `bipolar-data-science-forum`
3. Make sure it's set to **"Public"** (required for free GitHub Pages)
4. Check **"Add a README file"**
5. Click **"Create repository"**

### Step 2.3 — Install GitHub Desktop (easiest way)
GitHub Desktop lets you drag files to upload without needing to learn command-line tools.

1. Go to **https://desktop.github.com**
2. Download and install it
3. Sign in with your GitHub account
4. Click **"Clone a repository"** → find `bipolar-data-science-forum` → click **Clone**
5. GitHub Desktop will create a folder on your computer — remember where it is

---

## PART 3 — Connect your config and upload files

### Step 3.1 — Paste your Firebase config
1. Open the folder GitHub Desktop created (it'll be something like `Documents/GitHub/bipolar-data-science-forum`)
2. Open the file `js/firebase.js` in any text editor (Notepad on Windows, TextEdit on Mac, or the free app **VS Code**)
3. Find lines that say:
```javascript
  apiKey:            "YOUR_API_KEY",
  authDomain:        "YOUR_PROJECT_ID.firebaseapp.com",
  ...
```
4. Replace those placeholder lines with the real values you copied from Firebase in Step 1.3
5. Save the file

### Step 3.2 — Copy all the site files into your GitHub folder
Take all the files from this project:
```
index.html
css/
  styles.css
js/
  firebase.js
pages/
  login.html
  signup.html
  profile.html
```
And copy/move them into the GitHub Desktop folder you cloned.

### Step 3.3 — Upload (commit + push) to GitHub
1. Open GitHub Desktop
2. You'll see a list of changed files on the left
3. At the bottom-left, type a summary: `Initial site upload`
4. Click **"Commit to main"**
5. Click **"Push origin"** (the blue button at the top)

Your files are now on GitHub.

---

## PART 4 — Turn on GitHub Pages (make it a real website)

1. Go to **https://github.com/YOUR_USERNAME/bipolar-data-science-forum**
   (replace YOUR_USERNAME with your actual GitHub username)
2. Click the **"Settings"** tab
3. In the left sidebar, click **"Pages"**
4. Under "Branch", change **"None"** to **"main"**
5. Leave the folder as **"/ (root)"**
6. Click **"Save"**

GitHub will think for ~2 minutes, then show you a URL that looks like:
**`https://YOUR_USERNAME.github.io/bipolar-data-science-forum`**

That's your live website. Share it with anyone.

---

## PART 5 — Test everything works

Go through this checklist:

**[ ] Homepage loads** — visit your URL, the hero section should appear

**[ ] Sign up works** — click "Join", create a test account with a fake email

**[ ] Profile loads** — after signing up you should land on your profile page

**[ ] Badges save** — select a few badges, click "Save badges", refresh — they should still be there

**[ ] Forum post works** — go back to the homepage, type something in the composer, click "Post"

**[ ] Post appears** — it should show up in the feed with your badges

**[ ] DS project submit works** — click the "+" card, fill in the form, submit — it should appear in the grid

**[ ] Sign out / Sign in** — sign out and sign back in, your profile should be intact

If any of these fail, the most common cause is a wrong value in `js/firebase.js`. Double-check your copied config.

---

## PART 6 — How to make updates going forward

Every time you change something on the site:
1. Edit the file on your computer
2. Open GitHub Desktop
3. Write a summary of what you changed
4. Click "Commit to main" → "Push origin"
5. Wait ~2 minutes, then refresh your live URL

---

## File map — what each file does

```
index.html          The main page: hero, research library, DS projects, forum, about
css/styles.css      All shared styling (colors, fonts, layout, buttons, badges)
js/firebase.js      Firebase connection + shared helper functions
pages/
  login.html        Sign-in page
  signup.html       Account creation page
  profile.html      User profile: edit name/bio, pick badges, see your posts
```

---

## How the database is organized

Firebase Firestore stores data as "collections" (like tables) containing "documents" (like rows).

**`users` collection** — one document per user
```
users/
  {userId}/
    displayName: "Matt Munsell"
    email: "matt@example.com"
    bio: "Data scientist with BD I..."
    profession: "Data Scientist"
    badges: ["Diagnosed · BD I", "Data Scientist"]
    joinedAt: timestamp
```

**`posts` collection** — one document per forum post
```
posts/
  {postId}/
    body: "Has anyone tried tracking HRV..."
    authorId: "{userId}"
    authorName: "Matt Munsell"
    badges: ["Diagnosed · BD I", "Data Scientist"]
    tags: ["wearables", "HRV"]
    likes: 14
    createdAt: timestamp
```

**`projects` collection** — one document per DS project
```
projects/
  {projectId}/
    title: "Mood prediction from wearables"
    desc: "Using Oura Ring data to..."
    tags: ["Python", "LSTM", "Oura"]
    status: "active"
    github: "https://github.com/..."
    authorId: "{userId}"
    authorName: "Matt Munsell"
    createdAt: timestamp
```

---

## Adding new research studies

Open `index.html`, find the `research-grid` section, and copy-paste a card block like this:

```html
<a href="JOURNAL_LINK_HERE" target="_blank" class="card" data-cat="neuro">
  <div class="rc-meta">
    <span class="rc-type type-neuro">Neuroscience</span>
    <span class="rc-year">2025</span>
  </div>
  <h3 class="rc-title">Your study title here</h3>
  <p class="rc-journal">Journal Name</p>
  <p class="rc-excerpt">Plain-English summary of what the study found.</p>
  <span class="rc-link">Read study ↗</span>
</a>
```

Change `data-cat` to one of: `neuro`, `behav`, `pharma`, `genetic`, `clinical`
Change `type-neuro` class to match: `type-neuro`, `type-behav`, `type-pharma`, `type-genetic`, `type-clinical`

---

## Costs

Everything here is **free**:
- Firebase Spark (free) plan: 50,000 reads/day, 20,000 writes/day, 1 GB storage — more than enough for a community forum
- GitHub Pages: free for public repositories, unlimited bandwidth
- Google Fonts: free

The site will only cost money if it grows to tens of thousands of daily active users — a good problem to have, and Firebase makes it easy to upgrade.

---

## Getting help

If you get stuck:
- **Firebase docs**: https://firebase.google.com/docs
- **GitHub Pages docs**: https://docs.github.com/en/pages
- **Stack Overflow**: search "Firebase Firestore [your problem]"
- Or ask me — paste the error message and I can help diagnose it.
