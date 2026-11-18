import { useEffect, useState } from "react";
import { useStore } from "./store";
import { CharacterSelect } from "./ui/CharacterSelect";
import { Game } from "./Game";
import { OrientationHint } from "./ui/OrientationPrompt";

function SsoRequired({ error }: { error?: string }) {
  return (
    <div className="w-full h-full min-h-screen flex items-center justify-center bg-[#090912] text-white p-6">
      <div className="max-w-md text-center border border-violet-400/30 bg-slate-950/80 rounded-2xl p-8 shadow-2xl">
        <div className="text-5xl mb-4">🌸</div>
        <h1 className="text-2xl font-black tracking-widest text-violet-200">AETHERIA ONLINE</h1>
        <p className="text-slate-300 mt-4">Увійди через Telegram у GameHub, щоб продовжити пригоду.</p>
        {error && <p className="text-rose-300 text-sm mt-4">{error}</p>}
        <a href={import.meta.env.VITE_GAMEHUB_URL || "https://gamehub-t6fl.onrender.com"} className="inline-block mt-6 rounded-xl px-6 py-3 font-bold bg-violet-400 text-slate-950">Повернутися до GameHub</a>
      </div>
    </div>
  );
}

export function App() {
  const token = useStore((s) => s.token);
  const characterId = useStore((s) => s.characterId);
  const setAuth = useStore((s) => s.setAuth);
  const [ssoBusy, setSsoBusy] = useState(false);
  const [ssoError, setSsoError] = useState<string | null>(null);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const ticket = params.get("gamehub_ticket");
    if (!ticket) return;
    params.delete("gamehub_ticket");
    const cleanUrl = window.location.pathname + (params.size ? "?" + params.toString() : "") + window.location.hash;
    window.history.replaceState({}, document.title, cleanUrl);
    let active = true;
    setSsoBusy(true);
    fetch("/api/auth/gamehub-sso", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ticket }),
    })
      .then(async (response) => {
        const data = await response.json().catch(() => ({}));
        if (!response.ok) throw new Error(data.error || "Не вдалося підтвердити вхід GameHub.");
        if (active) setAuth(data.token, data.username, data.characters ?? []);
      })
      .catch((error) => {
        if (active) setSsoError(error?.message || "Помилка авторизації.");
      })
      .finally(() => {
        if (active) setSsoBusy(false);
      });
    return () => { active = false; };
  }, [setAuth]);

  const hasTicket = new URLSearchParams(window.location.search).has("gamehub_ticket");
  return (
    <>
      <OrientationHint />
      {ssoBusy || (hasTicket && !token)
        ? <div className="w-full h-full min-h-screen flex items-center justify-center bg-[#090912] text-violet-200">Перевіряємо вхід GameHub…</div>
        : !token ? <SsoRequired error={ssoError ?? undefined} />
        : !characterId ? <CharacterSelect />
        : <Game />}
    </>
  );
}
