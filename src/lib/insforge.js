import { createClient } from '@insforge/sdk';

const env = typeof import.meta !== 'undefined' ? import.meta.env : {};
const baseUrl = env?.VITE_INSFORGE_URL || 'https://x288sjp2.ap-southeast.insforge.app';
const anonKey = env?.VITE_INSFORGE_ANON_KEY || 'anon_f2668a28c2fb84251c4853f5f839b3d296ee8834e9c102d8d9acf46f0735c739';

export const insforge = createClient({
  baseUrl,
  anonKey,
});

export default insforge;
