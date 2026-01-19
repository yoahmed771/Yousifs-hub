// Helpers
const $ = (sel, root = document) => root.querySelector(sel);
const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));

// Year 
const yearEl = $("#year");
if (yearEl) yearEl.textContent = new Date().getFullYear();

// Mobile nav 
const navToggle = $("#navToggle");
const navList = $("#navList");

if (navToggle && navList) {
  navToggle.addEventListener("click", () => {
    const isOpen = navList.classList.toggle("is-open");
    navToggle.setAttribute("aria-expanded", String(isOpen));
  });
}

// Close mobile nav when a nav link is used 
const navLinks = $$(".nav__link");
navLinks.forEach(a => {
  a.addEventListener("click", (e) => {

    const modified = e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0;
    if (modified) return;

    navList?.classList.remove("is-open");
    navToggle?.setAttribute("aria-expanded", "false");
  });
});

// Close mobile nav when clicking outside
document.addEventListener("click", (e) => {
  if (!navList.classList.contains("is-open")) return;

  const clickedInsideNav = navList.contains(e.target);
  const clickedToggle = navToggle.contains(e.target);

  if (!clickedInsideNav && !clickedToggle) {
    navList.classList.remove("is-open");
    navToggle.setAttribute("aria-expanded", "false");
  }
});


// Active section link
const sections = ["hub", "about", "skills", "work", "contact"]
  .map(id => document.getElementById(id))
  .filter(Boolean);

const setActiveLink = () => {
  const y = window.scrollY + 140;
  let currentId = sections[0]?.id || "hub";

  for (const sec of sections) {
    if (sec.offsetTop <= y) currentId = sec.id;
  }

  navLinks.forEach(a => {
    const href = a.getAttribute("href") || "";
    a.classList.toggle("is-active", href === `#${currentId}`);
  });
};

window.addEventListener("scroll", setActiveLink, { passive: true });
window.addEventListener("hashchange", setActiveLink);
setActiveLink();

// Progress bar 
const progress = $("#progress");
let rafId = 0;
window.addEventListener(
  "scroll",
  () => {
    if (!progress) return;
    if (rafId) return;

    rafId = window.requestAnimationFrame(() => {
      rafId = 0;
      const scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
      const scrollHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
      const pct = scrollHeight > 0 ? (scrollTop / scrollHeight) * 100 : 0;
      progress.style.width = `${pct}%`;
    });
  },
  { passive: true }
);

// Reveal on scroll 
$$('.section, .card').forEach(el => el.classList.add('reveal'));

if ("IntersectionObserver" in window) {
  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach(e => {
        if (e.isIntersecting) e.target.classList.add("is-visible");
      });
    },
    { threshold: 0.12 }
  );

  $$(".reveal").forEach(el => io.observe(el));
} else {
  $$(".reveal").forEach(el => el.classList.add("is-visible"));
}

// Hero title animation: split into characters 
function splitIntoChars(el) {
  if (!el) return;
  if (el.dataset.split === "true") return;

  const text = (el.textContent || "").trim();
  if (!text) return;

  el.setAttribute("aria-label", text);
  el.textContent = "";

  [...text].forEach((ch, i) => {
    const span = document.createElement("span");
    span.className = "char";
    span.style.setProperty("--i", i);
    span.textContent = ch === " " ? "\u00A0" : ch;
    el.appendChild(span);
  });

  el.dataset.split = "true";
}

document.addEventListener("DOMContentLoaded", () => {
  document.querySelectorAll("[data-spread-title]").forEach(splitIntoChars);
});

// Work filtering
const chips = $$(".chip");
const cards = $$(".work-card");

function setFilter(filter) {
  chips.forEach(c => {
    const active = c.dataset.filter === filter;
    c.classList.toggle("is-active", active);
    c.setAttribute("aria-selected", String(active));
  });

  cards.forEach(card => {
    const cat = card.dataset.category;
    const show = filter === "all" || cat === filter;
    card.style.display = show ? "" : "none";
  });
}

chips.forEach(chip => {
  chip.setAttribute("aria-selected", chip.classList.contains("is-active") ? "true" : "false");
  chip.addEventListener("click", () => setFilter(chip.dataset.filter || "all"));
});

// Project modal data
const PROJECTS = {
  "brand-1": {
    title: "Nova Noodle",
    category: "Brand Design",
    description:
      "NOVA NOODLE is a conceptual fast-casual noodle brand designed to feel warm, playful, and instantly approachable.\n\nThe logo combines a simple bowl-and-noodles illustration with chopsticks and a hand-drawn label style, creating a friendly comfort-food personality that stays clear at small sizes.\n\nCozy neutrals with bold maroon and energetic orange give the brand a memorable look across packaging, menu design, and social content.\n\nNote: NOVA NOODLE is not a real company — it’s a self-initiated concept created to showcase my branding and visual identity skills.",
    meta: ["Tools: Illustrator"],
    images: [
      "images/nova-noodle/logo.png",
      "images/nova-noodle/brand-demo.png",
      "images/nova-noodle/shop.png",
      "images/nova-noodle/logo-variations.png"
    ]
  },

  "brand-2": {
    title: "Cravey",
    category: "Brand Design",
    description:
      "Cravey is a modern food-delivery concept built around one idea: instant cravings, delivered fast.\n\nThe brand is confident, friendly, and reliable—designed to feel like the go-to app you open when you want something now, with zero stress.\n\nThe logo is a bold wordmark built for visibility from UI to rider uniforms and delivery packaging, with a custom “C” accent that hints at a bite and adds a memorable signature.\n\nNote: Cravey is not a real company — it’s a self-initiated concept created to showcase my branding and identity design skills.",
    meta: ["Tools: Illustrator"],
    images: [
      "images/cravey/logo.png",
      "images/cravey/logo-variations.png",
      "images/cravey/delivery-man.png",
      "images/cravey/motorcycle.png"
    ]
  },

  "brand-3": {
    title: "Voltway",
    category: "Brand Design",
    description:
      "VOLTWAY is a conceptual EV charging network designed around speed, reliability, and clear wayfinding.\n\nThe identity uses a bold, high-contrast system built for real-world visibility—working across stations, road signage, and mobile interfaces.\n\nThe mark merges a road-shaped “V” with a lightning bolt to communicate movement and electric power, while energizing yellow accents act as an instant “charge” cue.\n\nNote: VOLTWAY is not a real company — it’s a self-initiated concept created to showcase my branding and identity design skills.",
    meta: ["Tools: Illustrator"],
    images: [
      "images/voltway/logo.png",
      "images/voltway/logo-variations.png",
      "images/voltway/key.png",
      "images/voltway/charging-station.png",
      "images/voltway/charging-cable.png"
    ]
  },

  "brand-4": {
    title: "Skydock",
    category: "Brand Design",
    description:
      "SKYDOCK is a conceptual logistics and storage brand built around the idea of “air meets warehouse.”\n\nThe identity combines a bold, condensed wordmark with a custom icon where an aircraft intersects a dock-shaped “D,” communicating speed, direction, and dependable handling.\n\nA clean industrial palette and high-contrast forms keep the system legible across real-world applications like vehicle livery, signage, and wayfinding.\n\nNote: SKYDOCK is not a real company — it’s a self-initiated concept created to showcase my branding and identity design skills.",
    meta: ["Tools: Illustrator"],
    images: [
      "images/skydock/logo.png",
      "images/skydock/logo-variations.png",
      "images/skydock/truck.png",
      "images/skydock/sign.png"
    ]
  },

  "poster-1": {
    title: "EduTech Poster",
    category: "Poster",
    description:
      "EduTech Bahrain 2025 is a conceptual event poster designed to feel modern, credible, and easy to read at a glance.\n\nThe layout uses a circuit-board backdrop to signal technology, a bold year/title for quick recognition, and a central hero image to add a human, professional tone. A deep blue info panel and QR code create a clear “read → scan” flow, while the footer locks in essentials like venue, date, and contact details.\n\nNote: EduTech is not a real event — this is a self-initiated concept created to showcase my poster and visual communication skills.",
    meta: ["Tools: InDesign, Illustrator, Photoshop"],
    images: ["images/posters/edu-tech.png"]
  },

  "social-1": {
    title: "Cravey Social Media Post",
    category: "Social Media",
    description:
      "Cravey is a conceptual food delivery brand, and this Instagram post was designed to be bold, clean, and scroll-stopping.\n\nIt pairs a playful headline with three food cards to spark choice, then reinforces action with a simple CTA to drive comments and engagement.\n\nNote: Cravey is not a real company — this is a self-initiated concept created to showcase my social media and brand design skills.",
    meta: ["Tools: Illustrator"],
    images: ["images/posts/cravey-post.png"]
  },

  "ui-1": {
    title: "Eminem Interactive PDF",
    category: "Website Design",
    description:
      "EMINEM: Live on Page is a conceptual interactive PDF that mimics a website experience. It uses a high-contrast red/black palette and clean typography to match the intensity of Eminem’s persona and storytelling.\n\nThe experience is organized into clear sections: Music (discography/album visuals), Tours (highlights + a concept schedule table), and Merch (product-style layouts with pricing and add-to-cart feedback).\n\nNote: This is a self-initiated concept project created to showcase UI-style hierarchy and interactive PDF design—this is not an official Eminem product.",
    meta: ["Tools: InDesign, Illustrator, Photoshop", "Format: Interactive PDF"],
    images: [
      "images/website-ui/eminem-website.png",
      "images/website-ui/eminem-website2.png",
      "images/website-ui/eminem-website3.png",
      "images/website-ui/eminem-website4.png",
      "images/website-ui/eminem-website5.png",
      "images/website-ui/eminem-website6.png",
      "images/website-ui/eminem-website7.png",
      "images/website-ui/eminem-website8.png",
      "images/website-ui/eminem-website9.png",
      "images/website-ui/eminem-website10.png"
    ],
    pdf: "pdf/eminem-interactive.pdf"
  },

  "motion-1": {
    title: "Motion Graphics (Soon)",
    category: "Motion Graphic",
    description: "Currently learning motion graphics — building skills in animation, timing, and visual storytelling.",
    meta: ["Tool: After Effects (learning)"],
    images: []
  }
};

// Modal elements
const modal = $("#projectModal");
const modalTitle = $("#modalTitle");
const modalKicker = $("#modalKicker");
const modalDesc = $("#modalDesc");
const modalMeta = $("#modalMeta");
const modalGallery = $("#modalGallery");
const modalPdf = $("#modalPdf");

let lastFocusEl = null;

function getFocusable(root) {
  return $$('a[href], button:not([disabled]), textarea, input, select, [tabindex]:not([tabindex="-1"])', root)
    .filter(el => !el.hasAttribute('disabled') && !el.getAttribute('aria-hidden'));
}

function openModal(projectId) {
  const data = PROJECTS[projectId];
  if (!data || !modal) return;

  lastFocusEl = document.activeElement;

  if (modalTitle) modalTitle.textContent = data.title;
  if (modalKicker) modalKicker.textContent = data.category;
  if (modalDesc) modalDesc.textContent = data.description;

  if (modalPdf) {
    if (data.pdf) {
      modalPdf.href = data.pdf;
      modalPdf.style.display = "inline-flex";
    } else {
      modalPdf.style.display = "none";
      modalPdf.removeAttribute("href");
    }
  }

  if (modalMeta) {
    modalMeta.innerHTML = "";
    (data.meta || []).forEach(item => {
      const span = document.createElement("span");
      span.className = "meta-pill";
      span.textContent = item;
      modalMeta.appendChild(span);
    });
  }

  if (modalGallery) {
    modalGallery.innerHTML = "";
    const imgs = Array.isArray(data.images) ? data.images : [];

    if (imgs.length === 1) {
      const img = document.createElement("img");
      img.src = imgs[0];
      img.alt = `${data.title} full preview`;
      img.className = "modal-fullimg";
      img.loading = "lazy";
      img.decoding = "async";
      modalGallery.appendChild(img);
    } else if (imgs.length > 1) {
      imgs.forEach(src => {
        const div = document.createElement("div");
        div.className = "gallery-item";

        const img = document.createElement("img");
        img.src = src;
        img.alt = `${data.title} image`;
        img.loading = "lazy";
        img.decoding = "async";

        div.appendChild(img);
        modalGallery.appendChild(div);
      });
    } else {
      const empty = document.createElement("div");
      empty.className = "gallery-empty muted";
      empty.textContent = "No images added yet.";
      modalGallery.appendChild(empty);
    }
  }

  modal.classList.add("is-open");
  modal.setAttribute("aria-hidden", "false");
  document.body.style.overflow = "hidden";

  modal.querySelector(".modal__close")?.focus();
}

function closeModal() {
  if (!modal) return;
  modal.classList.remove("is-open");
  modal.setAttribute("aria-hidden", "true");
  document.body.style.overflow = "";
  if (lastFocusEl && typeof lastFocusEl.focus === "function") lastFocusEl.focus();
}

// Open modal on card button + thumbnail 
cards.forEach(card => {
  const btn = card.querySelector(".link-btn");
  const thumb = card.querySelector(".card__thumb");
  const projectId = card.dataset.project;

  btn?.addEventListener("click", () => openModal(projectId));

  thumb?.addEventListener("click", () => openModal(projectId));
  thumb?.addEventListener("keydown", (e) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      openModal(projectId);
    }
  });
});

// Close modal (overlay + close button)
if (modal) {
  modal.addEventListener("click", (e) => {
    const target = e.target;

    if (target === modal) closeModal();

    if (target?.dataset?.close === "true") closeModal();
  });

  document.addEventListener("keydown", (e) => {
    if (!modal.classList.contains("is-open")) return;

    if (e.key === "Escape") {
      closeModal();
      return;
    }

    // Focus trap
    if (e.key === "Tab") {
      const focusable = getFocusable(modal);
      if (!focusable.length) return;

      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      const active = document.activeElement;

      if (e.shiftKey && active === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && active === last) {
        e.preventDefault();
        first.focus();
      }
    }
  });
}

