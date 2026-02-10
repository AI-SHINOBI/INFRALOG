document.addEventListener("DOMContentLoaded", () => {
    applyPageEntrance();
    enhanceSidebar();
    enhanceButtons();
    enhanceLogs();
});

/* ---------- Page Load Animation ---------- */
function applyPageEntrance() {
    const content = document.querySelector(".content");
    if (!content) return;

    content.style.opacity = "0";
    content.style.transform = "translateY(8px)";

    requestAnimationFrame(() => {
        content.style.transition = "opacity 0.4s ease, transform 0.4s ease";
        content.style.opacity = "1";
        content.style.transform = "translateY(0)";
    });
}

/* ---------- Sidebar UX ---------- */
function enhanceSidebar() {
    document.querySelectorAll(".nav a").forEach(link => {
        link.addEventListener("mouseenter", () => {
            link.style.boxShadow = "0 0 12px rgba(88,166,255,0.25)";
        });

        link.addEventListener("mouseleave", () => {
            link.style.boxShadow = "none";
        });
    });
}

/* ---------- Button Feedback ---------- */
function enhanceButtons() {
    document.querySelectorAll("button").forEach(btn => {
        btn.addEventListener("mousedown", () => {
            btn.style.transform = "scale(0.97)";
        });

        btn.addEventListener("mouseup", () => {
            btn.style.transform = "scale(1)";
        });

        btn.addEventListener("mouseleave", () => {
            btn.style.transform = "scale(1)";
        });
    });
}

/* ---------- Log Severity Intelligence ---------- */
function enhanceLogs() {
    const logBlocks = document.querySelectorAll("[data-log-type]");

    logBlocks.forEach(log => {
        const type = log.dataset.logType;

        if (type === "ERROR") {
            log.style.borderLeft = "4px solid #f85149";
            log.style.background = "rgba(248,81,73,0.08)";
        }

        if (type === "WARNING") {
            log.style.borderLeft = "4px solid #f0883e";
            log.style.background = "rgba(240,136,62,0.08)";
        }

        if (type === "INFO") {
            log.style.borderLeft = "4px solid #58a6ff";
            log.style.background = "rgba(88,166,255,0.08)";
        }
    });
}

/* ---------- Debug Marker ---------- */
console.info("InfraLog enhanced UI layer active");
