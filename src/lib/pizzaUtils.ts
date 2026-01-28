
// Emoji uniche per ogni pizza - assegnate in base al numero pizza (uguale per tutti gli utenti)
export const PIZZA_EMOJIS = [
    '🍕', '🧀', '🍅', '🥓', '🌶️', '🫒', '🧄', '🍄', '🥬', '🌿',
    '🥚', '🍖', '🦐', '🐟', '🥩', '🧅', '🌽', '🥦', '🍆', '🫑'
];

/**
 * Funzione per ottenere l'emoji di una pizza in base al suo numero (deterministico per tutti)
 * @param pizzaNumber Il numero sequenziale della pizza
 * @returns L'emoji associata a quel numero
 */
export const getPizzaEmoji = (pizzaNumber: number): string => {
    // Usa il numero pizza per selezionare l'emoji (modulo per ciclare se > 20 pizze)
    // Gestiamo anche il caso in cui pizzaNumber sia undefined o null (default a 1)
    const num = pizzaNumber || 1;
    return PIZZA_EMOJIS[(num - 1) % PIZZA_EMOJIS.length];
};
