export function getNetwork(): string {
    let network = localStorage.getItem("network");
    if (!network) {
        network = "mainnet";
    }
    return network;
}

export function setNetwork(name: string): void {
    localStorage.setItem("network", name);
}

