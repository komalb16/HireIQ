"use client";

/**
 * Institutional Validation Suite
 * Handles active node verification for Groq and RapidAPI.
 */

const DENIAL_SOUND_URL = "https://assets.mixkit.co/active_storage/sfx/2568/2568-preview.mp3";

export const playDenialSound = () => {
  try {
    const audio = new Audio(DENIAL_SOUND_URL);
    audio.volume = 0.4;
    audio.play();
  } catch (e) {
    console.error("Audio node failure", e);
  }
};

export async function validateGroqKey(apiKey: string): Promise<{ valid: boolean; error?: string }> {
  try {
    const response = await fetch('https://api.groq.com/openai/v1/models', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
      },
    });

    if (response.ok) return { valid: true };
    const data = await response.json();
    return { valid: false, error: data.error?.message || "Invalid API Node" };
  } catch (e) {
    return { valid: false, error: "Connection to Groq Node failed" };
  }
}

export async function validateRapidKey(apiKey: string): Promise<{ valid: boolean; error?: string }> {
  try {
    const response = await fetch('https://jsearch.p.rapidapi.com/search?query=test&page=1&num_pages=1', {
      method: 'GET',
      headers: {
        'x-rapidapi-key': apiKey,
        'x-rapidapi-host': 'jsearch.p.rapidapi.com',
      },
    });

    if (response.ok) return { valid: true };
    return { valid: false, error: "RapidAPI Node unauthorized or quota exceeded" };
  } catch (e) {
    return { valid: false, error: "Connection to Rapid Node failed" };
  }
}
