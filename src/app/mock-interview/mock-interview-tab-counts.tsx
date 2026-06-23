// ─────────────────────────────────────────────────────────────────────────────
// PATCH: Add question counts to category tabs in src/app/mock-interview/page.tsx
//
// STEP 1 — add this import at the top of the file alongside the other bank imports:
// ─────────────────────────────────────────────────────────────────────────────

import { CAT_ICO, CAT_ORDER, BANK, COMPANIES, getCategoryCounts } from "@/data/interviewBank";

// ─────────────────────────────────────────────────────────────────────────────
// STEP 2 — inside the component, compute counts once (outside any render loop):
// ─────────────────────────────────────────────────────────────────────────────

const catCounts = getCategoryCounts();

// ─────────────────────────────────────────────────────────────────────────────
// STEP 3 — in your JSX, replace your current category tab buttons with this.
//   The key change: each tab now shows the count in a small badge top-right.
//   Copy-paste this block wherever you render the CAT_ORDER tab strip.
// ─────────────────────────────────────────────────────────────────────────────

//   {CAT_ORDER.map((cat) => (
//     <button
//       key={cat}
//       onClick={() => setSelectedCat(cat)}
//       className={`relative flex items-center gap-2 px-5 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap ${
//         selectedCat === cat
//           ? "bg-[var(--accent)] text-white shadow-lg shadow-[var(--accent)]/20"
//           : "bg-slate-900/40 border border-slate-800 text-slate-500 hover:text-[var(--accent)] hover:border-[var(--accent)]/30"
//       }`}
//     >
//       <span>{CAT_ICO[cat]}</span>
//       <span>{cat}</span>
//       {/* Count badge - top-right corner */}
//       <span
//         className={`absolute -top-1.5 -right-1.5 min-w-[18px] h-[18px] px-1 rounded-full text-[9px] font-black flex items-center justify-center ${
//           selectedCat === cat
//             ? "bg-white text-[var(--accent)]"
//             : "bg-slate-700 text-slate-300"
//         }`}
//       >
//         {catCounts[cat] ?? 0}
//       </span>
//     </button>
//   ))}

// ─────────────────────────────────────────────────────────────────────────────
// ALTERNATIVE: If your tabs are horizontal scroll pills, use this inline count
// variant instead (no absolute positioning needed):
// ─────────────────────────────────────────────────────────────────────────────

/*
  {CAT_ORDER.map((cat) => (
    <button
      key={cat}
      onClick={() => setSelectedCat(cat)}
      className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap ${
        selectedCat === cat
          ? "bg-[var(--accent)] text-white shadow-lg"
          : "bg-slate-900/40 border border-slate-800 text-slate-500 hover:text-[var(--accent)]"
      }`}
    >
      <span>{CAT_ICO[cat]}</span>
      <span>{cat}</span>
      <span
        className={`ml-1 px-1.5 py-0.5 rounded-full text-[9px] font-black ${
          selectedCat === cat
            ? "bg-white/20 text-white"
            : "bg-slate-800 text-slate-400"
        }`}
      >
        {catCounts[cat] ?? 0}
      </span>
    </button>
  ))}
*/
