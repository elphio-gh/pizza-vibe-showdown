
// Mappa delle emoji per parole chiave nel gusto
export const FLAVOR_EMOJI_MAP: Record<string, string> = {
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
export const GENERIC_FOOD_EMOJIS = [
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
 * Returns a list of all possible emojis that can be used for pizzas.
 * Combines flavor-specific emojis and generic food emojis, removing duplicates.
 */
export const getAllEmojis = (): string[] => {
    const flavorEmojis = Object.values(FLAVOR_EMOJI_MAP);
    const uniqueEmojis = new Set([...flavorEmojis, ...GENERIC_FOOD_EMOJIS]);
    return Array.from(uniqueEmojis);
};

/**
 * Funzione per ottenere l'emoji di una pizza in base al suo gusto (o numero come fallback)
 * @param flavor Il gusto della pizza (opzionale)
 * @param seed Un numero o stringa (es. ID pizza o numero) per il determinismo del fallback
 * @param forcedEmoji L'emoji salvata nel DB, se presente vince su tutto
 * @returns L'emoji associata
 */
export const getPizzaEmoji = (flavor: string | null | undefined, seed: number | string | null | undefined, forcedEmoji?: string | null): string => {
    if (forcedEmoji) return forcedEmoji;

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
    // Utilizziamo un semplice algoritmo di hashing (djb2-like) per generare un indice
    // che sia sempre lo stesso per lo stesso input (determinismo).
    // Questo evita che l'emoji cambi ricaricando la pagina.
    const seedString = String(seed || flavor || 'default');
    let hash = 0;
    for (let i = 0; i < seedString.length; i++) {
        hash = seedString.charCodeAt(i) + ((hash << 5) - hash);
    }

    const index = Math.abs(hash) % GENERIC_FOOD_EMOJIS.length;
    return GENERIC_FOOD_EMOJIS[index];
};

/**
 * Returns a list of emojis that are currently NOT used by any other pizza.
 * @param usedEmojis Set of emojis already in use
 * @returns Array of available emojis
 */
export const getAvailableEmojis = (usedEmojis: Set<string>): string[] => {
    const all = getAllEmojis();
    return all.filter(e => !usedEmojis.has(e));
};

