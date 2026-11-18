# Free deployment: Aetheria + GameHub

This configuration is intended for a $0/month test deployment. Aetheria runs as a Render Free Docker Web Service; PostgreSQL is hosted on Neon's Free plan so the database is not tied to Render's 30-day free-Postgres expiry.

## 1. Create a free PostgreSQL database on Neon

1. Create a free account at https://neon.com/.
2. Create a project named \`aetheria\`.
3. Open **Connect** and copy two PostgreSQL connection strings: one with **Connection pooling ON** and one with **Connection pooling OFF**.
4. Keep both strings private and ensure they include SSL (usually \`?sslmode=require\`).

Neon's current Free plan includes 1 GB storage and 100 compute-unit hours per project each month. Compute sleeps after inactivity and wakes when queried. When the monthly compute or network allowance is exhausted, the database pauses until the allowance resets. See https://neon.com/docs/introduction/plans.

## 2. Deploy Aetheria on Render for free

1. Open Render → **New → Blueprint**.
2. Choose repository \`rz9559196-source/Aetheria\`.
3. Select branch \`render-telegram-integration\` (or \`main\` after merging the PR).
4. Render reads \`render.yaml\` and creates only a **Free** web service. It does not create a paid Render database.
5. When prompted for environment variables, set:
   - \`DATABASE_URL\`: the Neon pooled connection string (pooling ON)
   - \`DIRECT_URL\`: the Neon direct connection string (pooling OFF; used for schema migrations)
   - \`AETHERIA_SSO_SECRET\`: a random secret of at least 32 characters

Generate a secret locally with:

\`\`\`bash
openssl rand -hex 32
\`\`\`

Copy the resulting secret somewhere safe; do not commit it to GitHub.

## 3. Configure GameHub

In Render → GameHub → Environment, set:

- \`AETHERIA_PUBLIC_URL\`: the public URL of the Aetheria Free Web Service, e.g. \`https://aetheria-online.onrender.com\`
- \`AETHERIA_SSO_SECRET\`: exactly the same secret used by Aetheria

Save and redeploy GameHub.

## 4. Test

- Open \`https://<aetheria-service>.onrender.com/health\` and check that it responds.
- Open GameHub while logged in with Telegram and launch Aetheria.
- Create a character, enter the world, and test a second Telegram account in another browser.

## Free-plan limitations — important

- Render Free Web Services have 512 MB RAM and 0.1 CPU, spin down after 15 minutes without inbound traffic, and can take about a minute to wake. WebSocket activity keeps the service active only while traffic continues.
- Free Render services can restart and have ephemeral local filesystems. Do not save player progression to local files.
- Neon Free has 1 GB storage and 100 compute-unit hours per month. Its database compute scales to zero after 5 minutes of inactivity and may pause when monthly limits are reached.
- This is a test/hobby setup, not reliable always-on MMO hosting. Large worlds, many concurrent players, or heavy 3D server simulation may exceed the free CPU/RAM quotas.
- Make periodic database exports. Neon Free is not a substitute for a production backup plan.

The Telegram bot token is not needed by Aetheria and must not be placed in the browser or in this repository.
