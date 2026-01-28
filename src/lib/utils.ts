// Utility per gestire le classi CSS in modo pulito.
// 'cn' sta per 'class names'. Ci permette di unire classi CSS e gestire
// le condizioni (es: aggiungi questa classe solo se la variabile è vera)
// evitando conflitti tra classi Tailwind.
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
