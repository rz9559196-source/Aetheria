# Aetheria: Chronicles of the Veil — MMORPG direction

## Product goal

Build an original, persistent browser MMORPG inspired by the long-term progression and social/economic loops of classic browser RPGs such as Грани Реальности. This is not a clone: all names, lore, maps, quests, characters, item art, balance, UI and implementation are original.

The existing MIT-licensed Aetheria codebase is the technical foundation (React/Three.js client, Colyseus authoritative multiplayer server, shared TypeScript content, Prisma/PostgreSQL persistence and GameHub Telegram SSO). Preserve the working GameHub SSO integration.

## Core design pillars

1. **Persistent character** — one Telegram identity can own multiple characters; progression and inventory persist between sessions.
2. **Meaningful progression** — level, attributes, class mastery, equipment, skills, reputation and professions all matter.
3. **Risk/reward economy** — monster drops, crafting, player trading, auction listings, repair and consumables create demand; high-tier gear must be rare.
4. **Social world** — global/local chat, friends, parties, guilds, trade and group dungeons.
5. **Repeatable goals** — daily/weekly quests, profession orders, dungeon rotations, world bosses and seasonal events.
6. **Fair competition** — opt-in PvP, arena ladders and guild events; no pay-to-win stat sales.

## Main gameplay loop

Explore a region → accept a quest or profession contract → fight monsters / gather resources → earn XP, currency and materials → improve equipment or craft/sell goods → unlock harder regions, dungeons and social activities.

## Character progression

- Attributes: Strength, Agility, Vitality, Intelligence, Dexterity, Luck.
- Starter paths: Warrior, Mage, Ranger, Acolyte, Rogue.
- Advancement tiers unlock through level + class quests, not just a level button.
- Equipment slots: head, chest, hands, legs, boots, main hand, off hand, amulet, two rings, cloak.
- Item rarity: Common, Uncommon, Rare, Epic, Legendary, Relic.
- Item stats and requirements are validated server-side.
- Respec is possible through an earned in-game resource with a meaningful cost.

## Combat direction

- Add a dedicated tactical combat mode alongside the existing real-time 3D field.
- Tactical encounters use a clear turn/action-point system: attack, defend, move, skill, potion and escape.
- Initiative is derived from attributes and equipment.
- Damage, hit, dodge, critical chance, block, resistance and status effects are resolved on the server.
- PvE first; PvP is opt-in and uses normalized matchmaking brackets.
- Party dungeons support 1–5 players, roles and boss mechanics.

## World and content

Initial release scope:
- Capital city with bank, market, auction, blacksmith, alchemist, trainers and guild hall.
- Three explorable regions, each with gathering nodes, NPCs, quest chains and 4–6 monster families.
- Two solo dungeons and one party dungeon with a boss.
- A rotating world event.
- A starter storyline of at least 15 connected quests.

Future content:
- More regions, sea travel, housing, pets, mounts, guild territory events, raids and seasonal chapters.

## Professions and economy

Initial professions:
- Mining, Logging, Herbalism, Fishing, Hunting, Smithing, Tailoring, Alchemy, Cooking.
- Gathered resources have tiers and region requirements.
- Crafting recipes have quality rolls based on skill, tools and materials.
- Player-to-player trade and auction are persistent database transactions.
- Gold sources and sinks must be monitored; monster drops should not flood the economy.
- No real-money purchase may directly grant best-in-slot gear or combat stats.

## Persistence and multiplayer requirements

- PostgreSQL is the source of truth for accounts, characters, inventory, equipment, quest progress, currencies, trades, auction, guilds and professions.
- Colyseus remains responsible for live room state and real-time presence.
- Every reward, trade, auction settlement and equipment change is validated and committed server-side.
- Use transactions for currency/item transfers; prevent duplicate claims and race conditions with unique IDs/idempotency.
- Telegram user ID is the external identity; GameHub issues the short-lived SSO ticket.
- Do not put secrets or database URLs in the repository.

## Release milestones

### M0 — Stability and access
- Verify build, migrations, GameHub SSO, character ownership, reconnect and persistent save/load.
- Add smoke tests for auth, character creation, inventory, equipment and room join.

### M1 — Classic RPG foundation
- Character sheet and full equipment slots.
- Server-authoritative attributes and derived stats.
- Tactical PvE combat with action points, initiative, logs and loot.
- Monster families, drop tables and first quest chain.
- Persistent inventory/equipment and safe equip/unequip/sell operations.

### M2 — World progression
- Capital city, region map, NPC services, daily quests.
- Gathering and first three professions.
- Crafting, repair, bank and item rarity/requirements.

### M3 — Multiplayer economy and community
- Player trade with confirmation on both sides.
- Auction house with atomic listing/purchase.
- Guilds, parties and group dungeon.
- Chat moderation, rate limits and audit logs.

### M4 — Endgame and live operations
- PvP arena, guild events, world bosses, weekly rankings and seasonal content.
- Economy telemetry, anti-exploit controls and performance/load tests.

## Acceptance criteria for M1

- Two Telegram users can create separate characters and play simultaneously.
- Character progress survives server restart and reconnect.
- All equipment slots save/load correctly; invalid items or stat values are rejected.
- Combat rewards are granted exactly once, even after reconnect/retry.
- A player cannot alter damage, loot, currency or inventory from the browser console.
- Mobile Telegram WebView remains usable; desktop browser remains supported.
- CI builds both client and server and runs unit/integration smoke tests.
