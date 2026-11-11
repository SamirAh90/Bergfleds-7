'use strict';

document.addEventListener('DOMContentLoaded', () => {

  /* Upgrade older page shells to the shared command-bar design. */
  const header = document.querySelector('.site-header');
  const headerInner = header?.querySelector('.header-inner');
  const logo = header?.querySelector('.site-logo');
  const nav = header?.querySelector('.site-nav');
  const legacyMenu = header?.querySelector('#menu');
  const legacyPhone = headerInner?.querySelector(':scope > .header-phone');

  if (logo && !logo.querySelector('.logo-mark')) {
    logo.innerHTML = '<span class="logo-mark">BERGFELDS</span><span class="logo-badge">LUDVIKA INDUSTRI</span>';
  }
  if (nav) {
    nav.innerHTML = '<a href="sortiment.html">Sortiment</a><a href="sortiment.html#leverantorer">Leverantörer</a><a href="butiken.html">Butik</a><a href="kontakta-oss.html">Kontakt</a><a href="om-bergfelds.html">Om oss</a>';
  }
  if (legacyMenu) legacyMenu.id = 'menu-btn';
  if (legacyPhone) legacyPhone.remove();
  if (headerInner && !headerInner.querySelector('.header-tools')) {
    const tools = document.createElement('div');
    tools.className = 'header-tools';
    tools.innerHTML = '<span class="header-status" data-opening-status><span class="status-dot"></span><span class="status-text mono-label">Kontrollerar...</span></span><a class="header-phone" href="tel:+46240410210">0240-410 210</a>';
    headerInner.insertBefore(tools, headerInner.querySelector('#menu-btn'));
  }

  const footer = document.querySelector('.site-footer');
  if (footer && !footer.querySelector('.footer-col')) {
    footer.innerHTML = '<div class="container"><div class="footer-grid"><div class="footer-col"><div class="footer-logo-mark">BERGFELDS</div><p class="footer-tagline">Din personliga inköpskanal för industri, VVS och verkstad i Ludvika.</p></div><div class="footer-col"><h4>Navigation</h4><a href="index.html">Startsida</a><a href="sortiment.html">Sortiment</a><a href="butiken.html">Butiken</a><a href="om-bergfelds.html">Om Bergfelds</a><a href="du-som-kund.html">Du som kund</a><a href="kontakta-oss.html">Kontakta oss</a></div><div class="footer-col"><h4>Kontakt</h4><a href="tel:+46240410210">0240-410 210</a><a href="mailto:order@bergfelds.se">order@bergfelds.se</a><a href="tel:+46240410216">Jan: 0240-410 216</a><a href="tel:+46240410217">Carin: 0240-410 217</a></div><div class="footer-col"><h4>Adress</h4><a href="https://www.google.com/maps/search/?api=1&query=Gatubacken+9+771+42+Ludvika" target="_blank" rel="noreferrer">Gatubacken 9, 771 42 Ludvika</a><a href="integritetspolicy.html">Integritetspolicy</a></div></div><div class="footer-bottom"><p>© <span data-year></span> Bergfeld Försäljning AB · Org.nr 559516-9508</p></div></div>';
  }

  /* =========================================================
     1. DYNAMIC YEAR
     ========================================================= */
  document.querySelectorAll('[data-year]').forEach(el => {
    el.textContent = new Date().getFullYear();
  });


  /* =========================================================
     2. STORE STATUS (Swedish Business Hours)
     ========================================================= */
  function getSwedishTime() {
    const now = new Date();
    const formatter = new Intl.DateTimeFormat('sv-SE', {
      timeZone: 'Europe/Stockholm',
      weekday: 'short',
      hour: '2-digit',
      minute: '2-digit',
      hour12: false
    });
    const parts = formatter.formatToParts(now);
    const weekday = parts.find(p => p.type === 'weekday').value.toLowerCase(); // mån, tis, ons, tors, fre, lör, sön
    const hour = parseInt(parts.find(p => p.type === 'hour').value, 10);
    const minute = parseInt(parts.find(p => p.type === 'minute').value, 10);
    const totalMinutes = hour * 60 + minute;

    const openDays = ['mån', 'tis', 'ons', 'tors'];
    const fridayDays = ['fre'];

    let isOpen = false;
    let closeTime = '';

    if (openDays.includes(weekday) && totalMinutes >= 7 * 60 && totalMinutes < 16 * 60) {
      isOpen = true;
      closeTime = '16:00';
    } else if (fridayDays.includes(weekday) && totalMinutes >= 7 * 60 && totalMinutes < 13 * 60) {
      isOpen = true;
      closeTime = '13:00';
    }

    return { isOpen, closeTime, weekday, hour, minute };
  }

  function updateStoreStatus() {
    const { isOpen, closeTime } = getSwedishTime();

    document.querySelectorAll('[data-opening-status]').forEach(el => {
      const dot = el.querySelector('.status-dot');
      const text = el.querySelector('.status-text');
      if (dot) dot.classList.toggle('open', isOpen);
      if (text) text.textContent = isOpen ? `ÖPPET NU TILL ${closeTime}` : 'STÄNGT';
    });

    document.querySelectorAll('[data-status-short]').forEach(el => {
      el.textContent = isOpen ? 'ÖPPET' : 'STÄNGT';
      el.style.color = isOpen ? 'var(--green)' : 'var(--red)';
    });
  }

  updateStoreStatus();
  setInterval(updateStoreStatus, 30000);


  /* =========================================================
     3. MOBILE MENU TOGGLE
     ========================================================= */
  const menuBtn = document.getElementById('menu-btn');
  const siteNav = document.querySelector('.site-nav');

  if (menuBtn && siteNav) {
    menuBtn.addEventListener('click', () => {
      const isOpen = siteNav.classList.toggle('open');
      menuBtn.setAttribute('aria-expanded', isOpen);
      menuBtn.textContent = isOpen ? '✕' : '☰';
    });

    // Close on nav link click
    siteNav.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        siteNav.classList.remove('open');
        menuBtn.setAttribute('aria-expanded', false);
        menuBtn.textContent = '☰';
      });
    });

    // Close on outside click
    document.addEventListener('click', (e) => {
      if (!menuBtn.contains(e.target) && !siteNav.contains(e.target)) {
        siteNav.classList.remove('open');
        menuBtn.setAttribute('aria-expanded', false);
        menuBtn.textContent = '☰';
      }
    });
  }


  /* =========================================================
     4. ACTIVE NAV LINK
     ========================================================= */
  const currentPage = location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.site-nav a').forEach(a => {
    const href = a.getAttribute('href');
    if (href === currentPage || (currentPage === '' && href === 'index.html')) {
      a.classList.add('active');
    }
  });


  /* =========================================================
     5. QUICK INQUIRY TERMINAL (Part Finder)
     ========================================================= */
  let selectedCategory = 'Industri & Drift';

  const pills = document.querySelectorAll('.pill[data-area]');
  pills.forEach(pill => {
    pill.addEventListener('click', () => {
      pills.forEach(p => p.classList.remove('active'));
      pill.classList.add('active');
      selectedCategory = pill.dataset.area;
    });
  });

  const terminalForm = document.getElementById('terminal-form');
  if (terminalForm) {
    terminalForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const msgInput = document.getElementById('terminal-message');
      const msg = msgInput ? msgInput.value.trim() : '';
      if (!msg) return;

      const subject = encodeURIComponent(`Förfrågan – ${selectedCategory}`);
      const body = encodeURIComponent(
        `Hej Bergfelds,\n\nKategori: ${selectedCategory}\n\nArtikel / Beskrivning:\n${msg}\n\n---\nSkickat via bergfelds.se`
      );
      window.location.href = `mailto:order@bergfelds.se?subject=${subject}&body=${body}`;
    });
  }

  // Also handle standalone send button (not in form)
  const sendBtn = document.querySelector('.send-btn');
  if (sendBtn && !terminalForm) {
    sendBtn.addEventListener('click', () => {
      const msgInput = document.getElementById('terminal-message');
      const msg = msgInput ? msgInput.value.trim() : '';
      if (!msg) return;
      const subject = encodeURIComponent(`Förfrågan – ${selectedCategory}`);
      const body = encodeURIComponent(
        `Hej Bergfelds,\n\nKategori: ${selectedCategory}\n\nArtikel / Beskrivning:\n${msg}\n\n---\nSkickat via bergfelds.se`
      );
      window.location.href = `mailto:order@bergfelds.se?subject=${subject}&body=${body}`;
    });
  }


  /* =========================================================
     6. SUPPLIER / BRAND SEARCH & FILTER
     ========================================================= */
  const brandSearch = document.getElementById('brand-search');
  const filterPills = document.querySelectorAll('.filter-pill[data-filter]');
  let activeFilter = 'all';

  function applyBrandFilter() {
    const query = brandSearch ? brandSearch.value.toLowerCase().trim() : '';
    document.querySelectorAll('.brand-tile').forEach(tile => {
      const name = (tile.dataset.name || tile.querySelector('.brand-text')?.textContent || '').toLowerCase();
      const cat = (tile.dataset.category || '').toLowerCase();
      const matchesFilter = activeFilter === 'all' || cat === activeFilter;
      const matchesSearch = !query || name.includes(query);
      tile.toggleAttribute('data-hidden', !(matchesFilter && matchesSearch));
      tile.style.display = (matchesFilter && matchesSearch) ? '' : 'none';
    });
  }

  if (brandSearch) {
    brandSearch.addEventListener('input', applyBrandFilter);
  }

  filterPills.forEach(pill => {
    pill.addEventListener('click', () => {
      filterPills.forEach(p => p.classList.remove('active'));
      pill.classList.add('active');
      activeFilter = pill.dataset.filter;
      applyBrandFilter();
    });
  });


  /* =========================================================
     7. PRODUCT CATEGORY PAGES
     ========================================================= */
  const categoryPage = document.querySelector('[data-category-page]');
  if (categoryPage) {
    const categoryData = {
      'kullager': { name: 'Kullager', image: 'assets/industry.jpg', description: 'Kullager och relaterade komponenter för industrins drift och underhåll.', groups: ['Kullager', 'Lagerenheter'] },
      'vvs': { name: 'VVS', image: 'assets/editorial/plumbing-pipes.jpg', description: 'VVS-produkter, förbrukningsmaterial och tillbehör för professionell användning.', groups: ['VVS-produkter', 'Förbrukningsmaterial', 'Tillbehör'] },
      'kyla': { name: 'Kyla', image: 'assets/plumbing.jpg', description: 'Kyla är ett av Bergfelds angivna produktområden.', groups: [] },
      'infastning': { name: 'Infästning', image: 'assets/bergfelds-product-overview.jpg', description: 'Infästningsprodukter för professionella verksamheter och montage.', groups: ['Skruv', 'Mutter & bult', 'Gängstång', 'Plugg & ankare'] },
      'kap-och-slip': { name: 'Kap & Slip', image: 'assets/editorial/workshop-tools.jpg', description: 'Produkter för kapning, slipning och skärande bearbetning.', groups: ['Klingor', 'Slipskivor', 'Skärande verktyg'] },
      'svets': { name: 'Svets', image: 'assets/editorial/cnc-workshop.jpg', description: 'Svetsutrustning, material, gas och skydd för professionellt arbete.', groups: ['Svetsutrustning', 'Tillsatsmaterial', 'Industrigas', 'Skydd'] },
      'tatningar': { name: 'Tätningar', image: 'assets/industry.jpg', description: 'Tätningar är ett av Bergfelds angivna produktområden.', groups: [] },
      'drivremmar': { name: 'Drivremmar', image: 'assets/industry.jpg', description: 'Drivremmar är ett av Bergfelds angivna produktområden.', groups: [] },
      'verktyg': { name: 'Verktyg', image: 'assets/editorial/workshop-tools.jpg', description: 'Handverktyg, elverktyg, maskiner och skärande verktyg för arbetsdagen.', groups: ['Handverktyg', 'Elverktyg & maskiner', 'Skärande verktyg'] },
      'tryckluft': { name: 'Tryckluft', image: 'assets/workshop.jpg', description: 'Kompressorer, luftverktyg och tillbehör för tryckluft.', groups: ['Kompressorer', 'Luftverktyg', 'Slang & tillbehör'] },
      'smorjmedel': { name: 'Smörjmedel', image: 'assets/industry.jpg', description: 'Smörjmedel och kemprodukter för drift, underhåll och montage.', groups: ['Oljor', 'Fett', 'Avfettning', 'Lim, fog & gänglåsning'] },
      'mark-och-va': { name: 'Mark & VA', image: 'assets/editorial/warehouse-logistics.jpg', description: 'Mark & VA är ett av Bergfelds angivna produktområden.', groups: [] }
    };
    const slug = document.body.dataset.category;
    const category = categoryData[slug];
    if (category) {
      const groups = category.groups.length
        ? category.groups.map((group, index) => `<article class="spec-module"><span class="card-number">${String(index + 1).padStart(2, '0')}</span><h3>${group}</h3><p>Kontakta Bergfelds för tillgänglig produktinformation och rätt val för användningen.</p><a class="card-link" href="mailto:order@bergfelds.se?subject=${encodeURIComponent(`Förfrågan – ${category.name} / ${group}`)}">Fråga om ${group} →</a></article>`).join('')
        : '<div class="category-empty"><span class="badge accent">[UNDERLAG PÅ BEGÄRAN]</span><p>Beskriv behov, dimension eller artikelnummer så hjälper Bergfelds dig vidare.</p></div>';
      categoryPage.innerHTML = `<section class="category-tech-hero"><img src="${category.image}" alt="Illustrativ miljöbild för ${category.name}"><div class="container"><a class="category-back" href="index.html#sortimentskarta">← Sortiment</a><span class="badge accent">[PRODUKTOMRÅDE]</span><h1>${category.name}</h1><p>${category.description}</p><a class="btn btn-primary" href="mailto:order@bergfelds.se?subject=${encodeURIComponent(`Förfrågan – ${category.name}`)}">Skicka förfrågan</a></div></section><section class="section category-specs"><div class="container"><div class="section-header"><p class="section-eyebrow">// PRODUKTGRUPPER</p><h2>Teknisk översikt.</h2></div><div class="spec-grid">${groups}</div></div></section><section class="category-cta"><div class="container"><div><span class="badge">[DIREKTKONTAKT]</span><h2>Behöver du rätt komponent?</h2></div><div><a class="btn btn-primary" href="tel:+46240410210">0240-410 210</a><a class="btn btn-ghost" href="mailto:order@bergfelds.se">order@bergfelds.se</a></div></div></section>`;
    }
  }


  /* =========================================================
     8. SCROLL REVEAL (IntersectionObserver)
     ========================================================= */
  const reveals = document.querySelectorAll('[data-reveal]');
  if (reveals.length && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    // Inject reveal CSS
    const style = document.createElement('style');
    style.textContent = `.reveal-ready [data-reveal]{opacity:0;transform:translateY(24px);transition:opacity .6s ease,transform .6s ease}.reveal-ready [data-reveal].is-visible{opacity:1;transform:none}`;
    document.head.appendChild(style);

    document.documentElement.classList.add('reveal-ready');
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });
    reveals.forEach(el => observer.observe(el));
  }


  /* =========================================================
     8. CATEGORY MAP (Homepage) — Build dynamically
     ========================================================= */
  const categoryMapEl = document.querySelector('[data-category-map]');
  if (categoryMapEl) {
    const categories = [
      { id: '01', name: 'Industri & Automation',    href: 'sortiment.html#industri',  desc: 'Kullager · Tätningar · Drivremmar · Smörjmedel' },
      { id: '02', name: 'VVS & Rörsystem',           href: 'sortiment.html#vvs',       desc: 'Rördelar · Kopplingar · Ventiler · Flänsar' },
      { id: '03', name: 'Verktyg & Maskiner',        href: 'sortiment.html#verkstad',  desc: 'Handverktyg · Kap & Slip · Svets · Elverktyg' },
      { id: '04', name: 'Mark, VA & Förnödenheter', href: 'sortiment.html#mark-va',   desc: 'VA-komponenter · Skydd · Kem · Förbrukning' },
    ];

    categoryMapEl.innerHTML = `<div class="category-map">` +
      categories.map(c => `
      <a class="map-row" href="${c.href}">
        <span class="map-num">${c.id}</span>
        <span class="map-name">${c.name}</span>
        <span class="map-desc">${c.desc}</span>
        <span class="map-arrow">→</span>
      </a>`).join('') +
      `</div>`;
  }


  /* =========================================================
     9. BRAND GRID (Homepage) — Build dynamically
     ========================================================= */
  const brandGridEl = document.querySelector('[data-brand-grid]');
  if (brandGridEl) {
    const brands = [
      { name: 'SKF',        category: 'industri' },
      { name: 'Milwaukee',  category: 'verktyg'  },
      { name: 'Bosch',      category: 'verktyg'  },
      { name: 'Kemppi',     category: 'svets'    },
      { name: 'AGA',        category: 'svets'    },
      { name: 'Loctite',    category: 'kem'      },
      { name: 'Hultafors',  category: 'verktyg'  },
      { name: 'Ejendals',   category: 'skydd'    },
      { name: 'Teng Tools', category: 'verktyg'  },
      { name: 'Metabo',     category: 'verktyg'  },
      { name: 'Tyrolit',    category: 'verktyg'  },
      { name: 'CRC',        category: 'kem'      },
      { name: 'HiKOKI',    category: 'verktyg'  },
      { name: 'Kärcher',    category: 'verktyg'  },
      { name: 'Dormer',     category: 'industri' },
      { name: 'ISCAR',      category: 'industri' },
      { name: 'Guide',      category: 'skydd'    },
      { name: 'Arbesko',    category: 'skydd'    },
      { name: 'Mareld',     category: 'verktyg'  },
      { name: 'Stanley',    category: 'verktyg'  },
      { name: 'Habe',       category: 'industri' },
      { name: 'Fischer',    category: 'verktyg'  },
      { name: 'Fiskars',    category: 'verktyg'  },
      { name: 'Sievi',      category: 'skydd'    },
    ];

    const logoMap = {
      'SKF':        'assets/suppliers/skf.svg',
      'Milwaukee':  'assets/suppliers/milwaukee.png',
      'Bosch':      'assets/suppliers/bosch.svg',
      'Kemppi':     'assets/suppliers/kemppi.svg',
      'AGA':        'assets/suppliers/aga.svg',
      'Loctite':    'assets/suppliers/loctite.svg',
      'Hultafors':  'assets/suppliers/hultafors.svg',
      'Ejendals':   'assets/suppliers/ejendals.svg',
      'Teng Tools': 'assets/suppliers/tengtools.png',
      'Metabo':     'assets/suppliers/metabo.png',
      'Tyrolit':    'assets/suppliers/tyrolit.png',
      'CRC':        'assets/suppliers/crc.svg',
      'HiKOKI':    'assets/suppliers/hikoki.svg',
      'Kärcher':    'assets/suppliers/karcher.svg',
      'Dormer':     'assets/suppliers/dormer.svg',
      'ISCAR':      'assets/suppliers/iscar.svg',
      'Guide':      'assets/suppliers/guide.svg',
      'Arbesko':    'assets/suppliers/arbesko.svg',
      'Mareld':     'assets/suppliers/mareld.svg',
      'Stanley':    'assets/suppliers/stanley.svg',
      'Habe':       'assets/suppliers/habe.png',
      'Fischer':    'assets/suppliers/fischer.svg',
      'Fiskars':    'assets/suppliers/fiskars.png',
      'Sievi':      'assets/suppliers/sievi.svg',
    };

    brandGridEl.innerHTML = brands.map(b => {
      const logo = logoMap[b.name];
      const inner = logo
        ? `<img src="${logo}" alt="${b.name}" loading="lazy"><span class="brand-text">${b.name}</span>`
        : `<span class="brand-text">${b.name}</span>`;
      return `<div class="brand-tile" data-name="${b.name.toLowerCase()}" data-category="${b.category}">${inner}</div>`;
    }).join('');
  }


  /* =========================================================
     10. SUPPLIER DIRECTORY (sortiment.html) — Build dynamically
     ========================================================= */
  const supplierDirEl = document.querySelector('.supplier-directory');
  if (supplierDirEl) {
    const suppliers = [
      { name: 'SKF',        img: 'assets/suppliers/skf.svg',        url: 'https://www.skf.com/se',                    category: 'Kullager & Lager'          },
      { name: 'Milwaukee',  img: 'assets/suppliers/milwaukee.png',   url: 'https://www.milwaukeetool.eu/se',           category: 'Elverktyg'                 },
      { name: 'Bosch',      img: 'assets/suppliers/bosch.svg',       url: 'https://www.bosch-professional.com/se/',   category: 'Elverktyg'                 },
      { name: 'Kemppi',     img: 'assets/suppliers/kemppi.svg',      url: 'https://www.kemppi.com/sv-SE/',             category: 'Svetsutrustning'           },
      { name: 'AGA',        img: 'assets/suppliers/aga.svg',         url: 'https://www.agagas.se/',                    category: 'Industrigas'               },
      { name: 'Loctite',    img: 'assets/suppliers/loctite.svg',     url: 'https://www.loctite.se/',                   category: 'Kem & Lim'                 },
      { name: 'Hultafors',  img: 'assets/suppliers/hultafors.svg',   url: 'https://www.hultafors.com/se/',             category: 'Handverktyg'               },
      { name: 'Ejendals',   img: 'assets/suppliers/ejendals.svg',    url: 'https://www.ejendals.com/se/',              category: 'Skyddsutrustning'          },
      { name: 'Teng Tools', img: 'assets/suppliers/tengtools.png',   url: 'https://www.tengtools.com/se/',             category: 'Handverktyg'               },
      { name: 'Metabo',     img: 'assets/suppliers/metabo.png',      url: 'https://www.metabo.com/se/',                category: 'Elverktyg'                 },
      { name: 'Tyrolit',    img: 'assets/suppliers/tyrolit.png',     url: 'https://www.tyrolit.com/se/',               category: 'Slipverktyg'               },
      { name: 'CRC',        img: 'assets/suppliers/crc.svg',         url: 'https://www.crcind.com/',                   category: 'Teknisk Spray & Kem'       },
      { name: 'HiKOKI',    img: 'assets/suppliers/hikoki.svg',      url: 'https://www.hikoki-powertools.se/',         category: 'Elverktyg'                 },
      { name: 'Kärcher',    img: 'assets/suppliers/karcher.svg',     url: 'https://www.karcher.com/se/',               category: 'Rengöringsutrustning'      },
      { name: 'Dormer',     img: 'assets/suppliers/dormer.svg',      url: 'https://www.dormerpramet.com/sv-SE/',       category: 'Skärande Verktyg'          },
      { name: 'ISCAR',      img: 'assets/suppliers/iscar.svg',       url: 'https://www.iscar.com/',                    category: 'Skärande Verktyg'          },
      { name: 'Guide',      img: 'assets/suppliers/guide.svg',       url: 'https://www.guidegloves.se/',               category: 'Skyddshandskar'            },
      { name: 'Arbesko',    img: 'assets/suppliers/arbesko.svg',     url: 'https://www.arbesko.se/',                   category: 'Skyddsskor'                },
      { name: 'Mareld',     img: 'assets/suppliers/mareld.svg',      url: 'https://www.mareld.se/',                    category: 'Belysning'                 },
      { name: 'Stanley',    img: 'assets/suppliers/stanley.svg',     url: 'https://www.stanleytools.se/',              category: 'Handverktyg'               },
      { name: 'Habe',       img: 'assets/suppliers/habe.png',        url: null,                                        category: 'Tekniska Produkter'        },
      { name: 'Fischer',    img: 'assets/suppliers/fischer.svg',     url: 'https://www.fischer.se/',                   category: 'Infästning'                },
      { name: 'Fiskars',    img: 'assets/suppliers/fiskars.png',     url: 'https://www.fiskars.se/',                   category: 'Handverktyg'               },
      { name: 'Sievi',      img: 'assets/suppliers/sievi.svg',       url: 'https://www.sievi.com/se/',                 category: 'Skyddsskor'                },
      { name: 'Portwest',   img: 'assets/suppliers/portwest.png',    url: 'https://www.portwest.com/se/',              category: 'Skyddskläder'              },
      { name: 'Cederroth',  img: 'assets/suppliers/cederroth.svg',   url: 'https://www.cederroth.se/',                 category: 'Första Hjälpen & Kem'      },
    ];

    supplierDirEl.innerHTML = suppliers.map(s => {
      const Tag = s.url ? 'a' : 'div';
      const attrs = s.url ? `href="${s.url}" target="_blank" rel="noreferrer"` : '';
      const categoryText = s.category.toLowerCase();
      const filterCategory = /svets|gas/.test(categoryText) ? 'svets' : /skydd|sko|kläd|hjälp/.test(categoryText) ? 'skydd' : /kem|lim|spray/.test(categoryText) ? 'kem' : /lager|tekniska/.test(categoryText) ? 'industri' : 'verktyg';
      return `<${Tag} class="supplier-directory-card brand-tile" data-name="${s.name.toLowerCase()}" data-category="${filterCategory}" ${attrs}>
      <div class="directory-logo"><img src="${s.img}" alt="${s.name}" loading="lazy"></div>
      <h3>${s.name}</h3>
      <span>${s.category}</span>
    </${Tag}>`;
    }).join('');
  }

}); // end DOMContentLoaded
