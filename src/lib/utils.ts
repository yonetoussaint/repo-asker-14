
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Type utility to help work around type comparison issues
export function safelyCompareStrings<T extends string, U extends string>(a: T, b: U): boolean {
  return a === b as unknown as T;
}
