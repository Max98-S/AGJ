// Server-only news aggregator for the "Bandi & Opportunità" newsletter.
// `.server.ts` keeps it out of the client bundle. Uses only fetch + string
// parsing, so it runs on every target (Node / Cloudflare Workers / edge).
//
// COME FUNZIONA
// Il registro SOURCES qui sotto contiene le fonti istituzionali monitorate
// (portali nazionali, ministeri, enti, portali UE, tutte le Regioni, le
// finanziarie regionali, camere di commercio, energia, agricoltura, export,
// terzo settore, fiscalità). Da quel registro vengono generate automaticamente
// le query di monitoraggio: i nomi delle fonti di ogni area vengono messi in OR
// e combinati con le parole chiave dei bandi, così ogni giorno le nuove
// pubblicazioni di QUELLE fonti finiscono nel feed "Bandi & incentivi".
//
// Per aggiungere/togliere una fonte basta modificare SOURCES: query, filtri e
// conteggi in pagina si aggiornano da soli.
//
// Gli elementi il cui link proviene dal dominio di una fonte monitorata sono
// marcati `official: true` e mostrati per primi a parità di data.
//
// Per agganciare il feed RSS/Atom ufficiale di un ente, aggiungi `feed: "<url>"`
// alla sua voce in SOURCES: viene letto direttamente, senza passare da Google News.

export type BandiCategory =
  | "Regioni"
  | "Ministeri"
  | "Europa"
  | "Fiscalità"
  | "Enti"
  | "Finanziarie"
  | "Energia"
  | "Startup"
  | "Agricoltura"
  | "Export"
  | "Camere"
  | "Terzo settore"
  | "Portali";

export type BandoNewsItem = {
  id: string;
  title: string;
  link: string;
  source: string;
  channel: string;
  category: BandiCategory;
  date: string | null; // ISO
  snippet: string;
  official?: boolean; // il link arriva da un dominio monitorato
};

export type BandiNews = {
  items: BandoNewsItem[];
  updatedAt: string; // ISO
};

/** Una fonte istituzionale monitorata. */
type Source = {
  name: string;
  domain: string;
  category: BandiCategory;
  /** Feed RSS/Atom ufficiale, se disponibile: ha priorità su Google News. */
  feed?: string;
};

// ---------------------------------------------------------------------------
// REGISTRO FONTI — le fonti istituzionali monitorate ogni giorno.
// ---------------------------------------------------------------------------
export const SOURCES: Source[] = [
  // — Portali nazionali —
  { name: "Incentivi.gov", domain: "incentivi.gov.it", category: "Portali" },
  { name: "Governo Italiano", domain: "governo.it", category: "Portali" },
  { name: "Gazzetta Ufficiale", domain: "gazzettaufficiale.it", category: "Portali" },
  { name: "Normattiva", domain: "normattiva.it", category: "Portali" },

  // — Ministeri —
  { name: "MIMIT", domain: "mimit.gov.it", category: "Ministeri" },
  { name: "MASE", domain: "mase.gov.it", category: "Ministeri" },
  { name: "MASAF", domain: "masaf.gov.it", category: "Ministeri" },
  { name: "MUR", domain: "mur.gov.it", category: "Ministeri" },

  // — Enti nazionali —
  { name: "Invitalia", domain: "invitalia.it", category: "Enti" },
  { name: "CNR", domain: "cnr.it", category: "Enti" },

  // — Bandi europei —
  { name: "Funding & Tenders Portal", domain: "ec.europa.eu", category: "Europa" },
  { name: "Commissione Europea", domain: "commission.europa.eu", category: "Europa" },
  { name: "Enterprise Europe Network", domain: "een.ec.europa.eu", category: "Europa" },
  { name: "European Innovation Council", domain: "eic.ec.europa.eu", category: "Europa" },
  { name: "CINEA", domain: "cinea.ec.europa.eu", category: "Europa" },
  { name: "Horizon Europe", domain: "research-and-innovation.ec.europa.eu", category: "Europa" },
  { name: "LIFE Programme", domain: "cinea.ec.europa.eu", category: "Europa" },
  { name: "Interreg", domain: "interreg.eu", category: "Europa" },
  { name: "Creative Europe", domain: "culture.ec.europa.eu", category: "Europa" },
  { name: "Digital Europe", domain: "digital-strategy.ec.europa.eu", category: "Europa" },
  { name: "CEF", domain: "cinea.ec.europa.eu", category: "Europa" },

  // — Regioni —
  { name: "Regione Abruzzo", domain: "regione.abruzzo.it", category: "Regioni" },
  { name: "Regione Basilicata", domain: "regione.basilicata.it", category: "Regioni" },
  { name: "Regione Calabria", domain: "regione.calabria.it", category: "Regioni" },
  { name: "Regione Campania", domain: "regione.campania.it", category: "Regioni" },
  { name: "Regione Emilia-Romagna", domain: "regione.emilia-romagna.it", category: "Regioni" },
  { name: "Regione Friuli Venezia Giulia", domain: "regione.fvg.it", category: "Regioni" },
  { name: "Regione Lazio", domain: "regione.lazio.it", category: "Regioni" },
  { name: "Regione Liguria", domain: "regione.liguria.it", category: "Regioni" },
  { name: "Regione Lombardia", domain: "regione.lombardia.it", category: "Regioni" },
  { name: "Regione Marche", domain: "regione.marche.it", category: "Regioni" },
  { name: "Regione Molise", domain: "regione.molise.it", category: "Regioni" },
  { name: "Regione Piemonte", domain: "regione.piemonte.it", category: "Regioni" },
  { name: "Regione Puglia", domain: "regione.puglia.it", category: "Regioni" },
  { name: "Regione Sardegna", domain: "regione.sardegna.it", category: "Regioni" },
  { name: "Regione Sicilia", domain: "regione.sicilia.it", category: "Regioni" },
  { name: "Regione Toscana", domain: "regione.toscana.it", category: "Regioni" },
  { name: "Regione Trentino Alto Adige", domain: "regione.taa.it", category: "Regioni" },
  { name: "Regione Umbria", domain: "regione.umbria.it", category: "Regioni" },
  { name: "Regione Valle d'Aosta", domain: "regione.vda.it", category: "Regioni" },
  { name: "Regione Veneto", domain: "regione.veneto.it", category: "Regioni" },

  // — Finanziarie regionali —
  { name: "Finlombarda", domain: "finlombarda.it", category: "Finanziarie" },
  { name: "Finpiemonte", domain: "finpiemonte.it", category: "Finanziarie" },
  { name: "Veneto Innovazione", domain: "venetoinnovazione.it", category: "Finanziarie" },
  { name: "ART-ER", domain: "art-er.it", category: "Finanziarie" },
  { name: "Sviluppo Toscana", domain: "sviluppo.toscana.it", category: "Finanziarie" },
  { name: "Lazio Innova", domain: "lazioinnova.it", category: "Finanziarie" },
  { name: "Sviluppo Campania", domain: "sviluppocampania.it", category: "Finanziarie" },
  { name: "Puglia Sviluppo", domain: "pugliasviluppo.eu", category: "Finanziarie" },
  { name: "Sardegna Ricerche", domain: "sardegnaricerche.it", category: "Finanziarie" },
  { name: "IRFIS", domain: "irfis.it", category: "Finanziarie" },
  { name: "CRIAS", domain: "crias.it", category: "Finanziarie" },
  { name: "IRCAC", domain: "ircac.it", category: "Finanziarie" },
  { name: "FIRA Abruzzo", domain: "fira.it", category: "Finanziarie" },
  { name: "SVEM Marche", domain: "svem.marche.it", category: "Finanziarie" },
  { name: "Sviluppumbria", domain: "sviluppumbria.it", category: "Finanziarie" },
  { name: "Finmolise", domain: "finmolise.it", category: "Finanziarie" },
  { name: "Sviluppo Basilicata", domain: "sviluppobasilicata.it", category: "Finanziarie" },
  { name: "Fincalabra", domain: "fincalabra.it", category: "Finanziarie" },
  { name: "Friulia", domain: "friulia.it", category: "Finanziarie" },
  { name: "FILSE Liguria", domain: "filse.it", category: "Finanziarie" },

  // — Camere di commercio —
  { name: "Unioncamere", domain: "unioncamere.gov.it", category: "Camere" },
  { name: "Portale Agevolazioni", domain: "portaleagevolazioni.eu", category: "Camere" },

  // — Startup & innovazione —
  { name: "CDP Venture Capital", domain: "cdpventurecapital.it", category: "Startup" },
  { name: "Startup Italia", domain: "startupitalia.eu", category: "Startup" },
  { name: "Italian Tech Alliance", domain: "italiantechalliance.com", category: "Startup" },

  // — Energia —
  { name: "GSE", domain: "gse.it", category: "Energia" },
  { name: "ENEA", domain: "enea.it", category: "Energia" },
  { name: "ARERA", domain: "arera.it", category: "Energia" },

  // — Agricoltura —
  { name: "ISMEA", domain: "ismea.it", category: "Agricoltura" },
  { name: "AGEA", domain: "agea.gov.it", category: "Agricoltura" },

  // — Export —
  { name: "SIMEST", domain: "simest.it", category: "Export" },
  { name: "ICE Agenzia", domain: "ice.it", category: "Export" },

  // — Terzo settore —
  { name: "Ministero del Lavoro", domain: "lavoro.gov.it", category: "Terzo settore" },
  { name: "CSVnet", domain: "csvnet.it", category: "Terzo settore" },
  { name: "Fondazione CON IL SUD", domain: "fondazioneconilsud.it", category: "Terzo settore" },

  // — Fiscalità & crediti d'imposta —
  { name: "Agenzia delle Entrate", domain: "agenziaentrate.gov.it", category: "Fiscalità" },
  { name: "MEF", domain: "mef.gov.it", category: "Fiscalità" },
  { name: "Dipartimento Finanze", domain: "finanze.gov.it", category: "Fiscalità" },
];

/** Parole chiave aggiunte alla query di ogni area, per restare sui bandi. */
const CATEGORY_KEYWORDS: Record<BandiCategory, string> = {
  Regioni: "bando OR avviso OR contributo OR FESR OR agevolazioni",
  Ministeri: "bando OR decreto OR incentivo OR agevolazioni imprese",
  Europa: "call OR bando OR funding OR finanziamento",
  Fiscalità: '"credito d\'imposta" OR agevolazione OR detrazione OR incentivo',
  Enti: "bando OR avviso OR incentivo OR contributo imprese",
  Finanziarie: "bando OR avviso OR contributo OR finanziamento imprese",
  Energia: "incentivo OR bando OR \"comunità energetiche\" OR efficienza energetica",
  Startup: "bando OR investimento OR incentivo startup innovative",
  Agricoltura: "bando OR PSR OR contributo OR giovani agricoltori",
  Export: "bando OR finanziamento OR internazionalizzazione OR export",
  Camere: "voucher OR bando OR contributo digitale imprese",
  "Terzo settore": "bando OR contributi OR avviso enti terzo settore",
  Portali: "bando OR incentivo OR agevolazioni OR decreto imprese",
};

/** Nome leggibile del canale mostrato nelle card. */
const CHANNEL_LABEL: Record<BandiCategory, string> = {
  Regioni: "Regioni & FESR",
  Ministeri: "Ministeri",
  Europa: "Bandi europei",
  Fiscalità: "Crediti d'imposta & fisco",
  Enti: "Enti nazionali",
  Finanziarie: "Finanziarie regionali",
  Energia: "Energia",
  Startup: "Startup & innovazione",
  Agricoltura: "Agricoltura",
  Export: "Export",
  Camere: "Camere di commercio",
  "Terzo settore": "Terzo settore",
  Portali: "Portali nazionali",
};

type Channel = {
  name: string;
  category: BandiCategory;
  query?: string;
  url?: string;
};

/** Spezza un array in blocchi di dimensione `size`. */
function chunk<T>(arr: T[], size: number): T[][] {
  const out: T[][] = [];
  for (let i = 0; i < arr.length; i += size) out.push(arr.slice(i, i + size));
  return out;
}

/**
 * Costruisce i canali di monitoraggio A PARTIRE dal registro SOURCES.
 * Le fonti di ogni area vengono messe in OR (a blocchi, per non creare query
 * troppo lunghe) e combinate con le parole chiave dell'area.
 */
function buildChannels(): Channel[] {
  const channels: Channel[] = [];

  // 1) Fonti con feed RSS/Atom ufficiale: lette direttamente.
  for (const s of SOURCES) {
    if (s.feed) channels.push({ name: s.name, category: s.category, url: s.feed });
  }

  // 2) Tutte le altre: query per area, a blocchi di 8 fonti.
  const byCategory = new Map<BandiCategory, Source[]>();
  for (const s of SOURCES) {
    if (s.feed) continue;
    const list = byCategory.get(s.category) ?? [];
    list.push(s);
    byCategory.set(s.category, list);
  }

  for (const [category, list] of byCategory) {
    const batches = chunk(list, 8);
    batches.forEach((batch, i) => {
      const names = batch.map((s) => `"${s.name}"`).join(" OR ");
      channels.push({
        name: CHANNEL_LABEL[category] + (batches.length > 1 ? ` ${i + 1}` : ""),
        category,
        query: `(${names}) (${CATEGORY_KEYWORDS[category]})`,
      });
    });
  }

  return channels;
}

const CHANNELS: Channel[] = buildChannels();

/** Domini monitorati → per marcare gli item che arrivano da fonte ufficiale. */
const MONITORED_DOMAINS = new Set(SOURCES.map((s) => s.domain));

function isOfficialLink(link: string): boolean {
  try {
    const host = new URL(link).hostname.replace(/^www\./, "");
    for (const d of MONITORED_DOMAINS) if (host === d || host.endsWith(`.${d}`)) return true;
    return false;
  } catch {
    return false;
  }
}

const FALLBACK: Array<Omit<BandoNewsItem, "id" | "date"> & { date: string | null }> = [
  {
    title:
      "Fondo Europeo di Sviluppo Regionale (FESR): bandi per investimenti, R&S e digitalizzazione",
    link: "https://ec.europa.eu/regional_policy/funding/erdf_it.html",
    source: "Commissione Europea",
    channel: "Regioni & FESR",
    category: "Regioni",
    date: null,
    snippet:
      "Agevolazioni regionali per investimenti produttivi, ricerca, digitalizzazione e sostenibilità.",
  },
  {
    title: "MIMIT: agevolazioni per imprese, contratti di sviluppo e fondi per l'innovazione",
    link: "https://www.mimit.gov.it/it/incentivi",
    source: "MIMIT",
    channel: "Ministeri",
    category: "Ministeri",
    date: null,
    snippet:
      "Incentivi nazionali per imprese, contratti di sviluppo e progetti di innovazione tecnologica.",
  },
  {
    title: "MASE & GSE: strumenti per la transizione energetica e le comunità energetiche",
    link: "https://www.mase.gov.it/",
    source: "MASE",
    channel: "Energia",
    category: "Energia",
    date: null,
    snippet: "Bandi e incentivi a supporto della transizione energetica e dei progetti ambientali.",
  },
  {
    title: "MUR: bandi PNRR, PRIN e finanziamenti per la ricerca applicata",
    link: "https://www.mur.gov.it/it/aree-tematiche/ricerca",
    source: "MUR",
    channel: "Ministeri",
    category: "Ministeri",
    date: null,
    snippet: "Finanziamenti per la ricerca, progetti PRIN e misure nell'ambito del PNRR.",
  },
  {
    title: "Invitalia & SIMEST: nuove imprese, M&A e internazionalizzazione",
    link: "https://www.invitalia.it/",
    source: "Invitalia",
    channel: "Enti nazionali",
    category: "Enti",
    date: null,
    snippet: "Strumenti per la nascita di nuove imprese, operazioni straordinarie ed export.",
  },
  {
    title: "Horizon Europe & EIC: programmi quadro per ricerca e innovazione",
    link: "https://ec.europa.eu/info/funding-tenders/opportunities/portal/screen/home",
    source: "Commissione Europea",
    channel: "Bandi europei",
    category: "Europa",
    date: null,
    snippet:
      "Bandi europei per ricerca, sviluppo e innovazione, incluso lo European Innovation Council.",
  },
  {
    title: "Credito d'Imposta R&S&I (CIRI) con certificazione",
    link: "https://www.mimit.gov.it/it/incentivi/credito-dimposta-ricerca-sviluppo-e-innovazione",
    source: "MIMIT",
    channel: "Crediti d'imposta & fisco",
    category: "Fiscalità",
    date: null,
    snippet: "Credito d'imposta per ricerca, sviluppo e innovazione tecnologica con asseverazione.",
  },
  {
    title: "Incentivi per investimenti tecnologici e transizione digitale ed energetica",
    link: "https://www.mimit.gov.it/it/incentivi",
    source: "MIMIT",
    channel: "Crediti d'imposta & fisco",
    category: "Fiscalità",
    date: null,
    snippet:
      "Agevolazioni per beni strumentali avanzati, digitalizzazione ed efficientamento energetico delle imprese.",
  },
];

function decode(s: string): string {
  return (
    s
      .replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, "$1")
      // decode entity-encoded markup first, so the tags below can be stripped
      .replace(/&lt;/g, "<")
      .replace(/&gt;/g, ">")
      .replace(/&nbsp;/g, " ")
      .replace(/&#(\d+);/g, (_, n) => String.fromCharCode(Number(n)))
      // strip any HTML tags
      .replace(/<[^>]+>/g, "")
      // remaining entities
      .replace(/&amp;/g, "&")
      .replace(/&quot;/g, '"')
      .replace(/&#39;|&apos;/g, "'")
      .replace(/\s+/g, " ")
      .trim()
  );
}

function pick(block: string, tag: string): string {
  const m = block.match(new RegExp(`<${tag}[^>]*>([\\s\\S]*?)</${tag}>`, "i"));
  return m ? m[1] : "";
}

/** Parse an RSS or Atom feed into raw items. */
function parseFeed(
  xml: string,
): Array<{ title: string; link: string; date: string | null; source: string; snippet: string }> {
  const out: Array<{
    title: string;
    link: string;
    date: string | null;
    source: string;
    snippet: string;
  }> = [];
  const isAtom = /<entry[\s>]/i.test(xml) && !/<item[\s>]/i.test(xml);
  const blocks = xml.match(isAtom ? /<entry[\s\S]*?<\/entry>/gi : /<item[\s\S]*?<\/item>/gi) || [];

  for (const b of blocks) {
    const title = decode(pick(b, "title"));
    let link = "";
    if (isAtom) {
      const lm = b.match(/<link[^>]*href="([^"]+)"[^>]*\/?>/i);
      link = lm ? lm[1] : "";
    } else {
      link = decode(pick(b, "link"));
    }
    const rawDate = pick(b, isAtom ? "updated" : "pubDate") || pick(b, "published");
    const d = rawDate ? new Date(decode(rawDate)) : null;
    const source = decode(pick(b, "source")) || "";
    const snippet = decode(pick(b, isAtom ? "summary" : "description")).slice(0, 220);
    if (title && link) {
      out.push({
        title,
        link,
        date: d && !isNaN(d.getTime()) ? d.toISOString() : null,
        source,
        snippet,
      });
    }
  }
  return out;
}


function googleNewsUrl(query: string): string {
  return `https://news.google.com/rss/search?q=${encodeURIComponent(query)}&hl=it&gl=IT&ceid=IT:it`;
}

/** fetch con timeout, così un feed lento non blocca l'intera pagina. */
async function fetchWithTimeout(url: string, ms = 8000): Promise<Response | null> {
  const ctrl = new AbortController();
  const t = setTimeout(() => ctrl.abort(), ms);
  try {
    return await fetch(url, {
      signal: ctrl.signal,
      headers: { "User-Agent": "Mozilla/5.0 (AGJCONFIN news fetcher)" },
    });
  } catch {
    return null;
  } finally {
    clearTimeout(t);
  }
}

async function fetchChannel(ch: Channel, perChannel: number): Promise<BandoNewsItem[]> {
  const url = ch.url ?? googleNewsUrl(ch.query ?? "");
  const res = await fetchWithTimeout(url);
  if (!res || !res.ok) return [];

  try {
    const xml = await res.text();
    const items = parseFeed(xml).slice(0, perChannel);
    return items.map((it, i) => {
      // Google News appends " - Source" to titles; split it out and drop it.
      let title = it.title;
      let source = it.source;
      const dash = title.lastIndexOf(" - ");
      if (dash > 20) {
        const tail = title.slice(dash + 3).trim();
        if (!source) source = tail;
        title = title.slice(0, dash).trim();
      }
      return {
        id: `${ch.name}-${i}-${it.link}`.slice(0, 200),
        title,
        link: it.link,
        source: source || ch.name,
        channel: ch.name,
        category: ch.category,
        date: it.date,
        snippet: it.snippet,
        official: isOfficialLink(it.link),
      };
    });
  } catch {
    return [];
  }
}

// Tiny in-memory cache (per server isolate). TTL keeps the sources happy and
// makes repeat page loads instant; it still refreshes well within a day.
const TTL_MS = 1000 * 60 * 60 * 2; // 2h
let cache: { at: number; data: BandiNews } | null = null;

export async function getBandiNewsData(): Promise<BandiNews> {
  if (cache && Date.now() - cache.at < TTL_MS) return cache.data;

  const results = await Promise.allSettled(CHANNELS.map((ch) => fetchChannel(ch, 4)));
  let items: BandoNewsItem[] = [];
  for (const r of results) if (r.status === "fulfilled") items = items.concat(r.value);

  // De-duplicate by link, then sort newest first (undated last).
  // A parità di giorno, le fonti ufficiali monitorate vengono prima.
  const seen = new Set<string>();
  items = items.filter((it) => (seen.has(it.link) ? false : (seen.add(it.link), true)));
  items.sort((a, b) => {
    if (a.date && b.date) {
      const dayA = a.date.slice(0, 10);
      const dayB = b.date.slice(0, 10);
      if (dayA !== dayB) return dayB.localeCompare(dayA);
      if (a.official !== b.official) return a.official ? -1 : 1;
      return b.date.localeCompare(a.date);
    }
    if (a.date) return -1;
    if (b.date) return 1;
    return 0;
  });
  items = items.slice(0, 48);

  if (items.length === 0) {
    items = FALLBACK.map((f, i) => ({ ...f, id: `fallback-${i}` }));
  }

  const data: BandiNews = { items, updatedAt: new Date().toISOString() };
  cache = { at: Date.now(), data };
  return data;
}
