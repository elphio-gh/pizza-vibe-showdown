
// Mappa delle emoji per parole chiave nel gusto
const FLAVOR_EMOJI_MAP: Record<string, string> = {
    'margherita': '🍕',
    'bufala': '🍕',
    'diavola': '🌶️',
    'salame': '🌶️',
    'piccante': '🌶️',
    'nduja': '🌶️',
    'calabrese': '🌶️',
    'quattro formaggi': '🧀',
    '4 formaggi': '🧀',
    'gorgonzola': '🧀',
    'taleggio': '🧀',
    'formaggio': '🧀',
    'funghi': '🍄',
    'boscaiola': '🍄',
    'porcini': '🍄',
    'wurstel': '🌭',
    'patat': '🍟', // patate o patatine
    'fritt': '🍟',
    'verdure': '🥬',
    'vegetariana': '🥬',
    'ortolana': '🥬',
    'zucchine': '🥒',
    'melanzan': '🍆',
    'peperon': '🫑',
    'cipolla': '🧅',
    'tonno': '🐟',
    'pesce': '🐟',
    'mare': '🦐',
    'gamber': '🦐',
    'salmone': '🍣',
    'salsiccia': '🍖',
    'carne': '🥩',
    'prosciutto': '🍖',
    'speck': '🥓',
    'bacon': '🥓',
    'pancetta': '🥓',
    'uovo': '🥚',
    'carbonara': '🥚',
    'bismarck': '🥚',
    'tatu': '🦖', // Easter egg
    'ananas': '🍍',
    'hawayana': '🍍',
    'hawaii': '🍍',
    'cioccolato': '🍫',
    'nutella': '🍫',
    'dolce': '🍰',
};

// Emoji generiche di cibo per quando non riconosciamo il gusto
// Escludiamo quelle già usate sopra più o meno
const GENERIC_FOOD_EMOJIS = [
    '🥪', '🌮', '🌯', '🥙', '🧆', '🥘', '🍲', '🫕', '🥣', '🥗',
    '🍿', '🧈', '🧂', '🥫', '🍱', '🍘', '🍙', '🍚', '🍛', '🍜',
    '🍝', '🍠', '🍢', '🍣', '🍤', '🍥', '🥮', '🍡', '🥟', '🥠',
    '🥡', '🍦', '🍧', '🍨', '🍩', '🍪', '🎂', '🍰', '🧁', '🥧',
    '🍮', '🍭', '🍬', '🍫', '🥐', '🥯', '🍞', '🥖', '🥨', '🥞',
    '🧇', '🍗', '🍖', '🌭', '🍔', '🍟', '🥙', '🥓', '🥝', '🍇',
    '🍈', '🍉', '🍊', '🍋', '🍌', '🍍', '🥭', '🍎', '🍏', '🍐',
    '🍑', '🍒', '🍓', '🫐', '🥥', '🥑', '🍆', '🥔', '🥕', '🌽',
    '🌶️', '🫑', '🥒', '🥬', '🥦', '🧄', '🧅', '🍄', '🥜', '🌰',
];

/**
 * Funzione per ottenere l'emoji di una pizza in base al suo gusto (o numero come fallback)
 * @param flavor Il gusto della pizza (opzionale)
 * @param seed Un numero o stringa (es. ID pizza o numero) per il determinismo del fallback
 * @returns L'emoji associata
 */
export const getPizzaEmoji = (flavor: string | null | undefined, seed: number | string | null | undefined): string => {
    // 1. Proviamo a capire il gusto
    if (flavor) {
        const normalizedFlavor = flavor.toLowerCase();
        for (const [key, emoji] of Object.entries(FLAVOR_EMOJI_MAP)) {
            if (normalizedFlavor.includes(key)) {
                return emoji;
            }
        }
    }

    // 2. Se non capiamo, usiamo il seed per prenderne una a caso (ma fissa per quel seed)
    const seedString = String(seed || flavor || 'default');
    let hash = 0;
    for (let i = 0; i < seedString.length; i++) {
        hash = seedString.charCodeAt(i) + ((hash << 5) - hash);
    }

    const index = Math.abs(hash) % GENERIC_FOOD_EMOJIS.length;
    return GENERIC_FOOD_EMOJIS[index];
};
