import type { Board } from "@/lib/leaderboardData";

const WIDTHS = [78, 62, 70, 50, 66, 45, 58, 40, 52, 36];

export function LeaderboardBoard({ board, accent }: { board: Board; accent: string }) {
  return (
    <div className="rounded-2xl border p-5" style={{ borderColor: "var(--border)", background: "var(--bg-card)" }}>
      <div className="flex items-center justify-between gap-3 mb-1">
        <h3 className="font-display font-semibold text-base">{board.name}</h3>
        <span className="shrink-0 text-[10px] font-semibold uppercase tracking-wide px-2 py-0.5 rounded-full"
          style={{ color: accent, background: `${accent}18` }}>
          Top 10
        </span>
      </div>
      {board.desc && <p className="text-xs text-[var(--text-dim)] mb-3">{board.desc}</p>}

      <div className="flex flex-col divide-y mt-3" style={{ borderColor: "var(--border)" }}>
        {WIDTHS.map((w, i) => (
          <div key={i} className="flex items-center gap-3 py-1.5">
            <span className="w-4 text-[11px] font-semibold text-center shrink-0"
              style={{ color: i < 3 ? accent : "var(--text-dim)" }}>
              {i + 1}
            </span>
            <span className="h-2 rounded-full" style={{ width: `${w}%`, background: "var(--border-hi)" }} />
            <span className="h-2 w-8 rounded-full shrink-0 ml-auto" style={{ background: "var(--border-hi)" }} />
          </div>
        ))}
      </div>

      <p className="text-[11px] text-[var(--text-dim)] mt-3 text-center">🔒 Live rankings connecting soon</p>
    </div>
  );
}
