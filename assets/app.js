// ===== Configuration =====
// Adresse qui reçoit les candidatures : changer ici uniquement.
const RECRUITER_EMAIL = "redouan.hmami@bearingpoint.com";

(function () {
  const params = new URLSearchParams(location.search);
  const source = params.get("src") === "forum" ? "Forum (QR code)" : "Site web";

  // Afficher l'adresse partout
  document.querySelectorAll(".js-email").forEach(el => (el.textContent = RECRUITER_EMAIL));
  const mailLink = document.getElementById("mailLink");
  mailLink.href = "mailto:" + RECRUITER_EMAIL;
  mailLink.textContent = RECRUITER_EMAIL;

  const dlg = document.getElementById("applyDialog");
  const form = document.getElementById("applyForm");
  const roleEl = document.getElementById("dlgRole");
  let currentRole = "";

  document.querySelectorAll("button.apply[data-role]").forEach(btn => {
    btn.addEventListener("click", () => {
      currentRole = btn.dataset.role;
      roleEl.textContent = currentRole;
      if (typeof dlg.showModal === "function") dlg.showModal();
      else location.href = buildMailto({}); // très vieux navigateurs
    });
  });
  dlg.querySelector("[data-close]").addEventListener("click", () => dlg.close());
  dlg.addEventListener("click", e => { if (e.target === dlg) dlg.close(); });

  function buildMailto(d) {
    const name = (d.name || "").trim();
    const subject = `[Candidature] ${currentRole}${name ? " : " + name : ""}`;
    const body = [
      "Bonjour,",
      "",
      `Je souhaite candidater au poste : ${currentRole}.`,
      "",
      `Nom : ${name}`,
      `École / promo : ${d.school || ""}`,
      `Disponibilité : ${d.dispo || ""}`,
      `LinkedIn : ${d.linkedin || ""}`,
      "",
      "Motivation :",
      d.motivation || "",
      "",
      `Source : ${source}`,
      "",
      ">>> CV en pièce jointe (PDF) <<<",
      "",
      "Bien cordialement,",
      name
    ].join("\n");
    return `mailto:${RECRUITER_EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  }

  form.addEventListener("submit", e => {
    e.preventDefault();
    if (!form.reportValidity()) return;
    const d = Object.fromEntries(new FormData(form).entries());
    location.href = buildMailto(d);
  });

  // Copier l'adresse
  const copyBtn = document.getElementById("copyBtn");
  copyBtn.addEventListener("click", async () => {
    try { await navigator.clipboard.writeText(RECRUITER_EMAIL); flash(copyBtn, "Adresse copiée ✓"); }
    catch { prompt("Adresse à copier :", RECRUITER_EMAIL); }
  });

  // Garder le lien (partage natif sur mobile, sinon copie)
  const shareBtn = document.getElementById("shareBtn");
  shareBtn.addEventListener("click", async () => {
    const url = location.origin + location.pathname + "#offres";
    const data = { title: "Agentic AI, Financial Services Industry, BearingPoint", text: "Offres à revoir et postuler plus tard", url };
    try {
      if (navigator.share) await navigator.share(data);
      else { await navigator.clipboard.writeText(url); flash(shareBtn, "Lien copié ✓"); }
    } catch (_) { /* partage annulé */ }
  });

  function flash(btn, msg) {
    const old = btn.innerHTML;
    btn.textContent = msg;
    setTimeout(() => (btn.innerHTML = old), 1800);
  }
})();
