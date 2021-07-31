export default {
    "transform": {
        "\\.m?js?$": "jest-esm-transformer",
        "\\.teal$": "jest-raw-loader"
    },
    "setupFilesAfterEnv": [
        './jest.setup.js'
    ]
};