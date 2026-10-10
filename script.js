/* =========================================================
   THE CHEF – script principal
   - Catalogue produits et recettes (données modifiables ci-dessous)
   - Panier (localStorage), commande WhatsApp, formulaire de commande
   - Navigation, animations au scroll, modale recette
   ========================================================= */

/* ---------------------------------------------------------
   1. CONFIGURATION – à adapter avant mise en ligne
   --------------------------------------------------------- */
document.documentElement.classList.remove("no-js");

const CONFIG = {
  // Numéro WhatsApp officiel au format international, chiffres uniquement, sans "+" ni espaces.
  // Exemple : "237600000000". Laissé vide, WhatsApp demandera au client de choisir le destinataire.
  whatsappNumber: "",

  // Adresse e-mail de contact affichée sur le site
  email: "contact@thechef.example",

  // Devise et format d'affichage des prix ($XX.XX)
  currency: "USD",
  locale: "en-US",

  // Passer à true UNIQUEMENT si les produits disposent d'une certification biologique officielle.
  certifiedOrganic: false,

  storageKey: "thechef-cart-v1",
};

/* ---------------------------------------------------------
   2. CATALOGUE PRODUITS
   Champs : id, name, category, description, price, weight,
            image, imageType ("photo" | "logo"), availability, color
   availability : "in_stock" | "preorder" | "out_of_stock"
   ⚠ Prix indicatifs à remplacer par les prix officiels.
   --------------------------------------------------------- */
const PRODUCTS = [
  {
    id: "legumes",
    name: "The Chef Légumes",
    category: "Légumes · Ndolé",
    description: "Légumes sélectionnés pour préparer facilement le Ndolé camerounais et vos sauces africaines.",
    price: 9.99,
    weight: "1000 g",
    image: "assets/img/the-chef-legumes-folon.jpg",
    imageType: "photo",
    availability: "in_stock",
    color: "var(--c-legumes)",
  },
  {
    id: "epices",
    name: "The Chef Épices",
    category: "Épices africaines",
    description: "Mélange aromatique pour poisson braisé, poulet, viandes, grillades, sauces et marinades.",
    price: 7.99,
    weight: "",
    image: "assets/img/logo-epices.png",
    imageType: "logo",
    availability: "in_stock",
    color: "var(--c-epices)",
  },
  {
    id: "bobolo",
    name: "The Chef Bobolo",
    category: "Assaisonnement camerounais",
    description: "Mélange inspiré des saveurs camerounaises pour accompagnements, poissons, viandes et sauces.",
    price: 6.99,
    weight: "",
    image: "assets/img/logo-bobolo.png",
    imageType: "logo",
    availability: "in_stock",
    color: "var(--c-bobolo)",
  },
  {
    id: "tomate",
    name: "The Chef Tomate",
    category: "Préparation tomate",
    description: "Préparation aromatique à la tomate pour sauces, ragoûts, riz, pâtes et plats mijotés.",
    price: 6.99,
    weight: "",
    image: "assets/img/logo-tomate.png",
    imageType: "logo",
    availability: "in_stock",
    color: "var(--c-tomate)",
  },
];

/* ---------------------------------------------------------
   3. RECETTES
   image : photo (facultatif) – sinon icon + color pour une illustration
   --------------------------------------------------------- */
const RECIPES = [
  {
    id: "ndole",
    title: "Ndolé camerounais",
    products: ["legumes"],
    time: "1 h 30",
    serves: "6 personnes",
    image: "assets/img/ndole.jpg",
    ingredients: [
      "The Chef Légumes (selon les indications de l’emballage)",
      "300 g d’arachides crues décortiquées",
      "500 g de viande de bœuf en morceaux",
      "250 g de crevettes décortiquées",
      "2 oignons",
      "3 gousses d’ail et un morceau de gingembre",
      "Huile végétale, sel, piment (facultatif)",
    ],
    steps: [
      "Cuire la viande avec un oignon, l’ail, le gingembre et un peu de sel jusqu’à ce qu’elle soit tendre. Réserver le bouillon.",
      "Faire bouillir les arachides 10 minutes, les égoutter puis les mixer avec un peu de bouillon pour obtenir une pâte lisse.",
      "Verser la pâte d’arachide dans le bouillon et laisser mijoter 20 minutes en remuant régulièrement.",
      "Ajouter The Chef Légumes et la viande, puis laisser mijoter 15 minutes à feu doux.",
      "Faire revenir l’oignon restant émincé et les crevettes dans l’huile, puis les incorporer au Ndolé.",
      "Servir avec du plantain mûr, du bobolo ou du miondo.",
    ],
  },
  {
    id: "poisson",
    title: "Poisson braisé camerounais",
    products: ["epices", "tomate"],
    time: "45 min + marinade",
    serves: "4 personnes",
    image: "assets/img/poisson-braise.jpg",
    ingredients: [
      "2 poissons entiers (bar, tilapia, maquereau…) nettoyés",
      "The Chef Épices et The Chef Tomate",
      "1 oignon, 3 gousses d’ail, un morceau de gingembre",
      "Un bouquet de persil ou de céleri",
      "Jus d’un citron, huile, sel",
    ],
    steps: [
      "Inciser les poissons de chaque côté.",
      "Assaisonner : mixer l’oignon, l’ail, le gingembre et les herbes avec The Chef Épices, The Chef Tomate, le citron et un filet d’huile.",
      "Mariner : enduire les poissons à l’intérieur et à l’extérieur, puis laisser reposer 30 minutes à 2 heures au frais.",
      "Griller 10 à 15 minutes de chaque côté au barbecue, au grill ou au four, en badigeonnant de marinade.",
      "Servir avec du plantain frit, du bobolo, des oignons et du piment.",
    ],
  },
  {
    id: "poulet",
    title: "Poulet braisé",
    products: ["epices"],
    time: "1 h + marinade",
    serves: "4 personnes",
    icon: "i-chicken",
    color: "linear-gradient(135deg, #b8541f, #e08a2c)",
    ingredients: [
      "1 poulet découpé en morceaux",
      "The Chef Épices",
      "1 oignon, 3 gousses d’ail, un morceau de gingembre",
      "Jus d’un citron, huile, sel",
    ],
    steps: [
      "Mixer l’oignon, l’ail et le gingembre avec The Chef Épices, le citron et l’huile.",
      "Enrober les morceaux de poulet et laisser mariner au moins 1 heure au frais.",
      "Cuire au barbecue ou au four à 200 °C pendant 40 à 45 minutes en retournant à mi-cuisson.",
      "Servir avec des frites de plantain, du riz ou une salade.",
    ],
  },
  {
    id: "sauce-tomate",
    title: "Sauce tomate africaine",
    products: ["tomate"],
    time: "40 min",
    serves: "4 personnes",
    icon: "i-tomato",
    color: "linear-gradient(135deg, #a8291c, #e0543f)",
    ingredients: [
      "The Chef Tomate",
      "4 tomates fraîches",
      "2 oignons, 2 gousses d’ail",
      "1 poivron",
      "Huile, sel, piment (facultatif)",
      "Viande, poisson ou œufs au choix",
    ],
    steps: [
      "Faire revenir les oignons émincés et l’ail dans l’huile.",
      "Ajouter les tomates et le poivron mixés, puis The Chef Tomate.",
      "Laisser mijoter 20 à 25 minutes jusqu’à ce que la sauce épaississe.",
      "Ajouter la viande, le poisson ou les œufs et poursuivre la cuisson. Servir avec du riz, des pâtes ou du plantain.",
    ],
  },
  {
    id: "legumes-sautes",
    title: "Légumes sautés",
    products: ["legumes", "epices"],
    time: "25 min",
    serves: "4 personnes",
    icon: "i-leaf",
    color: "linear-gradient(135deg, #1d5e3b, #5f9e3a)",
    ingredients: [
      "The Chef Légumes",
      "Légumes de saison au choix (carottes, haricots verts, chou, poivrons…)",
      "1 oignon",
      "The Chef Épices",
      "Huile, sel",
    ],
    steps: [
      "Faire revenir l’oignon émincé dans l’huile.",
      "Ajouter les légumes coupés et faire sauter 8 à 10 minutes à feu vif.",
      "Incorporer The Chef Légumes et assaisonner avec The Chef Épices.",
      "Poursuivre la cuisson quelques minutes. Servir en accompagnement ou en plat végétarien.",
    ],
  },
  {
    id: "marinade-bbq",
    title: "Marinade pour barbecue",
    products: ["epices", "tomate"],
    time: "10 min",
    serves: "1 kg de viande",
    icon: "i-grill",
    color: "linear-gradient(135deg, #4a2c1a, #9a3b1e)",
    ingredients: [
      "The Chef Épices et The Chef Tomate",
      "4 cuillères à soupe d’huile",
      "Jus d’un citron",
      "2 gousses d’ail, 1 oignon",
      "1 cuillère de miel (facultatif)",
    ],
    steps: [
      "Mixer tous les ingrédients jusqu’à obtenir une marinade homogène.",
      "Enrober viandes, brochettes, poissons ou légumes.",
      "Laisser mariner 1 heure minimum, idéalement une nuit au frais.",
      "Griller au barbecue en badigeonnant régulièrement.",
    ],
  },
];

/* ---------------------------------------------------------
   4. ÉVOLUTIONS PRÉVUES (points d'extension)
   - Paiement : Stripe, PayPal, Apple Pay, Google Pay → implémenter processPayment()
   - Livraison locale / expédition nationale → shippingCost()
   - Codes promotionnels → applyPromo()
   - Gestion de stock → champ "stock" sur chaque produit + availability
   - Compte client → authentification côté serveur
   --------------------------------------------------------- */
function shippingCost(/* deliveryMode, subtotal */) {
  return 0; // Frais de livraison communiqués à la confirmation pour le moment
}
function applyPromo(/* code, subtotal */) {
  return 0; // Remise à implémenter
}
async function processPayment(order) {
  // Brancher ici Stripe Checkout, PayPal, Apple Pay ou Google Pay.
  // Pour l'instant, la commande est transmise via WhatsApp et confirmée manuellement.
  openWhatsApp(buildCheckoutMessage(order));
  return { status: "sent" };
}

/* =========================================================
   Utilitaires
   ========================================================= */
const $ = (sel, ctx = document) => ctx.querySelector(sel);
const $$ = (sel, ctx = document) => [...ctx.querySelectorAll(sel)];
const money = new Intl.NumberFormat(CONFIG.locale, { style: "currency", currency: CONFIG.currency });
const fmt = (n) => money.format(n);
const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
const productById = (id) => PRODUCTS.find((p) => p.id === id);
const icon = (id) => `<svg aria-hidden="true"><use href="#${id}"/></svg>`;

function whatsappUrl(text) {
  const base = CONFIG.whatsappNumber ? `https://wa.me/${CONFIG.whatsappNumber}` : "https://wa.me/";
  return `${base}?text=${encodeURIComponent(text)}`;
}
function openWhatsApp(text) {
  window.open(whatsappUrl(text), "_blank", "noopener");
}

let toastTimer;
function toast(msg) {
  const el = $("#toast");
  el.innerHTML = `${icon("i-check")}<span>${esc(msg)}</span>`;
  el.classList.add("is-visible");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => el.classList.remove("is-visible"), 2600);
}

/* =========================================================
   Panier
   ========================================================= */
const cart = {
  items: {}, // { productId: quantity }

  load() {
    try {
      const saved = JSON.parse(localStorage.getItem(CONFIG.storageKey) || "{}");
      Object.entries(saved).forEach(([id, q]) => {
        if (productById(id) && q > 0) this.items[id] = Math.min(99, Math.floor(q));
      });
    } catch { /* stockage indisponible : panier en mémoire uniquement */ }
  },
  save() {
    try { localStorage.setItem(CONFIG.storageKey, JSON.stringify(this.items)); } catch { /* ignoré */ }
  },
  add(id, qty = 1) {
    const p = productById(id);
    if (!p || p.availability === "out_of_stock") return;
    this.items[id] = Math.min(99, (this.items[id] || 0) + qty);
    this.save(); renderCart(); bumpCart();
    toast(`${qty} × ${p.name} ajouté au panier`);
  },
  set(id, qty) {
    if (qty <= 0) delete this.items[id];
    else this.items[id] = Math.min(99, qty);
    this.save(); renderCart();
  },
  remove(id) { delete this.items[id]; this.save(); renderCart(); },
  clear() { this.items = {}; this.save(); renderCart(); },
  lines() {
    return Object.entries(this.items).map(([id, qty]) => {
      const p = productById(id);
      return { product: p, qty, unit: p.price, subtotal: p.price * qty };
    });
  },
  count() { return Object.values(this.items).reduce((a, b) => a + b, 0); },
  total() { return this.lines().reduce((a, l) => a + l.subtotal, 0); },
};

function bumpCart() {
  const btn = $("#cartToggle");
  btn.classList.remove("is-bump");
  void btn.offsetWidth; // relance l'animation
  btn.classList.add("is-bump");
}

function qtyControl(value, attrs = "") {
  return `
    <div class="qty" ${attrs}>
      <button type="button" data-qty="-1" aria-label="Diminuer la quantité">${icon("i-minus")}</button>
      <input type="number" min="1" max="99" value="${value}" aria-label="Quantité" inputmode="numeric">
      <button type="button" data-qty="1" aria-label="Augmenter la quantité">${icon("i-plus")}</button>
    </div>`;
}

function renderCart() {
  const lines = cart.lines();
  const count = cart.count();
  $("#cartCount").textContent = count;
  $("#cartTotal").textContent = fmt(cart.total());
  $("#checkoutTotal").textContent = fmt(cart.total());
  $("#checkoutBtn").disabled = !count;
  $("#whatsappOrderBtn").disabled = !count;

  const box = $("#cartItems");
  if (!lines.length) {
    box.innerHTML = `
      <div class="cart__empty">
        ${icon("i-cart")}
        <p>Votre panier est vide.</p>
        <a href="#boutique" class="btn btn--outline" data-close-cart>Découvrir nos produits</a>
      </div>`;
    return;
  }
  box.innerHTML = lines.map(({ product: p, qty, unit, subtotal }) => `
    <div class="citem" data-id="${p.id}">
      <div class="citem__img"><img src="${esc(p.image)}" alt=""></div>
      <div>
        <div class="citem__name">${esc(p.name)}</div>
        <div class="citem__unit">Prix unitaire : ${fmt(unit)}</div>
        ${qtyControl(qty, 'data-cart-qty')}
      </div>
      <div class="citem__right">
        <button class="citem__remove" data-remove aria-label="Retirer ${esc(p.name)}">${icon("i-trash")}</button>
        <span class="citem__sub" title="Sous-total">${fmt(subtotal)}</span>
      </div>
    </div>`).join("");
}

/* ---------- Ouverture / fermeture du tiroir ---------- */
const cartEl = $("#cart");
const overlay = $("#overlay");

function openCart() {
  showCartStep("cart");
  overlay.hidden = false;
  requestAnimationFrame(() => overlay.classList.add("is-visible"));
  cartEl.classList.add("is-open");
  cartEl.setAttribute("aria-hidden", "false");
  document.body.classList.add("no-scroll");
  $("#cartClose").focus();
}
function closeCart() {
  cartEl.classList.remove("is-open");
  cartEl.setAttribute("aria-hidden", "true");
  overlay.classList.remove("is-visible");
  document.body.classList.remove("no-scroll");
  setTimeout(() => { overlay.hidden = true; }, 300);
}
function showCartStep(step) {
  const isCheckout = step === "checkout";
  $("#cartView").hidden = isCheckout;
  $("#checkoutForm").hidden = !isCheckout;
  $("#cartTitle").textContent = isCheckout ? "Vos informations" : "Votre panier";
}

/* ---------- Messages de commande ---------- */
function buildWhatsAppMessage() {
  const lines = cart.lines().map((l) => `${l.qty} × ${l.product.name}`).join("\n");
  return `Bonjour The Chef,\nJe voudrais passer la commande suivante :\n${lines}\nTotal : ${fmt(cart.total())}\nMerci.`;
}

const DELIVERY_LABELS = { local: "Livraison locale", national: "Expédition nationale", pickup: "Retrait sur place" };

function buildCheckoutMessage(order) {
  const lines = order.lines.map((l) => `${l.qty} × ${l.name} (${fmt(l.unit)}) = ${fmt(l.subtotal)}`).join("\n");
  return [
    "Bonjour The Chef,",
    "Je voudrais passer la commande suivante :",
    lines,
    `Total : ${fmt(order.total)}`,
    "",
    `Nom : ${order.customer.name}`,
    `Téléphone : ${order.customer.phone}`,
    order.customer.email ? `E-mail : ${order.customer.email}` : "",
    `Réception : ${DELIVERY_LABELS[order.delivery] || order.delivery}`,
    order.address ? `Adresse : ${order.address}` : "",
    "",
    "Merci.",
  ].filter((l, i, arr) => l !== "" || arr[i - 1] !== "").join("\n");
}

/* =========================================================
   Rendu boutique & recettes
   ========================================================= */
function renderShop() {
  const AVAIL = {
    in_stock: { label: "Disponible", cls: "" },
    preorder: { label: "Précommande", cls: "scard__badge--preorder" },
    out_of_stock: { label: "Rupture", cls: "scard__badge--out" },
  };
  $("#shopGrid").innerHTML = PRODUCTS.map((p, i) => {
    const a = AVAIL[p.availability] || AVAIL.in_stock;
    const out = p.availability === "out_of_stock";
    return `
    <article class="scard reveal" id="product-${p.id}" data-id="${p.id}" style="--c:${p.color}; --d:${i * 0.08}s">
      <div class="scard__media scard__media--${p.imageType}">
        <img src="${esc(p.image)}" alt="${esc(p.name)}" loading="lazy">
        <span class="scard__badge ${a.cls}">${a.label}</span>
      </div>
      <div class="scard__body">
        <p class="scard__cat">${esc(p.category)}</p>
        <h3>${esc(p.name)}</h3>
        <p class="scard__desc">${esc(p.description)}</p>
        <p class="scard__price">${fmt(p.price)}${p.weight ? `<small>/ ${esc(p.weight)}</small>` : ""}</p>
        <div class="scard__actions">
          ${qtyControl(1, 'data-shop-qty')}
          <button class="btn btn--primary" data-add-qty="${p.id}" ${out ? "disabled" : ""}>
            ${icon("i-cart")}<span>${out ? "Indisponible" : "Ajouter au panier"}</span>
          </button>
        </div>
      </div>
    </article>`;
  }).join("");
}

function productTags(ids) {
  return ids.map((id) => {
    const p = productById(id);
    return `<li style="--c:${p.color}">${esc(p.name)}</li>`;
  }).join("");
}

function recipeMedia(r, cls) {
  return r.image
    ? `<div class="${cls}"><img src="${esc(r.image)}" alt="${esc(r.title)}" loading="lazy">`
    : `<div class="${cls} ${cls}--illus" style="background:${r.color}">${icon(r.icon)}`;
}

function renderRecipes() {
  $("#recipesGrid").innerHTML = RECIPES.map((r, i) => `
    <article class="rcard reveal" style="--d:${(i % 3) * 0.08}s">
      ${recipeMedia(r, "rcard__media")}
        <span class="rcard__time">${icon("i-clock")}${esc(r.time)}</span>
      </div>
      <div class="rcard__body">
        <h3>${esc(r.title)}</h3>
        <p class="rcard__label">${r.products.length > 1 ? "Produits recommandés" : "Produit recommandé"}</p>
        <ul class="tags">${productTags(r.products)}</ul>
        <button class="btn btn--outline" data-recipe="${r.id}">Voir la recette</button>
      </div>
    </article>`).join("");
}

/* ---------- Modale recette ---------- */
const modal = $("#recipeModal");

function openRecipe(id) {
  const r = RECIPES.find((x) => x.id === id);
  if (!r) return;
  $("#recipeContent").innerHTML = `
    ${recipeMedia(r, "modal__hero")}</div>
    <div class="modal__body">
      <h2 id="recipeTitle">${esc(r.title)}</h2>
      <div class="modal__meta">
        <ul class="tags" style="margin:0">
          <li>${esc(r.time)}</li><li>${esc(r.serves)}</li>${productTags(r.products)}
        </ul>
      </div>
      <div class="modal__cols">
        <div>
          <h3>Ingrédients</h3>
          <ul>${r.ingredients.map((x) => `<li>${esc(x)}</li>`).join("")}</ul>
        </div>
        <div>
          <h3>Préparation</h3>
          <ol>${r.steps.map((x) => `<li>${esc(x)}</li>`).join("")}</ol>
        </div>
      </div>
      <div class="btn-row">
        ${r.products.map((pid) => `<button class="btn btn--primary" data-add="${pid}">${icon("i-cart")}Ajouter ${esc(productById(pid).name)}</button>`).join("")}
      </div>
      <p class="modal__disclaimer">Quantités de produits The Chef : se référer aux indications figurant sur l’emballage et ajuster selon votre goût.</p>
    </div>`;
  if (typeof modal.showModal === "function") modal.showModal();
  else modal.setAttribute("open", "");
}
function closeRecipe() {
  if (typeof modal.close === "function") modal.close();
  else modal.removeAttribute("open");
}

/* =========================================================
   Navigation
   ========================================================= */
function initNav() {
  const nav = $("#nav");
  const burger = $("#navBurger");
  const menu = $("#navMenu");

  const setMenu = (open) => {
    menu.classList.toggle("is-open", open);
    burger.setAttribute("aria-expanded", String(open));
    burger.setAttribute("aria-label", open ? "Fermer le menu" : "Ouvrir le menu");
    burger.querySelector("use").setAttribute("href", open ? "#i-x" : "#i-menu");
    document.body.classList.toggle("no-scroll", open);
  };
  burger.addEventListener("click", () => setMenu(!menu.classList.contains("is-open")));
  $$("a", menu).forEach((a) => a.addEventListener("click", () => setMenu(false)));
  window.addEventListener("resize", () => { if (window.innerWidth > 1024) setMenu(false); });

  const onScroll = () => nav.classList.toggle("is-scrolled", window.scrollY > 10);
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });

  // Lien actif selon la section visible
  const links = $$('.nav__menu a[href^="#"]:not(.btn)');
  const sections = links.map((a) => $(a.getAttribute("href"))).filter(Boolean);
  if ("IntersectionObserver" in window) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (!e.isIntersecting) return;
        links.forEach((a) => a.classList.toggle("is-active", a.getAttribute("href") === `#${e.target.id}`));
      });
    }, { rootMargin: "-45% 0px -50% 0px" });
    sections.forEach((s) => io.observe(s));
  }
}

/* =========================================================
   Animations d'apparition
   ========================================================= */
function initReveal() {
  const els = $$(".reveal");
  if (!("IntersectionObserver" in window)) {
    els.forEach((el) => el.classList.add("is-visible"));
    return;
  }
  // Décalage progressif pour les éléments frères d'une même grille
  els.forEach((el) => {
    if (el.style.getPropertyValue("--d")) return;
    const siblings = [...el.parentElement.children].filter((c) => c.classList.contains("reveal"));
    const idx = siblings.indexOf(el);
    if (idx > 0) el.style.setProperty("--d", `${Math.min(idx, 5) * 0.08}s`);
  });
  const io = new IntersectionObserver((entries) => {
    entries.forEach((e) => {
      if (e.isIntersecting) { e.target.classList.add("is-visible"); io.unobserve(e.target); }
    });
  }, { threshold: 0.12, rootMargin: "0px 0px -40px 0px" });
  els.forEach((el) => io.observe(el));
}

/* =========================================================
   Gestion des événements (délégation)
   ========================================================= */
function readQty(container) {
  const input = $("input", container);
  const v = Math.max(1, Math.min(99, parseInt(input.value, 10) || 1));
  input.value = v;
  return v;
}

function scrollToProduct(id) {
  const card = $(`#product-${id}`);
  if (!card) return;
  card.scrollIntoView({ behavior: "smooth", block: "center" });
  card.classList.remove("is-highlight");
  void card.offsetWidth;
  card.classList.add("is-highlight");
}

function initEvents() {
  document.addEventListener("click", (e) => {
    const t = e.target;

    // +/- quantité
    const qBtn = t.closest("[data-qty]");
    if (qBtn) {
      const wrap = qBtn.closest(".qty");
      const input = $("input", wrap);
      const next = Math.max(wrap.hasAttribute("data-cart-qty") ? 0 : 1, Math.min(99, (parseInt(input.value, 10) || 1) + Number(qBtn.dataset.qty)));
      input.value = next;
      if (wrap.hasAttribute("data-cart-qty")) cart.set(wrap.closest(".citem").dataset.id, next);
      return;
    }

    // Ajouter au panier depuis la boutique (avec quantité)
    const addQty = t.closest("[data-add-qty]");
    if (addQty) {
      const qty = readQty($("[data-shop-qty]", addQty.closest(".scard")));
      cart.add(addQty.dataset.addQty, qty);
      return;
    }

    // Ajouter 1 unité (boutons "Commander The Chef Légumes", modale recette)
    const add = t.closest("[data-add]");
    if (add) { cart.add(add.dataset.add, 1); return; }

    const goto = t.closest("[data-goto]");
    if (goto) { scrollToProduct(goto.dataset.goto); return; }

    const recipe = t.closest("[data-recipe]");
    if (recipe) { openRecipe(recipe.dataset.recipe); return; }

    const remove = t.closest("[data-remove]");
    if (remove) { cart.remove(remove.closest(".citem").dataset.id); return; }

    if (t.closest("[data-close-cart]")) { closeCart(); return; }

    // Liens WhatsApp génériques
    const wa = t.closest("[data-whatsapp-link]");
    if (wa) {
      e.preventDefault();
      openWhatsApp(cart.count() ? buildWhatsAppMessage() : "Bonjour The Chef, je souhaite avoir des informations sur vos produits.");
    }

    const mail = t.closest("[data-email-link]");
    if (mail) { e.preventDefault(); window.location.href = `mailto:${CONFIG.email}`; }
  });

  // Saisie directe de la quantité dans le panier
  document.addEventListener("change", (e) => {
    const wrap = e.target.closest("[data-cart-qty]");
    if (wrap) cart.set(wrap.closest(".citem").dataset.id, readQty(wrap));
    else if (e.target.closest("[data-shop-qty]")) readQty(e.target.closest("[data-shop-qty]"));
  });

  $("#cartToggle").addEventListener("click", openCart);
  $("#cartClose").addEventListener("click", closeCart);
  overlay.addEventListener("click", closeCart);
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && cartEl.classList.contains("is-open")) closeCart();
  });

  $("#whatsappOrderBtn").addEventListener("click", () => {
    if (cart.count()) openWhatsApp(buildWhatsAppMessage());
  });
  $("#checkoutBtn").addEventListener("click", () => {
    if (cart.count()) { showCartStep("checkout"); $('#checkoutForm [name="name"]').focus(); }
  });
  $("#backToCart").addEventListener("click", () => showCartStep("cart"));

  // Formulaire de commande
  $("#checkoutForm").addEventListener("submit", async (e) => {
    e.preventDefault();
    const form = e.currentTarget;
    const data = Object.fromEntries(new FormData(form));
    const required = ["name", "phone"];
    if (data.delivery !== "pickup") required.push("address");
    let ok = true;
    required.forEach((n) => {
      const field = form.elements[n];
      const bad = !String(data[n] || "").trim();
      field.classList.toggle("is-invalid", bad);
      if (bad && ok) { field.focus(); ok = false; }
    });
    if (!ok) { toast("Merci de compléter les champs obligatoires"); return; }

    const lines = cart.lines().map((l) => ({ id: l.product.id, name: l.product.name, qty: l.qty, unit: l.unit, subtotal: l.subtotal }));
    const subtotal = cart.total();
    const order = {
      lines,
      subtotal,
      shipping: shippingCost(data.delivery, subtotal),
      discount: applyPromo(data.promo, subtotal),
      customer: { name: data.name.trim(), phone: data.phone.trim(), email: (data.email || "").trim() },
      delivery: data.delivery,
      address: (data.address || "").trim(),
    };
    order.total = order.subtotal + order.shipping - order.discount;

    await processPayment(order);
    cart.clear();
    form.reset();
    closeCart();
    toast("Merci ! Votre commande a été transmise à The Chef.");
  });

  // Formulaire de contact → WhatsApp
  $("#contactForm").addEventListener("submit", (e) => {
    e.preventDefault();
    const form = e.currentTarget;
    const data = Object.fromEntries(new FormData(form));
    let ok = true;
    ["name", "contact", "message"].forEach((n) => {
      const bad = !String(data[n] || "").trim();
      form.elements[n].classList.toggle("is-invalid", bad);
      if (bad) ok = false;
    });
    if (!ok) { $("#contactStatus").textContent = "Merci de remplir tous les champs."; return; }
    openWhatsApp(`Bonjour The Chef,\n${data.message.trim()}\n\n${data.name.trim()} – ${data.contact.trim()}`);
    $("#contactStatus").textContent = "Votre message est prêt dans WhatsApp. Merci !";
    form.reset();
  });

  $("#recipeClose").addEventListener("click", closeRecipe);
  modal.addEventListener("click", (e) => { if (e.target === modal) closeRecipe(); });
}

/* =========================================================
   Initialisation
   ========================================================= */
function initBadge() {
  // N'affiche "Certified Organic" que si CONFIG.certifiedOrganic est vrai.
  $("#naturalBadge span").textContent = CONFIG.certifiedOrganic
    ? "Certified Organic"
    : "Made with carefully selected natural ingredients";
  $$("[data-email-link]").forEach((a) => { a.textContent = CONFIG.email; });
}

document.addEventListener("DOMContentLoaded", () => {
  renderShop();
  renderRecipes();
  cart.load();
  renderCart();
  initBadge();
  initNav();
  initEvents();
  initReveal();
});
