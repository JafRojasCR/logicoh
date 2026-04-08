export const DARK_PALETTE = [
  '#1E1E1E',
  '#1A3A5F',
  '#2D3436',
  '#2C3E50',
  '#30336B',
  '#130F40',
];

export function getRandomPaletteColor() {
  return DARK_PALETTE[Math.floor(Math.random() * DARK_PALETTE.length)];
}

export function withDefaultStyle(word) {
  return {
    ...word,
    style: {
      backgroundColor: word?.style?.backgroundColor || getRandomPaletteColor(),
      textColor: word?.style?.textColor || '#FFFFFF',
    },
  };
}
