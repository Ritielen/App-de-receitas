import { createTamagui, createTokens } from 'tamagui';
import { config } from '@tamagui/config/v3';

// Pegamos as cores do seu antigo theme.ts e transformamos em tokens do Tamagui
const tokens = createTokens({
  ...config.tokens,
  color: {
    ...config.tokens.color,
    background: '#f5f5f5',
    white: '#fff',
    primary: '#007BFF',
    danger: '#FF3B30',
    border: '#ccc',
    textDark: '#333',
    textMedium: '#666',
    textMuted: '#999',
    grayLight: '#e0e0e0',
  },
});

const tamaguiConfig = createTamagui({
  ...config,
  tokens,
});

export type AppConfig = typeof tamaguiConfig;
declare module 'tamagui' {
  interface TamaguiCustomConfig extends AppConfig {}
}

export default tamaguiConfig;