import { describe, it, expect } from 'vitest';
import { getPizzaEmoji } from './pizzaUtils';

describe('getPizzaEmoji', () => {
    it('returns mapped emoji for known flavors', () => {
        expect(getPizzaEmoji('Margherita', 1)).toBe('🍕');
        expect(getPizzaEmoji('Pizza Margherita', 1)).toBe('🍕');
        expect(getPizzaEmoji('Diavola', 1)).toBe('🌶️');
        expect(getPizzaEmoji('Salame Piccante', 1)).toBe('🌶️');
        expect(getPizzaEmoji('4 Formaggi', 1)).toBe('🧀');
        expect(getPizzaEmoji('Quattro Formaggi', 1)).toBe('🧀');
        expect(getPizzaEmoji('Funghi Porcini', 1)).toBe('🍄');
        expect(getPizzaEmoji('Wurstel e Patatine', 1)).toBe('🌭'); // Wurstel matches first
        // Note: order in map matters. 'wurstel' before 'patat' -> 🌭.
    });

    it('is case insensitive', () => {
        expect(getPizzaEmoji('margherita', 1)).toBe('🍕');
        expect(getPizzaEmoji('MARGHERITA', 1)).toBe('🍕');
        expect(getPizzaEmoji('DiAvOlA', 1)).toBe('🌶️');
    });

    it('returns consistent emoji for unknown flavor based on seed', () => {
        const flavor = 'Pizza Alieno';
        const seed1 = 1;
        const seed2 = 2;

        // Deterministic for same seed
        const emoji1 = getPizzaEmoji(flavor, seed1);
        const emoji1_again = getPizzaEmoji(flavor, seed1);
        expect(emoji1).toBe(emoji1_again);

        // Deterministic for different seed (likely different, but could collide due to modulo)
        const emoji2 = getPizzaEmoji(flavor, seed2);
        // We don't assert emoji1 !== emoji2 because collisions are possible, 
        // but they should be consistent.
        expect(emoji2).toBeDefined();
        expect(typeof emoji2).toBe('string');
    });

    it('handles empty or null inputs gracefully', () => {
        expect(getPizzaEmoji(null, 1)).toBeDefined();
        expect(getPizzaEmoji(undefined, 1)).toBeDefined();
        expect(getPizzaEmoji('', 1)).toBeDefined();
    });
});
