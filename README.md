# :video_game: Snake :snake:

The classic Snake in the browser, with an online leaderboard.

Eat as many apples as you can without biting yourself. Leave the board on one side and you come back on the other. Every 10 points, the snake speeds up.

## Demo

[snake.remiboissise.com](https://snake.remiboissise.com)

## Controls

| Action | Keyboard | Touch screen |
| --- | --- | --- |
| Steer | Arrow keys, Z Q S D (AZERTY) or W A S D (QWERTY) | Swipe on the board |
| Start and pause | Space bar | Tap the board |

The game pauses on its own when you switch tabs.

## Stack

- [React 19](https://react.dev) and [Vite](https://vite.dev)
- [Cloud Firestore](https://firebase.google.com/docs/firestore) (lite SDK, loaded only for the leaderboard)
- Game rules in `src/game/engine.js`, covered by unit tests run with the Node.js test runner

## Getting started

Requires Node.js 20.19 or later.

```sh
npm install
cp .env.example .env.local   # then fill in your Firebase values
npm run dev
```

Without Firebase values, the game still works and the leaderboard shows as not set up.

| Command | What it does |
| --- | --- |
| `npm run dev` | Starts the development server |
| `npm test` | Runs the unit tests of the game rules |
| `npm run build` | Builds the site into `dist/` |
| `npm run preview` | Serves the production build locally |
| `npm run deploy` | Builds and deploys to production with the Netlify CLI |

## Leaderboard and security

Scores live in the `ranking` collection of a Firestore database. The Firebase web API key is public by design: what protects the database is `firestore.rules`.

- Anyone can read the top 10, and nothing more.
- A new entry must hold exactly a name (1 to 20 characters), a whole score between 1 and 2,399, and the server time.
- Entries can never be edited or deleted from the browser.

Deploy the rules with the Firebase CLI:

```sh
npx firebase-tools login
npx firebase-tools deploy --only firestore:rules --project <your-project-id>
```

### App Check

[Firebase App Check](https://firebase.google.com/docs/app-check) makes Firestore answer only requests that come from the real site, using reCAPTCHA Enterprise. Scripts that call the database directly are turned away.

1. In the Firebase console, open **Project settings > Your apps** and register a web app if there is none. Copy its app ID into `VITE_FIREBASE_APP_ID`.
2. In the Google Cloud console, enable the **reCAPTCHA Enterprise API** and create a **website** key for your domain, without the checkbox challenge. Copy it into `VITE_RECAPTCHA_SITE_KEY`.
3. In the Firebase console, open **App Check**, register the web app with the **reCAPTCHA Enterprise** provider and that site key.
4. For local development, start `npm run dev`, copy the debug token the browser console prints, and add it under **App Check > Apps > Manage debug tokens**. Put it in `VITE_FIREBASE_APPCHECK_DEBUG_TOKEN` to keep it.
5. Deploy the site, check in **App Check > APIs > Cloud Firestore** that the requests are verified, then click **Enforce**.

The page shows Google's reCAPTCHA notice under the leaderboard instead of the floating badge.

### API key

In the Google Cloud console, under **APIs & Services > Credentials**, restrict the browser key to your site (`https://your-domain/*` and `http://localhost:5173/*`) and to the **Cloud Firestore API** and **Firebase App Check API**.

Scores are still computed in the browser: a player can always submit, from the real page, a fake score that respects the rules.
## Deployment

`netlify.toml` holds the build settings and the security headers (Content Security Policy, HSTS, etc.). On Netlify, set the variables of `.env.example` in the site's environment variables, except the debug token.

## Author

**Rémi Boissise**, [remiboissise.com](https://www.remiboissise.com)

## License

[MIT](LICENSE)