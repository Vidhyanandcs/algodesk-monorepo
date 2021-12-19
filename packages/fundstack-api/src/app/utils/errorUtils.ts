export type ErrorMessage = {
    error: {
        message: string
    }
}
export function prepareError(message: string): ErrorMessage {
    return {
        error: {
            message
        }
    };
}