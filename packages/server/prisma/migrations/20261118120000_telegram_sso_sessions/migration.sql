-- Telegram-linked accounts and database-backed one-time sessions.
ALTER TABLE "User" ADD COLUMN "telegramId" TEXT;
CREATE UNIQUE INDEX "User_telegramId_key" ON "User"("telegramId");

CREATE TABLE "RefreshToken" (
    "tokenHash" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "RefreshToken_pkey" PRIMARY KEY ("tokenHash"),
    CONSTRAINT "RefreshToken_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE
);
CREATE INDEX "RefreshToken_userId_idx" ON "RefreshToken"("userId");
CREATE INDEX "RefreshToken_expiresAt_idx" ON "RefreshToken"("expiresAt");

CREATE TABLE "SsoTicketNonce" (
    "jti" TEXT NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "SsoTicketNonce_pkey" PRIMARY KEY ("jti")
);
CREATE INDEX "SsoTicketNonce_expiresAt_idx" ON "SsoTicketNonce"("expiresAt");
