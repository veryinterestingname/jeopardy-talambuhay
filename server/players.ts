import type { PlayerData } from '$lib/index';
const playerData: PlayerData[] = [];
export const state = {
    playerData,
    whoBuzzed: null as string | null,
};