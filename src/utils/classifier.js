// Conspiracy classification engine -- ported from server-side to run in-browser.
// Takes raw NYC 311 complaints and scores them for anomalous content.

export const CATEGORY_CONFIG = [
  {
    name: "PARANORMAL",
    keywords: [
      "ghost", "haunted", "spirit", "demon", "apparition", "shadow figure",
      "unknown presence", "creepy figure", "specter",
    ],
    aliases: [
      "mysterious shadow", "unexplained presence", "ghostly",
      "haunted building", "odd presence",
    ],
    color: "#9d4edd",
  },
  {
    name: "SURVEILLANCE",
    keywords: [
      "camera", "watching", "spying", "surveillance", "listening",
      "monitoring", "spy", "mind control", "government", "signals", "frequencies",
    ],
    aliases: [
      "recorder", "sensor", "street light", "pole equipment",
      "hidden camera", "watching us", "under surveillance",
    ],
    color: "#00ff88",
  },
  {
    name: "ALIEN ACTIVITY",
    keywords: [
      "ufo", "unidentified lights", "spacecraft", "alien", "portal",
      "unknown lights", "mysterious lights", "sky object",
    ],
    aliases: [
      "bright light", "flashing light", "hovering", "flying saucer", "beam of light",
    ],
    color: "#3a86ff",
  },
  {
    name: "UNDERGROUND",
    keywords: [
      "tunnels", "underground", "subway creature", "creature", "monster",
      "lurking", "humming", "buzzing", "vibrations", "subway noises",
    ],
    aliases: [
      "subway", "manhole", "basement", "sewer", "street cave",
      "construction vibration", "underground noise", "secret tunnel",
    ],
    color: "#b6461b",
  },
  {
    name: "GOV EXPERIMENT",
    keywords: [
      "chemical smell", "radiation", "frequencies", "testing", "experiment",
      "mind control", "government", "paranoia",
    ],
    aliases: [
      "air quality", "odor", "fumes", "gas smell", "hazardous",
      "unknown substance", "secret experiment",
    ],
    color: "#c1121f",
  },
  {
    name: "CULT ACTIVITY",
    keywords: [
      "chanting", "ritual", "sacrifice", "cult", "ceremony", "occult", "worship",
    ],
    aliases: ["group gathering", "masked", "drumming", "black robes", "altar"],
    color: "#8b0000",
  },
  {
    name: "ANIMAL ANOMALY",
    keywords: [
      "pigeons", "rats", "mutant", "mutant birds", "rodent", "creature", "monster",
    ],
    aliases: ["animal", "pigeon", "swarm", "staring animals", "strange birds"],
    color: "#b8a98f",
  },
  {
    name: "NOISE PHENOMENA",
    keywords: [
      "humming", "buzzing", "screaming", "voices", "vibrations",
      "strange noises", "mysterious noise", "whispering",
    ],
    aliases: [
      "noise", "loud", "banging", "rattling", "engine sound",
      "low frequency", "rumbling",
    ],
    color: "#00d26a",
  },
  {
    name: "ODDITY",
    keywords: [
      "strange", "mysterious", "unexplained", "odd", "weird",
      "suspicious", "unknown", "creepy", "paranoia", "monster",
    ],
    aliases: [
      "odd smell", "strange feeling", "creepy feeling",
      "unexplained sensation", "unknown object", "weird behavior",
    ],
    color: "#ff8c00",
  },
];

const SUSPICIOUS_LANGUAGE = [
  { term: "unidentified", weight: 2.5 },
  { term: "strange", weight: 2.2 },
  { term: "mysterious", weight: 2.3 },
  { term: "unknown", weight: 2.2 },
  { term: "persistent", weight: 1.7 },
  { term: "recurring", weight: 1.8 },
  { term: "unmarked", weight: 2.3 },
  { term: "watching", weight: 2.4 },
  { term: "hovering", weight: 2.4 },
  { term: "sealed", weight: 1.7 },
  { term: "after hours", weight: 1.9 },
  { term: "rooftop", weight: 1.6 },
  { term: "basement", weight: 1.5 },
  { term: "vibrating", weight: 1.8 },
  { term: "paranoia", weight: 2.7 },
  { term: "creepy", weight: 2.4 },
  { term: "voices", weight: 2.5 },
  { term: "screaming", weight: 2.5 },
  { term: "shadow", weight: 2.3 },
  { term: "lurking", weight: 2.3 },
  { term: "experiment", weight: 2.2 },
  { term: "government", weight: 2.2 },
  { term: "signals", weight: 2.1 },
  { term: "frequencies", weight: 2.3 },
  { term: "portal", weight: 2.3 },
];

const RARE_KEYWORD_WEIGHTS = {
  apparition: 3.2, demon: 3.4, ufo: 3.7, spacecraft: 3.5, alien: 3.5,
  radiation: 3.4, sacrifice: 3.6, cult: 3.3, ritual: 3.1,
  "mutant birds": 3.4, "staring animals": 3.1, frequencies: 2.9,
  "chemical smell": 2.9, "unidentified lights": 3.3, "shadow figure": 3.2,
  tunnels: 2.8, underground: 2.5, vibrations: 2.4, humming: 2.3,
  buzzing: 2.1, pigeons: 2.3, rats: 2.2, watching: 2.2, camera: 1.8,
  "mind control": 3.4, portal: 3.2, "unknown presence": 3.1,
  "mysterious lights": 3.1, monster: 3.0, experiment: 3.2, government: 2.5,
  surveillance: 2.4, "strange noises": 2.1, "mysterious noise": 2.2,
};

const GENERIC_PATTERNS = [
  "pothole", "trash pickup", "garbage", "dumping", "parking",
  "blocked driveway", "street condition", "sanitation", "sidewalk",
  "graffiti", "snow removal", "water leak", "heat/hot water",
  "elevator", "loud music", "car alarm", "construction noise",
  "traffic noise", "street light out", "broken hydrant", "dumpster", "rodent bait",
];

function normalize(value = "") {
  return String(value).toLowerCase().replace(/[^a-z0-9\s-]/g, " ").replace(/\s+/g, " ").trim();
}

function getWords(text) {
  return text.split(" ").filter(Boolean);
}

function stableNoise(uniqueKey = "") {
  return String(uniqueKey).split("").reduce((sum, char) => sum + char.charCodeAt(0), 0) % 9;
}

function termMatches(text, words, term) {
  const n = normalize(term);
  if (!n) return false;
  if (n.includes(" ")) return text.includes(n);
  return words.some((w) => {
    if (w === n) return true;
    if (n.length >= 5 && w.startsWith(n)) return true;
    if (w.length >= 6 && n.startsWith(w)) return true;
    return false;
  });
}

function keywordRarity(term) {
  return RARE_KEYWORD_WEIGHTS[normalize(term)] || 1.25;
}

function scoreCategory(category, text, words) {
  const keywordHits = category.keywords
    .filter((kw) => termMatches(text, words, kw))
    .map((kw) => ({ keyword: kw, direct: true, weight: keywordRarity(kw) }));

  const aliasHits = category.aliases
    .filter((a) => termMatches(text, words, a))
    .map((a) => ({ keyword: a, direct: false, weight: keywordRarity(a) * 0.48 }));

  const hits = [...keywordHits, ...aliasHits];
  return {
    ...category,
    matchedKeywords: hits.map((h) => h.keyword),
    directHitCount: keywordHits.length,
    score: hits.reduce((t, h) => t + h.weight, 0),
  };
}

export function classifyComplaint(complaint) {
  const complaintType = normalize(complaint.complaint_type || "");
  const descriptor = normalize(complaint.descriptor || "");
  const text = normalize(`${complaintType} ${descriptor}`);
  const words = getWords(text);

  const matches = CATEGORY_CONFIG
    .map((cat) => scoreCategory(cat, text, words))
    .filter((c) => c.score > 0 && (c.directHitCount > 0 || c.score >= 0.55))
    .sort((a, b) => b.score - a.score);

  if (!matches.length) return null;

  const isGeneric = GENERIC_PATTERNS.some((p) => text.includes(normalize(p)));
  const matchedKeywords = [...new Set(matches.flatMap((c) => c.matchedKeywords))];
  const suspiciousScore = SUSPICIOUS_LANGUAGE
    .filter(({ term }) => termMatches(text, words, term))
    .reduce((t, { weight }) => t + weight, 0);
  const strongSuspicious = matches.some((c) => c.directHitCount > 0 && c.score >= 3);

  if (isGeneric && !strongSuspicious && matchedKeywords.length < 2 && suspiciousScore < 2.5) {
    return null;
  }

  const categories = matches.map((c) => c.name);
  const overlapBonus = Math.max(0, categories.length - 1) * 11;
  const keywordDensity = Math.min(matchedKeywords.length / Math.max(words.length, 1), 0.22);
  const detailBonus = Math.min(Math.floor(text.length / 28), 12);
  const catStrength = matches.reduce((t, c) => t + c.score, 0);
  const emotionalIntensity = Math.min(suspiciousScore * 4, 18);
  const hasCoords = complaint.latitude && complaint.longitude;

  const rawScore =
    18 + catStrength * 7 + matchedKeywords.length * 4 + overlapBonus +
    emotionalIntensity + keywordDensity * 40 + detailBonus +
    (hasCoords ? 5 : 0) + stableNoise(complaint.unique_key);

  return {
    conspiracy_category: matches[0].name,
    conspiracy_categories: categories,
    conspiracy_score: Math.max(1, Math.min(100, Math.round(rawScore))),
    matched_keywords: matchedKeywords,
  };
}

export function getCategoryNames() {
  return CATEGORY_CONFIG.map((c) => c.name);
}
