import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Generate a short unique ID for contracts
export function generateShortId(length: number = 6): string {
  const chars = 'abcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

// Format date for display
export function formatDate(date: Date): string {
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(date);
}

// Calculate expiration date (30 days from creation)
export function getExpirationDate(createdAt: Date): Date {
  const expiration = new Date(createdAt);
  expiration.setDate(expiration.getDate() + 30);
  return expiration;
}

// Check if contract is expired
export function isContractExpired(createdAt: Date): boolean {
  return new Date() > getExpirationDate(createdAt);
}

// Get user's IP address (client-side fallback)
export async function getClientIp(): Promise<string> {
  try {
    const response = await fetch('https://api.ipify.org?format=json');
    const data = await response.json();
    return data.ip;
  } catch {
    return 'Unknown';
  }
}

// Copy text to clipboard
export async function copyToClipboard(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    return false;
  }
}

// Get the signing URL for a contract
export function getSigningUrl(contractId: string): string {
  if (typeof window !== 'undefined') {
    return `${window.location.origin}/s/${contractId}`;
  }
  return `/s/${contractId}`;
}
