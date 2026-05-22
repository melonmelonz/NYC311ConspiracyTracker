export const CATEGORY_CONFIG = [
  {
    name: "PARANORMAL",
    keywords: [
      "ghost",
      "haunted",
      "spirit",
      "demon",
      "apparition",
      "shadow figure",
      "unknown presence",
      "creepy figure",
      "specter",
    ],
    aliases: [
      "mysterious shadow",
      "unexplained presence",
      "ghostly",
      "haunted building",
      "odd presence",
    ],
    color: "#9d4edd",
  },
  {
    name: "SURVEILLANCE",
    keywords: [
      "camera",
      "watching",
      "spying",
      "surveillance",
      "listening",
      "monitoring",
      "spy",
      "mind control",
      "government",
      "signals",
      "frequencies",
    ],
    aliases: [
      "recorder",
      "sensor",
      "street light",
      "pole equipment",
      "hidden camera",
      "watching us",
      "under surveillance",
    ],
    color: "#00ff88",
  },
  {
    name: "ALIEN ACTIVITY",
    keywords: [
      "ufo",
      "unidentified lights",
      "spacecraft",
      "alien",
      "portal",
      "unknown lights",
      "mysterious lights",
      "sky object",
    ],
    aliases: [
      "bright light",
      "flashing light",
      "hovering",
      "flying saucer",
      "beam of light",
    ],
    color: "#3a86ff",
  },
  {
    name: "UNDERGROUND CONSPIRACY",
    keywords: [
      "tunnels",
      "underground",
      "subway creature",
      "creature",
      "monster",
      "lurking",
      "humming",
      "buzzing",
      "vibrations",
      "subway noises",
    ],
    aliases: [
      "subway",
      "manhole",
      "basement",
      "sewer",
      "street cave",
      "construction vibration",
      "underground noise",
      "secret tunnel",
    ],
    color: "#b6461b",
  },
  {
    name: "GOVERNMENT EXPERIMENT",
    keywords: [
      "chemical smell",
      "radiation",
      "frequencies",
      "testing",
      "experiment",
      "mind control",
      "government",
      "paranoia",
    ],
    aliases: [
      "air quality",
      "odor",
      "fumes",
      "gas smell",
      "hazardous",
      "unknown substance",
      "secret experiment",
    ],
    color: "#c1121f",
  },
  {
    name: "CULT ACTIVITY",
    keywords: [
      "chanting",
      "ritual",
      "sacrifice",
      "cult",
      "ceremony",
      "occult",
      "worship",
    ],
    aliases: ["group gathering", "masked", "drumming", "black robes", "altar"],
    color: "#8b0000",
  },
  {
    name: "ANIMAL CONSPIRACY",
    keywords: [
      "pigeons",
      "rats",
      "mutant",
      "mutant birds",
      "rodent",
      "creature",
      "monster",
    ],
    aliases: ["animal", "pigeon", "swarm", "staring animals", "strange birds"],
    color: "#b8a98f",
  },
  {
    name: "NOISE PHENOMENA",
    keywords: [
      "humming",
      "buzzing",
      "screaming",
      "voices",
      "vibrations",
      "strange noises",
      "mysterious noise",
      "whispering",
    ],
    aliases: [
      "noise",
      "loud",
      "banging",
      "rattling",
      "engine sound",
      "low frequency",
      "rumbling",
    ],
    color: "#00d26a",
  },
  {
    name: "ODDITY",
    keywords: [
      "strange",
      "mysterious",
      "unexplained",
      "odd",
      "weird",
      "suspicious",
      "unknown",
      "creepy",
      "paranoia",
      "monster",
    ],
    aliases: [
      "odd smell",
      "strange feeling",
      "creepy feeling",
      "unexplained sensation",
      "unknown object",
      "weird behavior",
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
  { term: "residents", weight: 1.2 },
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
  apparition: 3.2,
  demon: 3.4,
  ufo: 3.7,
  spacecraft: 3.5,
  alien: 3.5,
  radiation: 3.4,
  sacrifice: 3.6,
  cult: 3.3,
  ritual: 3.1,
  "mutant birds": 3.4,
  "staring animals": 3.1,
  frequencies: 2.9,
  "chemical smell": 2.9,
  "unidentified lights": 3.3,
  "shadow figure": 3.2,
  tunnels: 2.8,
  underground: 2.5,
  vibrations: 2.4,
  humming: 2.3,
  buzzing: 2.1,
  pigeons: 2.3,
  rats: 2.2,
  watching: 2.2,
  camera: 1.8,
  "mind control": 3.4,
  portal: 3.2,
  "unknown presence": 3.1,
  "mysterious lights": 3.1,
  monster: 3.0,
  experiment: 3.2,
  government: 2.5,
  surveillance: 2.4,
  "strange noises": 2.1,
  "mysterious noise": 2.2,
};

const GENERIC_REPORT_PATTERNS = [
  "pothole",
  "trash pickup",
  "garbage",
  "dumping",
  "parking",
  "blocked driveway",
  "street condition",
  "sanitation",
  "sidewalk",
  "graffiti",
  "snow removal",
  "water leak",
  "heat/hot water",
  "elevator",
  "loud music",
  "car alarm",
  "construction noise",
  "traffic noise",
  "street light out",
  "broken hydrant",
  "dumpster",
  "rodent bait",
];

function isGenericComplaint(text) {
  return GENERIC_REPORT_PATTERNS.some(
    (pattern) => normalize(pattern) && text.includes(normalize(pattern)),
  );
}

function normalize(value = "") {
  return String(value)
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function getWords(text) {
  return text.split(" ").filter(Boolean);
}

function stableNoise(uniqueKey = "") {
  // Deterministic variation keeps scores from looking artificial while ensuring
  // the same NYC report receives the same score on every refresh.
  return (
    String(uniqueKey)
      .split("")
      .reduce((sum, char) => sum + char.charCodeAt(0), 0) % 9
  );
}

function termMatches(text, words, term) {
  const normalizedTerm = normalize(term);

  if (!normalizedTerm) {
    return false;
  }

  if (normalizedTerm.includes(" ")) {
    return text.includes(normalizedTerm);
  }

  /*
    Partial matching:
    Single-word terms match exact words and sensible stems, so "camera" matches
    "cameras" and "vibration" matches "vibrations" without letting tiny terms
    accidentally match unrelated words.
  */
  return words.some((word) => {
    if (word === normalizedTerm) return true;
    if (normalizedTerm.length >= 5 && word.startsWith(normalizedTerm))
      return true;
    if (word.length >= 6 && normalizedTerm.startsWith(word)) return true;
    return false;
  });
}

function keywordRarity(term) {
  return RARE_KEYWORD_WEIGHTS[normalize(term)] || 1.25;
}

function scoreCategory(category, text, words) {
  const keywordHits = category.keywords
    .filter((keyword) => termMatches(text, words, keyword))
    .map((keyword) => ({
      keyword,
      direct: true,
      weight: keywordRarity(keyword),
    }));

  const aliasHits = category.aliases
    .filter((alias) => termMatches(text, words, alias))
    .map((alias) => ({
      keyword: alias,
      direct: false,
      weight: keywordRarity(alias) * 0.48,
    }));

  const hits = [...keywordHits, ...aliasHits];
  const directHitCount = keywordHits.length;
  const score = hits.reduce((total, hit) => total + hit.weight, 0);

  return {
    ...category,
    matchedKeywords: hits.map((hit) => hit.keyword),
    directHitCount,
    score,
  };
}

export function classifyComplaint(complaint) {
  const complaintType = normalize(complaint.complaint_type || "");
  const descriptor = normalize(complaint.descriptor || "");
  const complaintText = normalize(`${complaintType} ${descriptor}`);
  const words = getWords(complaintText);

  const categoryMatches = CATEGORY_CONFIG.map((category) =>
    scoreCategory(category, complaintText, words),
  )
    .filter(
      (category) =>
        category.score > 0 &&
        (category.directHitCount > 0 || category.score >= 0.55),
    )
    .sort((a, b) => b.score - a.score);

  /*
    Classification logic:
    Both complaint_type and descriptor are normalized to lowercase and inspected.
    A report may belong to multiple categories. For example, a complaint that
    mentions humming, underground, and vibrations will retain both
    UNDERGROUND CONSPIRACY and NOISE PHENOMENA instead of being forced into one
    bucket too early.
  */
  if (!categoryMatches.length) {
    return null;
  }

  const strongestMatch = categoryMatches[0];
  const conspiracyCategories = categoryMatches.map((category) => category.name);
  const categoryScores = Object.fromEntries(
    categoryMatches.map((category) => [
      category.name,
      Number(category.score.toFixed(2)),
    ]),
  );
  const matchedKeywords = [
    ...new Set(categoryMatches.flatMap((category) => category.matchedKeywords)),
  ];
  const suspiciousLanguageScore = SUSPICIOUS_LANGUAGE.filter(({ term }) =>
    termMatches(complaintText, words, term),
  ).reduce((total, { weight }) => total + weight, 0);
  const hasCoordinates = complaint.latitude && complaint.longitude;
  const isGeneric = isGenericComplaint(complaintText);
  const strongSuspicious = categoryMatches.some(
    (category) => category.directHitCount > 0 && category.score >= 3,
  );

  if (
    isGeneric &&
    !strongSuspicious &&
    matchedKeywords.length < 2 &&
    suspiciousLanguageScore < 2.5
  ) {
    return null;
  }

  const overlapBonus = Math.max(0, conspiracyCategories.length - 1) * 11;
  const keywordDensity = Math.min(
    matchedKeywords.length / Math.max(words.length, 1),
    0.22,
  );
  const descriptorDetailBonus = Math.min(
    Math.floor(complaintText.length / 28),
    12,
  );
  const categoryStrength = categoryMatches.reduce(
    (total, category) => total + category.score,
    0,
  );
  const emotionalIntensity = Math.min(suspiciousLanguageScore * 4, 18);

  /*
    Score logic:
    Scores reward rare and specific terms first, then category overlap,
    emotional or strange phrasing, keyword density, report detail, coordinates,
    and a small deterministic noise value. This pushes bizarre reports to the
    top and filters out ordinary city service noise.
  */
  const rawScore =
    18 +
    categoryStrength * 7 +
    matchedKeywords.length * 4 +
    overlapBonus +
    emotionalIntensity +
    keywordDensity * 40 +
    descriptorDetailBonus +
    (hasCoordinates ? 5 : 0) +
    stableNoise(complaint.unique_key);

  return {
    conspiracy_category: strongestMatch.name,
    conspiracy_categories: conspiracyCategories,
    conspiracy_score: Math.max(1, Math.min(100, Math.round(rawScore))),
    matched_keywords: matchedKeywords,
    classification_details: {
      primaryCategory: strongestMatch.name,
      categoryScores,
      suspiciousLanguageScore: Number(suspiciousLanguageScore.toFixed(2)),
      overlapCount: conspiracyCategories.length,
      keywordDensity: Number(keywordDensity.toFixed(3)),
    },
  };
}

export function getCategoryNames() {
  return CATEGORY_CONFIG.map((category) => category.name);
}
