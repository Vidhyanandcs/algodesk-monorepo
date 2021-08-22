import {store} from './store';
import {getExplorer} from "@algodesk/core";

export function openAccountUrl(address: string = ""): void {
    const state = store.getState();
    const explorer = getExplorer(state.network.name);
    window.open(explorer.getAccountUrl(address), '_blank');
}