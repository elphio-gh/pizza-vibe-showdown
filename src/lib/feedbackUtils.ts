export const FEEDBACK_MESSAGES: Record<string, string[]> = {
    "0-3.5": [
        "Crimine contro l'umanità 💀",
        "Chiama la polizia 🚓",
        "Meglio il digiuno 🤐",
        "Tristezza infinita 🎻",
        "Cartone bagnato 📦"
    ],
    "3.6-5.0": [
        "Meh... 😐",
        "Si sopravvive... forse 🧟",
        "Ho visto di peggio (ma dove?) 🤔",
        "Senza infamia, ma con lode... no wait. 📉"
    ],
    "5.1-6.5": [
        "Mangiabile dai 🍽️",
        "Onesta 😐",
        "Poteva andare peggio 🤷‍♂️",
        "Sufficienza politica 🎓"
    ],
    "6.6-7.5": [
        "Buona! 😋",
        "Ci sta tutta 🤙",
        "Non male proprio 👌",
        "Una garanzia 🛡️"
    ],
    "7.6-8.5": [
        "Che mina! 💣",
        "Spettacolo! 🤩",
        "Livello Pro 🏆",
        "Godo 🤤"
    ],
    "8.6-9.5": [
        "DI-VI-NA ✨",
        "Sposami 💍",
        "Capolavoro 🎨",
        "Estasi mistica 🧘‍♂️"
    ],
    "9.6-10": [
        "STURBO TOTALE 🚀",
        "LEGGENDA 🦄",
        "Il Sacro Graal 🏆",
        "Muoio felice ⚰️"
    ]
};

export const getFeedbackMessage = (score: number): string => {
    let rangeKey = "5.1-6.5"; // Default

    if (score <= 3.5) rangeKey = "0-3.5";
    else if (score <= 5.0) rangeKey = "3.6-5.0";
    else if (score <= 6.5) rangeKey = "5.1-6.5";
    else if (score <= 7.5) rangeKey = "6.6-7.5";
    else if (score <= 8.5) rangeKey = "7.6-8.5";
    else if (score <= 9.5) rangeKey = "8.6-9.5";
    else rangeKey = "9.6-10";

    const messages = FEEDBACK_MESSAGES[rangeKey];
    return messages[Math.floor(Math.random() * messages.length)];
};
