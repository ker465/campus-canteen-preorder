// ══════════════════════════════════════════════
//  CAMPUS CANTEEN — SCHEDULE
//  Admin can override via localStorage("canteenSchedule")
//  and localStorage("canteenOverride") = "open" | "closed" | null
// ══════════════════════════════════════════════

const DEFAULT_SCHEDULE = {
    breakfast: { start: 8,  end: 11, label: "Breakfast", emoji: "🌅", color: "#f5a623", enabled: true },
    lunch:     { start: 12, end: 15, label: "Lunch",     emoji: "🍱", color: "#4caf80", enabled: true },
    snacks:    { start: 16, end: 19, label: "Snacks",    emoji: "🍿", color: "#5b8dee", enabled: true },
    dinner:    { start: 19, end: 24, label: "Dinner",    emoji: "🌙", color: "#9b59b6", enabled: true }
};

// Live schedule — reads admin overrides from localStorage
function getSchedule() {
    const saved = localStorage.getItem("canteenSchedule");
    if (saved) {
        try { return JSON.parse(saved); } catch(e) {}
    }
    return DEFAULT_SCHEDULE;
}

var canteenSchedule = getSchedule();

// ── Manual override: "open" | "closed" | null ─
function getOverride() {
    // Canteen-specific override key so MRC and Khuksi don't affect each other
    var canteen = (typeof adminCanteen !== "undefined" && adminCanteen)
        ? adminCanteen
        : localStorage.getItem("selectedCanteen") || "MRC";
    return localStorage.getItem("canteenOverride_" + canteen);
}

// ── Current session ───────────────────────────
function getCurrentSession() {
    const override = getOverride();
    if (override === "closed") return "closed";

    canteenSchedule = getSchedule(); // always fresh
    const now  = new Date();
    const hour = now.getHours();
    const min  = now.getMinutes();
    const cur  = hour + min / 60;

    for (const [key, s] of Object.entries(canteenSchedule)) {
        if (!s.enabled) continue;
        const startH = s.start + (s.startMin || 0) / 60;
        const endH   = s.end   + (s.endMin   || 0) / 60;
        if (cur >= startH && cur < endH) return key;
    }

    if (override === "open") return "manual_open";
    return "closed";
}

// ── Next upcoming session ──────────────────────
function getNextSession() {
    canteenSchedule = getSchedule();
    const now  = new Date();
    const cur  = now.getHours() + now.getMinutes() / 60;
    for (const [key, s] of Object.entries(canteenSchedule)) {
        if (!s.enabled) continue;
        if (s.start > cur) return { key, ...s };
    }
    return null;
}

// ── Minutes remaining ─────────────────────────
function getMinutesLeft() {
    const session = getCurrentSession();
    if (session === "closed") return 0;
    if (session === "manual_open") return 999;
    canteenSchedule = getSchedule();
    const s   = canteenSchedule[session];
    if (!s) return 0;
    const now = new Date();
    const end = new Date();
    end.setHours(s.end, s.endMin || 0, 0, 0);
    return Math.max(0, Math.floor((end - now) / 60000));
}

// ── Format hour:min to 12h string ─────────────
function fmtHour(h, m) {
    m = m || 0;
    const period  = h < 12 ? "AM" : "PM";
    const display = h > 12 ? h - 12 : (h === 0 ? 12 : h);
    return display + ":" + String(m).padStart(2, "0") + " " + period;
}

// ── Generate slots for a session ──────────────
function getSlotsForSession(sessionKey) {
    canteenSchedule = getSchedule();
    const s = canteenSchedule[sessionKey];
    if (!s) return [];
    const slots = [];
    // Generate every 10-min slot from start up to AND INCLUDING end time
    const endH   = s.end   === 24 ? 0   : s.end;
    const endMin = s.endMin || 0;

    for (let h = s.start; h <= s.end; h++) {
        // Determine minute range for this hour
        const mStart = (h === s.start) ? (s.startMin || 0) : 0;
        let   mEnd   = 50; // last normal slot in an hour

        if (h === s.end) {
            // Last hour — include the end time itself as final slot
            mEnd = s.endMin || 0;
        }

        for (let m = mStart; m <= mEnd; m += 10) {
            const hDisp   = h === 24 ? 0 : h;
            const period  = hDisp < 12 ? "AM" : "PM";
            const display = hDisp > 12 ? hDisp - 12 : (hDisp === 0 ? 12 : hDisp);
            slots.push(display + ":" + String(m).padStart(2, "0") + " " + period);
        }
    }
    return slots;
}

// ── Filter to future slots only ───────────────
function getAvailableSlots(sessionKey) {
    const slots = getSlotsForSession(sessionKey);
    const now   = new Date();
    return slots.filter(function(slot) {
        const parts  = slot.split(" ");
        const period = parts[1];
        var parts2   = parts[0].split(":");
        var h = parseInt(parts2[0]);
        var m = parseInt(parts2[1]);
        if (period === "PM" && h !== 12) h += 12;
        if (period === "AM" && h === 12) h = 0;
        const slotTime = new Date();
        slotTime.setHours(h, m, 0, 0);
        return slotTime > now;
    });
}

function isOpen() { return getCurrentSession() !== "closed"; }