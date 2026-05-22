export const CATEGORY_CONFIG = [
  {
    name: 'PARANORMAL',
    keywords: ['ghost', 'haunted', 'shadow figure', 'spirit', 'demon', 'apparition'],
    color: '#9d4edd'
  },
  {
    name: 'SURVEILLANCE',
    keywords: ['camera', 'watching', 'spying', 'surveillance', 'listening'],
    color: '#00ff88'
  },
  {
    name: 'ALIEN ACTIVITY',
    keywords: ['ufo', 'unidentified lights', 'spacecraft', 'alien'],
    color: '#3a86ff'
  },
  {
    name: 'UNDERGROUND CONSPIRACY',
    keywords: ['tunnels', 'underground', 'subway noises', 'vibrations'],
    color: '#b6461b'
  },
  {
    name: 'GOVERNMENT EXPERIMENT',
    keywords: ['chemical smell', 'radiation', 'frequencies', 'testing'],
    color: '#c1121f'
  },
  {
    name: 'CULT ACTIVITY',
    keywords: ['chanting', 'ritual', 'sacrifice', 'cult'],
    color: '#8b0000'
  },
  {
    name: 'ANIMAL CONSPIRACY',
    keywords: ['pigeons', 'rats', 'mutant birds', 'staring animals'],
    color: '#b8a98f'
  },
  {
    name: 'NOISE PHENOMENA',
    keywords: ['humming', 'buzzing', 'strange noises'],
    color: '#00d26a'
  }
];

const HIGH_SIGNAL_TERMS = ['unidentified', 'strange', 'unknown', 'persistent', 'recurring', 'unmarked'];

function normalize(value = '') {
  return String(value).toLowerCase().trim();
}

function stableNoise(uniqueKey = '') {
  // Deterministic variation keeps scores from looking artificial while ensuring
  // the same NYC report receives the same score on every refresh.
  return String(uniqueKey)
    .split('')
    .reduce((sum, char) => sum + char.charCodeAt(0), 0) % 12;
}

export function classifyComplaint(complaint) {
  const complaintText = normalize(
    `${complaint.complaint_type || ''} ${complaint.descriptor || ''}`
  );

  const categoryMatches = CATEGORY_CONFIG.map((category) => {
    const matchedKeywords = category.keywords.filter((keyword) =>
      complaintText.includes(keyword)
    );

    return {
      ...category,
      matchedKeywords,
      weight: matchedKeywords.length
    };
  })
    .filter((category) => category.weight > 0)
    .sort((a, b) => b.weight - a.weight);

  /*
    Classification logic:
    Only reports that match at least one conspiracy keyword are allowed through.
    The strongest category is the category with the most keyword hits. This is a
    deliberately transparent rule-based classifier so investigators can inspect
    and adjust the exact keyword lists without retraining a model.
  */
  if (!categoryMatches.length) {
    return null;
  }

  const strongestMatch = categoryMatches[0];
  const matchedKeywordCount = categoryMatches.reduce(
    (total, category) => total + category.matchedKeywords.length,
    0
  );
  const highSignalCount = HIGH_SIGNAL_TERMS.filter((term) =>
    complaintText.includes(term)
  ).length;
  const hasCoordinates = complaint.latitude && complaint.longitude;
  const descriptorLengthBonus = Math.min(Math.floor(complaintText.length / 28), 10);

  /*
    Score logic:
    Scores range from 1-100. Keyword density drives the score first, then high
    signal language, report detail length, coordinates, and deterministic noise
    add small boosts. The result feels like an intelligence-priority rating while
    staying explainable and reproducible.
  */
  const rawScore =
    34 +
    matchedKeywordCount * 14 +
    highSignalCount * 7 +
    descriptorLengthBonus +
    (hasCoordinates ? 6 : 0) +
    stableNoise(complaint.unique_key);

  return {
    conspiracy_category: strongestMatch.name,
    conspiracy_score: Math.max(1, Math.min(100, rawScore)),
    matched_keywords: strongestMatch.matchedKeywords
  };
}

export function getCategoryNames() {
  return CATEGORY_CONFIG.map((category) => category.name);
}
