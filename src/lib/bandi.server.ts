// Server-only news aggregator for the "Bandi & Opportunità" newsletter.
// `.server.ts` keeps it out of the client bundle. It pulls fresh items from
// Google News RSS (no auth, updated continuously) with one query per channel,
// so the feed is genuinely refreshed day by day. Uses only fetch + string
// parsing, so it runs on every target (Node / Cloudflare Workers / edge).
//
// To use the official institutional feeds instead, swap each `query` for a
// `url` pointing at the relevant RSS/Atom endpoint — parseFeed() handles both.

export type BandiCategory = "Regionale" | "Nazionale" | "Europeo" | "Fiscale";

export type BandoNewsItem = {
  id: string;
  title: string;
  link: string;
  source: string;
  channel: string;
  category: BandiCategory;
  date: string | null; // ISO
  snippet: string;
};

export type BandiNews = {
  items: BandoNewsItem[];
  updatedAt: string; // ISO
};

type Channel = {
  name: string;
  category: BandiCategory;
  query: string;
};

const CHANNELS: Channel[] = [
  {
    name: "FESR — Bandi regionali",
    category: "Regionale",
    query: "FESR bando regione finanziamento imprese",
  },
  {
    name: "MIMIT",
    category: "Nazionale",
    query: "MIMIT bando agevolazioni imprese contratti di sviluppo",
  },
  { name: "MASE", category: "Nazionale", query: "MASE bando transizione energetica sostenibilità" },
  { name: "MUR", category: "Nazionale", query: "MUR bando PNRR PRIN ricerca" },
  {
    name: "Invitalia & SIMEST",
    category: "Nazionale",
    query: "Invitalia SIMEST bando impresa internazionalizzazione",
  },
  {
    name: "Horizon Europe & EIC",
    category: "Europeo",
    query: "Horizon Europe EIC bando finanziamento ricerca",
  },
  {
    name: "Credito d'Imposta R&S&I",
    category: "Fiscale",
    query: "credito imposta ricerca sviluppo innovazione CIRI",
  },
  {
    name: "Incentivi Investimenti & Energia",
    category: "Fiscale",
    query: "credito imposta beni strumentali investimenti transizione energetica imprese",
  },
];

// Curated fallback shown when no feed responds, so the page is never empty.
const FALLBACK: Array<Omit<BandoNewsItem, "id" | "date"> & { date: string | null }> = [
  {
    title:
      "Fondo Europeo di Sviluppo Regionale (FESR): bandi per investimenti, R&S e digitalizzazione",
    link: "https://ec.europa.eu/regional_policy/funding/erdf_it.html",
    source: "Commissione Europea",
    channel: "FESR — Bandi regionali",
    category: "Regionale",
    date: null,
    snippet:
      "Agevolazioni regionali per investimenti produttivi, ricerca, digitalizzazione e sostenibilità.",
  },
  {
    title: "MIMIT: agevolazioni per imprese, contratti di sviluppo e fondi per l'innovazione",
    link: "https://www.mimit.gov.it/it/incentivi",
    source: "MIMIT",
    channel: "MIMIT",
    category: "Nazionale",
    date: null,
    snippet:
      "Incentivi nazionali per imprese, contratti di sviluppo e progetti di innovazione tecnologica.",
  },
  {
    title: "MASE: strumenti per la transizione energetica e la sostenibilità",
    link: "https://www.mase.gov.it/",
    source: "MASE",
    channel: "MASE",
    category: "Nazionale",
    date: null,
    snippet: "Bandi e strumenti a supporto della transizione energetica e dei progetti ambientali.",
  },
  {
    title: "MUR: bandi PNRR, PRIN e finanziamenti per la ricerca applicata",
    link: "https://www.mur.gov.it/it/aree-tematiche/ricerca",
    source: "MUR",
    channel: "MUR",
    category: "Nazionale",
    date: null,
    snippet: "Finanziamenti per la ricerca, progetti PRIN e misure nell'ambito del PNRR.",
  },
  {
    title: "Invitalia & SIMEST: nuove imprese, M&A e internazionalizzazione",
    link: "https://www.invitalia.it/",
    source: "Invitalia",
    channel: "Invitalia & SIMEST",
    category: "Nazionale",
    date: null,
    snippet: "Strumenti per la nascita di nuove imprese, operazioni straordinarie ed export.",
  },
  {
    title: "Horizon Europe & EIC: programmi quadro per ricerca e innovazione",
    link: "https://ec.europa.eu/info/funding-tenders/opportunities/portal/screen/home",
    source: "Commissione Europea",
    channel: "Horizon Europe & EIC",
    category: "Europeo",
    date: null,
    snippet:
      "Bandi europei per ricerca, sviluppo e innovazione, incluso lo European Innovation Council.",
  },
  {
    title: "Credito d'Imposta R&S&I (CIRI) con certificazione",
    link: "https://www.mimit.gov.it/it/incentivi/credito-dimposta-ricerca-sviluppo-e-innovazione",
    source: "MIMIT",
    channel: "Credito d'Imposta R&S&I",
    category: "Fiscale",
    date: null,
    snippet: "Credito d'imposta per ricerca, sviluppo e innovazione tecnologica con asseverazione.",
  },
  {
    title: "Incentivi per investimenti tecnologici e transizione digitale ed energetica",
    link: "https://www.mimit.gov.it/it/incentivi",
    source: "MIMIT",
    channel: "Incentivi Investimenti & Energia",
    category: "Fiscale",
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

async function fetchChannel(ch: Channel, perChannel: number): Promise<BandoNewsItem[]> {
  try {
    const res = await fetch(googleNewsUrl(ch.query), {
      headers: { "User-Agent": "Mozilla/5.0 (AGJCONFIN news fetcher)" },
    });
    if (!res.ok) return [];
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
      };
    });
  } catch {
    return [];
  }
}

// Tiny in-memory cache (per server isolate). TTL keeps Google News happy and
// makes repeat page loads instant; it still refreshes well within a day.
const TTL_MS = 1000 * 60 * 60 * 2; // 2h
let cache: { at: number; data: BandiNews } | null = null;

export async function getBandiNewsData(): Promise<BandiNews> {
  if (cache && Date.now() - cache.at < TTL_MS) return cache.data;

  const results = await Promise.allSettled(CHANNELS.map((ch) => fetchChannel(ch, 4)));
  let items: BandoNewsItem[] = [];
  for (const r of results) if (r.status === "fulfilled") items = items.concat(r.value);

  // De-duplicate by link, then sort newest first (undated last).
  const seen = new Set<string>();
  items = items.filter((it) => (seen.has(it.link) ? false : (seen.add(it.link), true)));
  items.sort((a, b) => {
    if (a.date && b.date) return b.date.localeCompare(a.date);
    if (a.date) return -1;
    if (b.date) return 1;
    return 0;
  });
  items = items.slice(0, 24);

  if (items.length === 0) {
    items = FALLBACK.map((f, i) => ({ ...f, id: `fallback-${i}` }));
  }

  const data: BandiNews = { items, updatedAt: new Date().toISOString() };
  cache = { at: Date.now(), data };
  return data;
}
