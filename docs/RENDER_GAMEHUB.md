# Deploy Aetheria on Render with GameHub Telegram SSO

Aetheria runs as a Docker Web Service. Express serves the built client and API, and Colyseus serves multiplayer WebSockets on the same Render port. PostgreSQL stores player data, refresh-token hashes, and single-use SSO ticket IDs.

## 1. Deploy the Aetheria Blueprint

1. In Render, choose **New → Blueprint**.
2. Select `rz9559196-source/Aetheria` and branch `render-telegram-integration` (or `main` after merging the pull request).
3. Render reads `render.yaml` and creates the Docker Web Service and PostgreSQL database.
4. When prompted for `AETHERIA_SSO_SECRET`, enter a randomly generated secret of at least 32 characters. Keep it private.

Generate one shared secret locally:

```bash
openssl rand -hex 32
```

The Web Service plan is `standard` so the 3D MMO server has more memory than a free sleeping instance. PostgreSQL is provisioned separately; do not store game progress on the container filesystem.

## 2. Configure GameHub

In Render → GameHub → Environment, set:

- `AETHERIA_PUBLIC_URL`: the public URL of the Aetheria Web Service, e.g. `https://aetheria-online.onrender.com`.
- `AETHERIA_SSO_SECRET`: exactly the same secret entered for Aetheria.

Save and redeploy GameHub after the GameHub integration pull request is merged.

## 3. Verify

- Open `https://<aetheria-service>/health` and confirm the server reports healthy.
- Open GameHub while logged in through Telegram and launch Aetheria.
- The first launch should show the character selection screen. Create a character, enter the world, and open a second browser session with a different Telegram account to test multiplayer.
- Aetheria should use `wss://` automatically on HTTPS.

## Security notes

- The Telegram bot token is never sent to Aetheria or the browser.
- GameHub issues a 90-second HS256 ticket. Aetheria checks issuer, audience, expiry, signature, and single-use ID.
- The ticket is passed to the iframe with an origin-checked `postMessage`, not placed in a URL.
- Set the same secret on both services. If it differs, SSO fails closed.
- Do not commit secrets to GitHub.
- Redis is optional for a single Aetheria instance. PostgreSQL stores refresh-token hashes and one-time ticket IDs.
