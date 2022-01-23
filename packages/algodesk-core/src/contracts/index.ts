import burnTeal from './burn.teal';

export function getContracts() {
    return {
        burnProgram: {
            teal: burnTeal
        }
    }
}
