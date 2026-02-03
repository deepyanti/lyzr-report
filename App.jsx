import { useState, useEffect, useRef } from "react";

/* ─── DESIGN TOKENS ─── */
const T = {
  cream: "#f4efe9",
  creamDark: "#ebe4db",
  warmBrown: "#3a2e2a",
  warmBrownMid: "#5c4f47",
  textSec: "#7a6e66",
  textMuted: "#a89588",
  gold: "#b8956a",
  goldLight: "#d4b896",
  goldPale: "rgba(184,149,106,0.13)",
  green: "#4a8c6f",
  greenLight: "#eaf4ef",
  rose: "#b86b5a",
  rosePale: "rgba(184,107,90,0.1)",
  blue: "#5a8da8",
  bluePale: "rgba(90,141,168,0.1)",
  shadow: "0 2px 20px rgba(58,46,42,0.07)",
  shadowMd: "0 6px 32px rgba(58,46,42,0.11)",
};

/* ─── SCROLL-REVEAL HOOK ─── */
function useReveal() {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) setVisible(true); },
      { threshold: 0.15 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
  return [ref, visible];
}

/* ─── ANIMATED NUMBER ─── */
function AnimNum({ target, duration = 1200 }) {
  const [val, setVal] = useState(0);
  const [ref, vis] = useReveal();
  useEffect(() => {
    if (!vis) return;
    const start = performance.now();
    const step = (now) => {
      const p = Math.min((now - start) / duration, 1);
      const ease = 1 - Math.pow(1 - p, 3);
      setVal(Math.round(target * ease));
      if (p < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [vis, target, duration]);

  const display =
    target >= 1000000
      ? (val / 1000000).toFixed(2) + "M"
      : target >= 1000
      ? (val / 1000).toFixed(1) + "K"
      : val.toLocaleString();

  return <span ref={ref}>{display}</span>;
}

/* ─── ANIMATED HORIZONTAL BAR ─── */
function MiniBar({ label, value, pct, color, delay = 0 }) {
  const [ref, vis] = useReveal();
  return (
    <div ref={ref} style={{ display: "flex", alignItems: "center", gap: 12, padding: "7px 0" }}>
      <span style={{ width: 72, textAlign: "right", fontSize: 13, color: T.textSec, fontWeight: 500, flexShrink: 0 }}>{label}</span>
      <div style={{ flex: 1, height: 22, background: T.creamDark, borderRadius: 6, overflow: "hidden" }}>
        <div style={{
          height: "100%",
          borderRadius: 6,
          background: color,
          width: vis ? `${pct}%` : "0%",
          transition: `width 1s cubic-bezier(0.22,1,0.36,1) ${delay * 0.08}s`,
          display: "flex",
          alignItems: "center",
          paddingLeft: 10,
          color: "#fff",
          fontSize: 12,
          fontWeight: 600,
          whiteSpace: "nowrap",
        }}>
          {vis && pct > 6 && value.toLocaleString()}
        </div>
      </div>
      <span style={{ width: 52, textAlign: "right", fontSize: 13, fontWeight: 600, color: T.warmBrown, flexShrink: 0 }}>{pct}%</span>
    </div>
  );
}

/* ─── FUNNEL ARROW ─── */
const FunnelArrow = () => (
  <div style={{ display: "flex", justifyContent: "center", padding: "4px 0" }}>
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={T.goldLight} strokeWidth="2.5" strokeLinecap="round">
      <line x1="12" y1="4" x2="12" y2="18" />
      <polyline points="7,13 12,18 17,13" />
    </svg>
  </div>
);

/* ─── INSIGHT BOX ─── */
function InsightBox({ children, variant = "gold" }) {
  const styles = {
    gold:  { bg: "linear-gradient(135deg,#faf7f2,#f5efe6)", border: "rgba(184,149,106,0.25)", icon: T.gold,  iconBg: T.goldPale },
    green: { bg: "linear-gradient(135deg,#f2faf6,#eaf5ef)", border: "rgba(74,140,111,0.22)",  icon: T.green, iconBg: "rgba(74,140,111,0.13)" },
  };
  const s = styles[variant];
  return (
    <div style={{ background: s.bg, border: `1px solid ${s.border}`, borderRadius: 14, padding: "18px 20px", display: "flex", gap: 14, alignItems: "flex-start", marginTop: 18 }}>
      <div style={{ width: 34, height: 34, borderRadius: 10, background: s.iconBg, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={s.icon} strokeWidth="2" strokeLinecap="round">
          <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
        </svg>
      </div>
      <div style={{ fontSize: 14, color: T.textSec, lineHeight: 1.6 }}>{children}</div>
    </div>
  );
}

/* ─── REUSABLE SECTION LABEL ─── */
function SectionLabel({ num }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
      <div style={{ width: 28, height: 2.5, background: T.gold, borderRadius: 1.5 }} />
      <span style={{ fontSize: 11, textTransform: "uppercase", letterSpacing: "2px", color: T.textMuted, fontWeight: 600 }}>Section {num}</span>
    </div>
  );
}

/* ─── REUSABLE CARD WRAPPER ─── */
function Card({ title, badge, children }) {
  return (
    <div style={{ background: "#fff", border: "1px solid rgba(120,90,60,0.08)", borderRadius: 18, boxShadow: T.shadow, overflow: "hidden" }}>
      <div style={{ padding: "20px 24px 0", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <span style={{ fontFamily: "'Playfair Display', serif", fontSize: 18, fontWeight: 600, color: T.warmBrown }}>{title}</span>
        {badge && <span style={{ fontSize: 11, background: T.cream, border: "1px solid rgba(120,90,60,0.1)", color: T.textSec, padding: "4px 11px", borderRadius: 14, fontWeight: 500 }}>{badge}</span>}
      </div>
      <div style={{ padding: "18px 24px 22px" }}>{children}</div>
    </div>
  );
}

/* ─── REUSABLE 3-COL TABLE ─── */
function DataTable({ headers, rows, colorCol }) {
  return (
    <table style={{ width: "100%", borderCollapse: "collapse" }}>
      <thead>
        <tr style={{ borderBottom: `1px solid ${T.creamDark}` }}>
          {headers.map((h, i) => (
            <th key={i} style={{ textAlign: i === 0 ? "left" : "right", fontSize: 11, textTransform: "uppercase", letterSpacing: "1px", color: T.textMuted, fontWeight: 600, paddingBottom: 12 }}>{h}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {rows.map((row, i) => (
          <tr key={i} style={{ borderBottom: i < rows.length - 1 ? "1px solid rgba(120,90,60,0.04)" : "none" }}>
            {row.map((cell, ci) => (
              <td key={ci} style={{
                padding: "13px 0",
                textAlign: ci === 0 ? "left" : "right",
                fontWeight: ci === 0 ? 500 : ci === colorCol ? 600 : 500,
                fontSize: 14,
                color: ci === colorCol && cell.color ? cell.color : ci === 0 ? T.warmBrown : "inherit",
              }}>
                {typeof cell === "object" ? cell.label : cell}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
}

/* ─── DATA ─── */
const IMPRESSIONS = [
  { month: "Nov", value: 1010000, growth: null },
  { month: "Dec", value: 1200000, growth: "+19%" },
  { month: "Jan", value: 1860000, growth: "+55%" },
];
const TRAFFIC = [
  { month: "Nov", clicks: 17500, ctr: "1.7%" },
  { month: "Dec", clicks: 16300, ctr: "1.4%" },
  { month: "Jan", clicks: 17900, ctr: "1.0%" },
];
const MQLS = [
  { month: "Nov", mqls: 101, rate: "0.58%" },
  { month: "Dec", mqls: 56,  rate: "0.34%" },
  { month: "Jan", mqls: 59,  rate: "0.33%" },
];
const RANKINGS = [
  { label: "51–100",     value: 3231, color: "#c08060" },
  { label: "21–50",      value: 3320, color: "#8e7ab5" },
  { label: "11–20",      value: 938,  color: T.blue },
  { label: "4–10",       value: 406,  color: "#7aab8d" },
  { label: "Other SERP", value: 288,  color: T.green },
  { label: "AI Overview",value: 185,  color: "#d4866a" },
  { label: "Top 3",      value: 88,   color: T.gold },
];
const TOTAL_KEYWORDS = 8456;

/* ════════════════════════════════════════════════════════════
   MAIN EXPORT
   ════════════════════════════════════════════════════════════ */
export default function LyzrReport() {
  useEffect(() => { window.scrollTo(0, 0); }, []);
  const [activeNav, setActiveNav] = useState(0);
  const navItems = ["Executive Summary", "Visibility", "Traffic", "Lead Gen", "Funnel", "Outlook"];

  /* shared heading style */
  const H2 = { fontFamily: "'Playfair Display', serif", fontSize: 26, fontWeight: 600, color: T.warmBrown, letterSpacing: "-0.3px" };
  const bodyP = { fontSize: 14.5, color: T.textSec, lineHeight: 1.7, marginTop: 8, marginBottom: 20, maxWidth: 680 };

  return (
    <div style={{ fontFamily: "'DM Sans', sans-serif", background: T.cream, color: T.warmBrown, minHeight: "100vh" }}>

      {/* ─── HERO ─── */}
      <div style={{ background: "linear-gradient(150deg, #ece5dc 0%, #f0e8df 45%, #e7ddd3 100%)", padding: "52px 32px 60px", position: "relative", overflow: "hidden", borderBottom: "1px solid rgba(120,90,60,0.07)" }}>
        <div style={{ position: "absolute", top: -100, right: -80, width: 360, height: 360, borderRadius: "50%", background: "radial-gradient(circle, rgba(184,149,106,0.14) 0%, transparent 70%)", pointerEvents: "none" }} />
        <div style={{ position: "absolute", bottom: -80, left: "8%", width: 280, height: 220, borderRadius: "50%", background: "radial-gradient(ellipse, rgba(184,149,106,0.09) 0%, transparent 70%)", pointerEvents: "none" }} />

        <div style={{ maxWidth: 920, margin: "0 auto", position: "relative", zIndex: 1, display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 28 }}>
          <div>
            {/* logo */}
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 24 }}>
              <div style={{ width: 38, height: 38, background: T.warmBrown, borderRadius: 11, display: "flex", alignItems: "center", justifyContent: "center" }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 2L4 6v6c0 5.25 3.83 10.15 8 11.25C16.17 22.15 20 17.25 20 12V6l-8-4z" /><polyline points="9 12 11 14 15 10" />
                </svg>
              </div>
              <span style={{ fontWeight: 600, fontSize: 21, color: T.warmBrown, letterSpacing: "-0.4px" }}>lyzr</span>
            </div>
            <h1 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: 42, fontWeight: 700, color: T.warmBrown, lineHeight: 1.12, letterSpacing: "-0.6px" }}>
              Organic Performance<br />
              <span style={{ fontStyle: "italic", color: T.gold }}>Report</span>
            </h1>
            <p style={{ marginTop: 14, fontSize: 15, color: T.textSec, lineHeight: 1.6, maxWidth: 500 }}>
              A strategic view of search visibility, traffic quality, and lead generation performance — Nov 2025 through Jan 2026.
            </p>
          </div>
          {/* meta badges */}
          <div style={{ display: "flex", flexDirection: "column", gap: 8, alignItems: "flex-end" }}>
            {[["Period", "Nov 2025 – Jan 2026"], ["Domain", "lyzr.ai"], ["Generated", "Feb 3, 2026"]].map(([k, v], i) => (
              <div key={i} style={{ background: "rgba(255,255,255,0.72)", border: "1px solid rgba(120,90,60,0.1)", borderRadius: 20, padding: "6px 16px", fontSize: 13, color: T.textSec, backdropFilter: "blur(4px)" }}>
                <strong style={{ color: T.warmBrown }}>{k}:</strong> {v}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ─── STICKY NAV ─── */}
      <div style={{ position: "sticky", top: 0, zIndex: 40, background: "rgba(244,239,233,0.92)", backdropFilter: "blur(12px)", borderBottom: "1px solid rgba(120,90,60,0.08)", padding: "0 24px" }}>
        <div style={{ maxWidth: 920, margin: "0 auto", display: "flex", gap: 4, overflowX: "auto" }}>
          {navItems.map((s, i) => (
            <button key={i} onClick={() => setActiveNav(i)} style={{
              background: activeNav === i ? T.goldPale : "transparent",
              border: "none", borderRadius: 8, padding: "12px 16px", fontSize: 13, fontWeight: 500,
              color: activeNav === i ? T.gold : T.textSec, cursor: "pointer", whiteSpace: "nowrap",
              transition: "all 0.2s", fontFamily: "'DM Sans', sans-serif",
            }}>{s}</button>
          ))}
        </div>
      </div>

      {/* ─── BODY ─── */}
      <div style={{ maxWidth: 920, margin: "0 auto", padding: "40px 28px 90px" }}>

        {/* ── KPI STRIP ── */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(175px, 1fr))", gap: 14, marginBottom: 38 }}>
          {[
            { label: "Total Impressions", val: 4070000, change: "+84%",            up: true,  accent: T.blue },
            { label: "Total Clicks",      val: 51700,   change: "+2.3%",           up: true,  accent: T.green },
            { label: "Total MQLs",        val: 216,     change: "Stabilizing",     up: null,  accent: T.gold },
            { label: "Keyword Positions", val: 8456,    change: "Jan 31 snapshot", up: null,  accent: T.warmBrownMid },
          ].map((k, i) => (
            <div key={i}
              style={{ background: "#fff", border: "1px solid rgba(120,90,60,0.08)", borderRadius: 16, padding: "20px 18px", boxShadow: T.shadow, position: "relative", overflow: "hidden", transition: "box-shadow 0.25s" }}
              onMouseEnter={e => (e.currentTarget.style.boxShadow = T.shadowMd)}
              onMouseLeave={e => (e.currentTarget.style.boxShadow = T.shadow)}
            >
              <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 3, background: k.accent }} />
              <div style={{ fontSize: 11, textTransform: "uppercase", letterSpacing: "0.9px", color: T.textMuted, fontWeight: 600, marginBottom: 8 }}>{k.label}</div>
              <div style={{ fontSize: 30, fontFamily: "'Playfair Display', serif", fontWeight: 700, color: T.warmBrown, letterSpacing: "-1px", lineHeight: 1 }}>
                <AnimNum target={k.val} />
              </div>
              <div style={{
                display: "inline-flex", alignItems: "center", gap: 4, marginTop: 10, fontSize: 13, fontWeight: 500, borderRadius: 12, padding: "3px 9px",
                background: k.up === true ? T.greenLight : k.up === false ? T.rosePale : T.bluePale,
                color: k.up === true ? T.green : k.up === false ? T.rose : T.blue,
              }}>{k.change}</div>
            </div>
          ))}
        </div>

        {/* ════ 01 — EXECUTIVE SUMMARY ════ */}
        <SectionLabel num="01" />
        <h2 style={H2}>Executive Summary</h2>
        <p style={bodyP}>
          Over the Nov–Jan window, lyzr.ai executed a deliberate visibility expansion strategy — significantly broadening its keyword footprint and search presence. Impressions surged <strong style={{ color: T.warmBrown }}>+84%</strong> in two months, the keyword portfolio grew to over <strong style={{ color: T.warmBrown }}>8,400 tracked positions</strong>, and the domain maintained a healthy authority score of <strong style={{ color: T.warmBrown }}>31</strong> backed by <strong style={{ color: T.warmBrown }}>29.9K backlinks</strong> across 2.2K referring domains. Traffic held steady and MQL volume stabilised — both expected hallmarks of a scaling phase now primed to convert into stronger bottom-line performance.
        </p>
        <InsightBox variant="green">
          <strong style={{ color: T.warmBrown }}>Strategic Position:</strong> We are at an inflection point. The top-of-funnel foundation is built. As high-intent keywords move into Page 1, both CTR and MQL conversion efficiency are set to compound — turning visibility gains into measurable revenue.
        </InsightBox>

        {/* ════ 02 — VISIBILITY GROWTH ════ */}
        <SectionLabel num="02" />
        <h2 style={{ ...H2, marginTop: 46 }}>Visibility Growth</h2>
        <p style={bodyP}>
          Search impressions — the broadest measure of discoverability — grew at an accelerating pace, reflecting the compounding effect of new content indexed alongside strengthening link equity.
        </p>

        <Card title="Monthly Impressions" badge="+84% Growth">
          <DataTable
            headers={["Month", "Impressions", "MoM Growth"]}
            colorCol={2}
            rows={IMPRESSIONS.map(r => [
              r.month,
              r.value >= 1e6 ? (r.value / 1e6).toFixed(2) + "M" : (r.value / 1e3).toFixed(1) + "K",
              r.growth ? { label: r.growth, color: T.green } : { label: "—", color: T.textMuted },
            ])}
          />
        </Card>

        <Card title="Keyword Ranking Distribution" badge="8,456 Keywords" />
        <div style={{ background: "#fff", border: "1px solid rgba(120,90,60,0.08)", borderRadius: 18, boxShadow: T.shadow, marginTop: -18, paddingBottom: 22 }}>
          <div style={{ padding: "4px 24px 0" }}>
            {RANKINGS.map((r, i) => (
              <MiniBar key={i} label={r.label} value={r.value} pct={+((r.value / TOTAL_KEYWORDS) * 100).toFixed(1)} color={r.color} delay={i} />
            ))}
            <div style={{ marginTop: 14, paddingTop: 12, borderTop: `1px solid ${T.creamDark}`, display: "flex", justifyContent: "space-between" }}>
              <span style={{ fontWeight: 600, fontSize: 14, color: T.warmBrown }}>Total Tracked</span>
              <span style={{ fontWeight: 700, fontSize: 14, color: T.warmBrown }}>{TOTAL_KEYWORDS.toLocaleString()}</span>
            </div>
          </div>
        </div>

        <InsightBox>
          <strong style={{ color: T.warmBrown }}>Insight:</strong> With 494 keywords already in the Top 10 and 938 in positions 11–20, a significant cohort is on the cusp of Page 1 — each position gained here delivers outsized CTR lift. The 185 AI Overview appearances also signal growing topical authority in Google's generative results.
        </InsightBox>

        {/* ════ 03 — TRAFFIC ════ */}
        <SectionLabel num="03" />
        <h2 style={{ ...H2, marginTop: 46 }}>Traffic & Engagement Trends</h2>
        <p style={bodyP}>
          Click volume recovered strongly in January to <strong style={{ color: T.warmBrown }}>17.9K</strong> — surpassing the November baseline. CTR is currently adjusting as the keyword mix broadens; this is a predictable, healthy pattern during expansion phases and will normalise as rankings consolidate.
        </p>

        <Card title="Clicks & Click-Through Rate" badge="Nov – Jan">
          <DataTable
            headers={["Month", "Clicks", "CTR"]}
            colorCol={2}
            rows={TRAFFIC.map((r, i) => [
              r.month,
              (r.clicks / 1000).toFixed(1) + "K",
              { label: r.ctr, color: i === 0 ? T.gold : T.blue },
            ])}
          />
        </Card>

        <InsightBox>
          <strong style={{ color: T.warmBrown }}>Insight:</strong> January's click recovery to 17.9K — above the Nov baseline — while ranking for a substantially wider keyword set, demonstrates that the content is resonating. CTR will improve as the strongest-performing keywords consolidate into Page 1.
        </InsightBox>

        {/* ════ 04 — LEAD GEN ════ */}
        <SectionLabel num="04" />
        <h2 style={{ ...H2, marginTop: 46 }}>Lead Generation Trends</h2>
        <p style={bodyP}>
          MQL volume stabilised in Jan at <strong style={{ color: T.warmBrown }}>59</strong> — holding steady after the Dec dip. The conversion rate is maturing alongside the broader keyword mix, and the Dec→Jan stabilisation signals we are past the initial expansion adjustment.
        </p>

        <Card title="MQL Volume & Conversion" badge="Click → MQL">
          <DataTable
            headers={["Month", "MQLs", "Conversion Rate"]}
            colorCol={2}
            rows={MQLS.map((r, i) => [
              r.month,
              r.mqls.toString(),
              { label: r.rate, color: i === 0 ? T.green : T.blue },
            ])}
          />
        </Card>

        <InsightBox>
          <strong style={{ color: T.warmBrown }}>Insight:</strong> The Dec→Jan stabilisation at 56→59 MQLs confirms the expansion phase is maturing. As high-intent keywords move up the rankings, we expect conversion volume to scale alongside the already-strong visibility foundation.
        </InsightBox>

        {/* ════ 05 — FULL FUNNEL ════ */}
        <SectionLabel num="05" />
        <h2 style={{ ...H2, marginTop: 46 }}>Full Funnel Analysis</h2>
        <p style={bodyP}>End-to-end: how search visibility converts into engaged traffic and qualified leads — month by month.</p>

        <div style={{ background: "#fff", border: "1px solid rgba(120,90,60,0.08)", borderRadius: 18, boxShadow: T.shadow }}>
          <div style={{ padding: "22px 28px 26px" }}>
            {[
              { emoji: "👁", label: "Impressions", sub: "Search visibility — top of funnel", dot: T.bluePale,   vals: IMPRESSIONS.map(d => (d.value / 1e6).toFixed(2) + "M") },
              { emoji: "🖱", label: "Clicks",      sub: "Engaged visitors",                dot: T.greenLight, vals: TRAFFIC.map(d => (d.clicks / 1e3).toFixed(1) + "K") },
              { emoji: "🎯", label: "MQLs",        sub: "Qualified leads — bottom of funnel", dot: T.goldPale,   vals: MQLS.map(d => d.mqls.toString()) },
            ].map((stage, si) => (
              <div key={si}>
                <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
                  <div style={{ width: 48, height: 48, borderRadius: 14, background: stage.dot, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20, flexShrink: 0 }}>{stage.emoji}</div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 600, fontSize: 15, color: T.warmBrown }}>{stage.label}</div>
                    <div style={{ fontSize: 12, color: T.textMuted }}>{stage.sub}</div>
                  </div>
                  <div style={{ display: "flex", gap: 20 }}>
                    {stage.vals.map((v, mi) => (
                      <div key={mi} style={{ textAlign: "right" }}>
                        <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 18, fontWeight: 700, color: mi === 2 ? T.gold : T.warmBrown, lineHeight: 1.2 }}>{v}</div>
                        <div style={{ fontSize: 10, textTransform: "uppercase", letterSpacing: "0.8px", color: T.textMuted, fontWeight: 600 }}>{"Nov Dec Jan".split(" ")[mi]}</div>
                      </div>
                    ))}
                  </div>
                </div>
                {si < 2 && <FunnelArrow />}
              </div>
            ))}
          </div>
        </div>

        {/* authority strip */}
        <div style={{ marginTop: 22 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
            <div style={{ width: 28, height: 2.5, background: T.gold, borderRadius: 1.5 }} />
            <span style={{ fontSize: 11, textTransform: "uppercase", letterSpacing: "2px", color: T.textMuted, fontWeight: 600 }}>Domain Authority</span>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(120px, 1fr))", gap: 12 }}>
            {[
              { val: "31",    label: "Authority Score",    change: "Good",    pos: true },
              { val: "2.2K",  label: "Referring Domains",  change: "−4%",     pos: false },
              { val: "29.9K", label: "Backlinks",          change: "−6%",     pos: false },
              { val: "5.8K",  label: "Organic Traffic",    change: "Active",  pos: true },
              { val: "780",   label: "Outbound Domains",   change: "Healthy", pos: true },
            ].map((a, i) => (
              <div key={i} style={{ background: "#fff", border: "1px solid rgba(120,90,60,0.07)", borderRadius: 12, padding: "16px 14px", textAlign: "center", boxShadow: T.shadow }}>
                <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 22, fontWeight: 700, color: T.warmBrown }}>{a.val}</div>
                <div style={{ fontSize: 11, color: T.textMuted, textTransform: "uppercase", letterSpacing: "0.6px", fontWeight: 500, marginTop: 4 }}>{a.label}</div>
                <div style={{ fontSize: 12, marginTop: 4, fontWeight: 500, color: a.pos ? T.green : T.rose }}>{a.change}</div>
              </div>
            ))}
          </div>
        </div>

        <InsightBox>
          <strong style={{ color: T.warmBrown }}>Insight:</strong> A stable authority score of 31 underpins the entire visibility strategy. The slight referring-domain and backlink fluctuations are normal portfolio churn — the 29.9K backlink base provides a strong signal foundation for sustained ranking growth.
        </InsightBox>

        {/* ════ 06 — STRATEGIC OUTLOOK ════ */}
        <SectionLabel num="06" />
        <h2 style={{ ...H2, marginTop: 46 }}>Strategic Outlook & Next Focus</h2>
        <p style={bodyP}>The visibility expansion phase is well-executed. The next chapter is about converting that momentum into measurable business impact.</p>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", gap: 14 }}>
          {[
            { num: "01", title: "Push High-Intent Keywords to Page 1",  desc: "494 keywords are already in the Top 10. Prioritising commercial and transactional terms in this cohort will unlock the highest-leverage CTR improvements." },
            { num: "02", title: "Optimise Conversion Paths",           desc: "Refine landing page experiences for the newest keyword clusters. Aligning page content with search intent will bridge the gap between click volume and MQL conversion." },
            { num: "03", title: "Strengthen the Backlink Profile",     desc: "Maintain and grow the 2.2K referring-domain base through targeted outreach. A stronger link profile accelerates the pace at which new keywords climb into top positions." },
          ].map((f, i) => (
            <div key={i} style={{ background: "#fff", border: "1px solid rgba(120,90,60,0.08)", borderRadius: 14, padding: "22px 20px", boxShadow: T.shadow }}>
              <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 30, fontWeight: 700, color: T.goldLight, lineHeight: 1, marginBottom: 10 }}>{f.num}</div>
              <div style={{ fontSize: 15, fontWeight: 600, color: T.warmBrown, marginBottom: 8 }}>{f.title}</div>
              <div style={{ fontSize: 13.5, color: T.textSec, lineHeight: 1.6 }}>{f.desc}</div>
            </div>
          ))}
        </div>

        {/* ── CLOSING DARK CALLOUT ── */}
        <div style={{ marginTop: 30, background: "linear-gradient(140deg, #3a2e2a 0%, #5c4f47 100%)", borderRadius: 18, padding: "36px 32px", position: "relative", overflow: "hidden" }}>
          <div style={{ position: "absolute", top: -40, right: -60, width: 200, height: 200, borderRadius: "50%", background: "rgba(184,149,106,0.12)", pointerEvents: "none" }} />
          <div style={{ position: "absolute", bottom: -30, left: 30, width: 140, height: 140, borderRadius: "50%", background: "rgba(184,149,106,0.08)", pointerEvents: "none" }} />
          <div style={{ position: "relative", zIndex: 1 }}>
            <div style={{ fontSize: 11, textTransform: "uppercase", letterSpacing: "2px", color: T.goldLight, fontWeight: 600, marginBottom: 12 }}>The Bottom Line</div>
            <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: 24, fontWeight: 600, color: "#fff", lineHeight: 1.3, letterSpacing: "-0.3px" }}>
              Discoverability is <span style={{ fontStyle: "italic", color: T.gold }}>scaling</span>.<br />
              Conversion is <span style={{ fontStyle: "italic", color: T.goldLight }}>next</span>.
            </h3>
            <p style={{ fontSize: 14, color: "rgba(255,255,255,0.6)", marginTop: 14, lineHeight: 1.6, maxWidth: 520 }}>
              With +84% impression growth, 8,400+ keyword positions, and a stable authority foundation — the organic engine is built. The next 60 days will focus on converting this visibility into traffic quality and qualified pipeline.
            </p>
          </div>
        </div>
      </div>

      {/* ─── FOOTER ─── */}
      <div style={{ textAlign: "center", padding: "32px 24px 28px", borderTop: "1px solid rgba(120,90,60,0.07)" }}>
        <div style={{ fontWeight: 600, fontSize: 16, color: T.warmBrown, marginBottom: 6 }}>lyzr</div>
        <p style={{ fontSize: 12, color: T.textMuted }}>Organic Performance Report · Nov 2025 – Jan 2026 · Confidential</p>
      </div>
    </div>
  );
}
