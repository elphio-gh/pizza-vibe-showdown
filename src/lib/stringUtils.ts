
/**
 * Formats a string to Title Case (first letter of uppercase, rest lowercase).
 * Handles multiple words correctly (e.g. "PROSCIUTTO E FUNGHI" -> "Prosciutto E Funghi").
 * 
 * @param text The text to format
 * @returns The formatted text
 */
export const formatTitleCase = (text: string | null | undefined): string => {
    if (!text) return '';
    return text
        .toLowerCase()
        .split(' ')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
};

export const formatPizzaText = formatTitleCase;
