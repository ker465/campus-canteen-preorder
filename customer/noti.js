// ══════════════════════════════════════
//  NOTIFICATION BELL — student pages
// ══════════════════════════════════════
(function () {

    // ── CSS ───────────────────────────
    const css = `
    .notif-wrap {
        position: relative;
        display: inline-flex;
        align-items: center;
    }
    .notif-bell-btn {
        width: 38px; height: 38px;
        background: none;
        border: 1px solid #2e2820;
        border-radius: 10px;
        display: flex; align-items: center; justify-content: center;
        cursor: pointer; font-size: 1.1rem; color: #f0e8dc;
        transition: border-color 0.2s, background 0.2s;
        position: relative;
    }
    .notif-bell-btn:hover { border-color: #f5a623; background: rgba(245,166,35,0.08); }
    .notif-bell-btn.ringing { animation: bellRing 0.6s ease; }
    @keyframes bellRing {
        0%,100%{transform:rotate(0)}
        15%{transform:rotate(14deg)}
        30%{transform:rotate(-12deg)}
        45%{transform:rotate(9deg)}
        60%{transform:rotate(-6deg)}
        75%{transform:rotate(3deg)}
    }
    .notif-badge {
        position: absolute; top: -6px; right: -6px;
        min-width: 18px; height: 18px;
        background: #ef5350; color: #fff;
        font-size: 0.6rem; font-weight: 800;
        border-radius: 20px; padding: 0 4px;
        display: flex; align-items: center; justify-content: center;
        border: 2px solid #0f0d0b;
        opacity: 0; transform: scale(0);
        transition: all 0.3s cubic-bezier(0.34,1.56,0.64,1);
        pointer-events: none;
    }
    .notif-badge.show { opacity: 1; transform: scale(1); animation: badgePulse 2s ease infinite; }
    @keyframes badgePulse {
        0%,100%{box-shadow:0 0 0 0 rgba(239,83,80,0.5)}
        50%{box-shadow:0 0 0 5px rgba(239,83,80,0)}
    }

    /* ── DROPDOWN ── */
    .notif-dropdown {
        position: absolute; top: calc(100% + 12px); right: 0;
        width: 310px;
        background: #1a1612;
        border: 1px solid #2e2820;
        border-radius: 16px;
        box-shadow: 0 20px 60px rgba(0,0,0,0.7);
        z-index: 9999;
        overflow: hidden;
        opacity: 0; transform: translateY(-10px) scale(0.96);
        pointer-events: none;
        transition: opacity 0.22s ease, transform 0.22s cubic-bezier(0.34,1.56,0.64,1);
        transform-origin: top right;
    }
    .notif-dropdown.open { opacity: 1; transform: translateY(0) scale(1); pointer-events: all; }

    .notif-hdr {
        padding: 13px 16px 11px;
        display: flex; align-items: center; justify-content: space-between;
        border-bottom: 1px solid #2e2820;
    }
    .notif-hdr-title { font-size: 0.83rem; font-weight: 700; color: #f0e8dc; display: flex; align-items: center; gap: 7px; font-family: 'DM Sans', sans-serif; }
    .notif-clear { font-size: 0.68rem; color: #8a7d6b; background: none; border: none; cursor: pointer; font-family: 'DM Sans', sans-serif; padding: 3px 6px; border-radius: 6px; transition: color 0.2s; }
    .notif-clear:hover { color: #f5a623; }

    .notif-list { max-height: 320px; overflow-y: auto; }
    .notif-list::-webkit-scrollbar { width: 3px; }
    .notif-list::-webkit-scrollbar-thumb { background: #2e2820; border-radius: 3px; }

    .notif-item {
        padding: 12px 16px;
        border-bottom: 1px solid #2e2820;
        display: flex; gap: 10px; align-items: flex-start;
        transition: background 0.15s;
        animation: notifIn 0.25s ease both;
    }
    .notif-item:last-child { border-bottom: none; }
    .notif-item.unread { background: rgba(245,166,35,0.05); }
    .notif-item.review-reminder { background: rgba(245,166,35,0.06); border-left: 3px solid rgba(245,166,35,0.4); }
    .notif-item.review-reminder:hover { background: rgba(245,166,35,0.12); }
    .notif-item:hover { background: rgba(245,166,35,0.04); }
    @keyframes notifIn { from{opacity:0;transform:translateX(8px)} to{opacity:1;transform:translateX(0)} }

    .notif-unread-dot { width:7px;height:7px;border-radius:50%;background:#f5a623;flex-shrink:0;margin-top:5px;transition:opacity 0.3s; }
    .notif-item.read .notif-unread-dot { opacity:0; }
    .notif-ico { font-size:1.2rem;flex-shrink:0; }
    .notif-body { flex:1; }
    .notif-msg  { font-size:0.81rem;color:#f0e8dc;line-height:1.4;font-weight:500;font-family:'DM Sans',sans-serif; }
    .notif-time { font-size:0.67rem;color:#8a7d6b;margin-top:2px;font-family:'DM Sans',sans-serif; }

    .notif-empty { padding:32px 16px; text-align:center; color:#8a7d6b; }
    .notif-empty-ico { font-size:1.8rem;margin-bottom:8px;opacity:0.35; }
    .notif-empty p { font-size:0.78rem;font-family:'DM Sans',sans-serif; }

    .notif-footer { padding:9px 16px; border-top:1px solid #2e2820; text-align:center; }
    .notif-footer a { font-size:0.72rem;color:#f5a623;text-decoration:none;font-weight:600;font-family:'DM Sans',sans-serif; }
    .notif-footer a:hover { color:#ffb83f; }

    .live-dot { display:inline-block;width:6px;height:6px;background:#4caf80;border-radius:50%;animation:livePulse 1.5s ease infinite; }
    @keyframes livePulse{0%,100%{opacity:1;transform:scale(1)}50%{opacity:0.4;transform:scale(0.7)}}

    /* ── POPUP TOAST ── */
    .notif-popup {
        position: fixed;
        top: 80px; right: 20px;
        max-width: 300px;
        background: #221e19;
        border: 1px solid #f5a623;
        border-left: 4px solid #f5a623;
        border-radius: 14px;
        padding: 14px 16px;
        box-shadow: 0 12px 40px rgba(0,0,0,0.6);
        z-index: 99999;
        display: flex; gap: 12px; align-items: flex-start;
        transform: translateX(120%);
        transition: transform 0.4s cubic-bezier(0.34,1.56,0.64,1);
        cursor: pointer;
    }
    .notif-popup.show { transform: translateX(0); }
    .notif-popup-ico  { font-size:1.5rem;flex-shrink:0; }
    .notif-popup-body { flex:1; }
    .notif-popup-title { font-size:0.75rem;font-weight:700;color:#f5a623;text-transform:uppercase;letter-spacing:0.08em;margin-bottom:3px;font-family:'DM Sans',sans-serif; }
    .notif-popup-msg   { font-size:0.85rem;color:#f0e8dc;font-weight:500;line-height:1.4;font-family:'DM Sans',sans-serif; }
    .notif-popup-close { position:absolute;top:8px;right:10px;background:none;border:none;color:#8a7d6b;cursor:pointer;font-size:0.85rem;padding:2px 5px; }
    `;
    const style = document.createElement("style");
    style.textContent = css;
    document.head.appendChild(style);

    // ── State ─────────────────────────
    let isOpen     = false;
    let lastReadId = parseInt(localStorage.getItem("notifLastReadId") || "0");
    let popupTimer = null;
    const canteen  = localStorage.getItem("selectedCanteen") || null;

    // Init lastCount from real unread so page refresh never re-triggers sound
    const _initNotifs = JSON.parse(localStorage.getItem("notifications") || "[]");
    let lastCount = _initNotifs.filter(function(n){ return n.id > lastReadId; }).length;

    // Track popup-shown IDs so we never show popup for same notif twice
    let shownPopupIds = JSON.parse(localStorage.getItem("notifShownPopupIds") || "[]");

    // ── Build Bell HTML ───────────────
    const wrap = document.createElement("div");
    wrap.className = "notif-wrap";
    wrap.innerHTML = `
        <button class="notif-bell-btn" id="notifBtn" title="Notifications">
            🔔
            <div class="notif-badge" id="notifBadge"></div>
        </button>
        <div class="notif-dropdown" id="notifDropdown">
            <div class="notif-hdr">
                <div class="notif-hdr-title">🔔 Notifications <span class="live-dot"></span></div>
                <button class="notif-clear" onclick="window._notifMarkRead()">Mark all read</button>
            </div>
            <div class="notif-list" id="notifList"></div>
            <div class="notif-footer"><a href="orders.html">View my orders →</a></div>
        </div>`;

    // ── Build Popup HTML ──────────────
    const popup = document.createElement("div");
    popup.className = "notif-popup";
    popup.id = "notifPopup";
    popup.innerHTML = `
        <div class="notif-popup-ico">🔔</div>
        <div class="notif-popup-body">
            <div class="notif-popup-title">Canteen Update</div>
            <div class="notif-popup-msg" id="notifPopupMsg"></div>
        </div>
        <button class="notif-popup-close" onclick="window._dismissPopup()">✕</button>`;
    popup.addEventListener("click", function(e) {
        if (!e.target.classList.contains("notif-popup-close")) {
            window.location.href = "orders.html";
        }
    });

    // ── Mount into page ───────────────
    function mount() {
        document.body.appendChild(popup);

        const header = document.querySelector("header");
        if (!header) return;

        // Try known wrapper classes first
        let parent = header.querySelector(".header-actions")
                  || header.querySelector(".header-right");

        if (parent) {
            // Insert bell before the first button
            const firstBtn = parent.querySelector("button");
            if (firstBtn) parent.insertBefore(wrap, firstBtn);
            else parent.appendChild(wrap);
        } else {
            // choose.html: header has no wrapper — create one
            // Grab the logout button, wrap it with the bell
            const logoutBtn = header.querySelector("button, .logout-btn");
            if (logoutBtn) {
                const newWrap = document.createElement("div");
                newWrap.style.cssText = "display:flex;align-items:center;gap:10px;";
                logoutBtn.parentNode.insertBefore(newWrap, logoutBtn);
                newWrap.appendChild(wrap);
                newWrap.appendChild(logoutBtn);
            } else {
                header.appendChild(wrap);
            }
        }
    }

    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", mount);
    } else {
        mount();
    }

    // ── Filter notifs for this canteen ─
    function getNotifs() {
        // Show ALL notifications regardless of selected canteen
        return JSON.parse(localStorage.getItem("notifications")) || [];
    }

    // ── Render dropdown list ──────────
    let _notifListHash = "";
    function renderList() {
        const list   = document.getElementById("notifList");
        if (!list) return;
        const notifs = getNotifs();

        // Hash guard — skip DOM write if nothing changed
        const hash = notifs.map(n => n.id + (n.id > lastReadId ? "u" : "r")).join(",");
        if (hash === _notifListHash) return;
        _notifListHash = hash;

        if (!notifs.length) {
            list.innerHTML = `<div class="notif-empty"><div class="notif-empty-ico">🔕</div><p>No notifications yet.</p></div>`;
            return;
        }
        list.innerHTML = notifs.map((n, i) => {
            const msg    = n.msg.replace(/^\[(MRC|Khuksi)\]\s*/, "");
            const icon   = n.msg.startsWith("[MRC]") ? "🏫" : n.msg.startsWith("[Khuksi]") ? "🍜" : "📢";
            const unread = n.id > lastReadId;
            const isReview = !!n.reviewOrderId;
            const clickHandler = isReview ? `onclick="window._openReviewFromNotif('${n.reviewOrderId}')"` : "";
            const reviewTag    = isReview
                ? `<div style="margin-top:4px"><span style="font-size:0.7rem;font-weight:700;background:rgba(245,166,35,0.18);color:#f5a623;padding:2px 9px;border-radius:10px;cursor:pointer">✍️ Tap to review</span></div>`
                : "";
            return `<div class="notif-item ${unread ? 'unread' : 'read'} ${isReview ? 'review-reminder' : ''}" style="animation-delay:${i*0.04}s;${isReview?'cursor:pointer':''}" ${clickHandler}>
                <div class="notif-unread-dot"></div>
                <div class="notif-ico">${icon}</div>
                <div class="notif-body">
                    <div class="notif-msg">${msg}</div>
                    ${reviewTag}
                    <div class="notif-time">${n.time || ''}</div>
                </div>
            </div>`;
        }).join("");
    }

    // ── Show popup toast ──────────────
    function showPopup(msg) {
        const clean = msg.replace(/^\[(MRC|Khuksi)\]\s*/, "");
        document.getElementById("notifPopupMsg").textContent = clean;
        popup.classList.add("show");
        clearTimeout(popupTimer);
        popupTimer = setTimeout(() => popup.classList.remove("show"), 5000);
    }

    window._openReviewFromNotif = function(orderId) {
        // Close dropdown
        isOpen = false;
        const dd = document.getElementById("notifDropdown");
        if (dd) dd.classList.remove("open");
        // Open review modal if on orders page, else navigate there
        if (typeof openReview === "function") {
            setTimeout(function(){ openReview(orderId); }, 200);
        } else {
            window.location.href = "orders.html";
        }
    };

    window._dismissPopup = function() {
        popup.classList.remove("show");
        clearTimeout(popupTimer);
    };


    // ── Notification sound (Web Audio API — no external file needed) ──
    function playNotifSound() {
        try {
            var ctx = new (window.AudioContext || window.webkitAudioContext)();
            var tones = [
                { freq: 1046.5, start: 0,    dur: 0.15 },
                { freq: 1318.5, start: 0.12, dur: 0.18 },
                { freq: 1568,   start: 0.26, dur: 0.25 }
            ];
            tones.forEach(function(t) {
                var osc  = ctx.createOscillator();
                var gain = ctx.createGain();
                osc.connect(gain);
                gain.connect(ctx.destination);
                osc.type = "sine";
                osc.frequency.setValueAtTime(t.freq, ctx.currentTime + t.start);
                gain.gain.setValueAtTime(0, ctx.currentTime + t.start);
                gain.gain.linearRampToValueAtTime(0.3, ctx.currentTime + t.start + 0.02);
                gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + t.start + t.dur);
                osc.start(ctx.currentTime + t.start);
                osc.stop(ctx.currentTime + t.start + t.dur + 0.05);
            });
        } catch(e) {}
    }

    // ── Update badge + detect new ─────
    function updateBadge() {
        const badge  = document.getElementById("notifBadge");
        const btn    = document.getElementById("notifBtn");
        if (!badge || !btn) return;

        const notifs = getNotifs();
        const unread = notifs.filter(n => n.id > lastReadId).length;

        badge.textContent = unread > 9 ? "9+" : String(unread);
        badge.classList.toggle("show", unread > 0);

        // Only trigger for notifs we haven't shown a popup for yet
        const newOnes = notifs.filter(function(n){
            return n.id > lastReadId && shownPopupIds.indexOf(n.id) === -1;
        });
        if (newOnes.length > 0) {
            btn.classList.remove("ringing");
            void btn.offsetWidth;
            btn.classList.add("ringing");
            setTimeout(function(){ btn.classList.remove("ringing"); }, 700);

            playNotifSound();

            const newest = newOnes[newOnes.length - 1];
            if (newest) showPopup(newest.msg);

            // Persist so refresh won't retrigger these
            newOnes.forEach(function(n){
                if (shownPopupIds.indexOf(n.id) === -1) shownPopupIds.push(n.id);
            });
            if (shownPopupIds.length > 50) shownPopupIds = shownPopupIds.slice(-50);
            localStorage.setItem("notifShownPopupIds", JSON.stringify(shownPopupIds));
        }
        lastCount = unread;

        // Only re-render list if open AND data changed (renderList has its own hash guard)
        if (isOpen) renderList();
    }

    // ── Toggle dropdown ───────────────
    document.addEventListener("click", function(e) {
        const btn = document.getElementById("notifBtn");
        const dd  = document.getElementById("notifDropdown");
        if (!btn || !dd) return;
        if (btn.contains(e.target)) {
            isOpen = !isOpen;
            dd.classList.toggle("open", isOpen);
            if (isOpen) { window._notifMarkRead(); renderList(); }
        } else if (!dd.contains(e.target) && !popup.contains(e.target)) {
            isOpen = false;
            dd.classList.remove("open");
        }
    });

    // ── Mark all read ─────────────────
    window._notifMarkRead = function() {
        const notifs = getNotifs();
        if (notifs.length) {
            lastReadId = Math.max(...notifs.map(n => n.id || 0));
            localStorage.setItem("notifLastReadId", lastReadId);
        }
        lastCount = 0;
        updateBadge();
        if (isOpen) renderList();
    };

    // ── Poll every 2s ─────────────────
    updateBadge();
    setInterval(updateBadge, 2000);

})();


// ══════════════════════════════════════════════
//  REVIEW REMINDER — fires 5 mins after Picked Up
// ══════════════════════════════════════════════
(function reviewReminder() {
    var FIVE_MINS   = 5 * 60 * 1000;
    var notifiedSet = JSON.parse(localStorage.getItem("reviewReminderSent") || "[]");
    var canteen     = localStorage.getItem("selectedCanteen");

    function checkReminders() {
        // Always read fresh from localStorage so we catch reviews submitted
        // during the 5-minute window
        var orders  = JSON.parse(localStorage.getItem("orders")) || [];
        var changed = false;
        var now     = Date.now();

        orders.forEach(function(order) {
            // Only for this canteen's orders
            if (order.canteen !== canteen) return;
            // Must be Picked Up with a timestamp
            if (order.orderStatus !== "Picked Up" && order.orderStatus !== "Completed") return;
            if (!order.pickedUpAt) return;
            // Already sent reminder — skip
            if (notifiedSet.indexOf(order.orderID) !== -1) return;

            // ── KEY FIX: re-read reviewGiven fresh every check ──
            // If customer already reviewed within the 5-min window, 
            // mark as sent (so we never send it) without firing notification
            if (order.reviewGiven || order.reviewSkipped) {
                notifiedSet.push(order.orderID);
                changed = true;
                return;
            }

            // 5 minutes haven't passed yet — keep waiting
            if (now - order.pickedUpAt < FIVE_MINS) return;

            // ── 5 mins passed AND no review given → send reminder ──
            var notifs = JSON.parse(localStorage.getItem("notifications")) || [];
            var msg    = "⭐ Enjoyed your meal? Leave a review for Token #" + order.tokenNumber + "!";
            notifs.unshift({
                id:   Date.now(),
                msg:  "[" + canteen + "] " + msg,
                time: new Date().toLocaleTimeString(),
                reviewOrderId: order.orderID
            });
            localStorage.setItem("notifications", JSON.stringify(notifs.slice(0, 20)));

            notifiedSet.push(order.orderID);
            changed = true;
        });

        if (changed) {
            localStorage.setItem("reviewReminderSent", JSON.stringify(notifiedSet));
        }
    }

    // Run every 30 seconds
    checkReminders();
    setInterval(checkReminders, 30000);
})();