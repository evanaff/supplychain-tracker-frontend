export const SMART_CONTRACT_ABI = [
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "",
                "type": "address"
            }
        ],
        "name": "actors",
        "outputs": [
            {
                "internalType": "bool",
                "name": "",
                "type": "bool"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "_actor",
                "type": "address"
            }
        ],
        "name": "addActor",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "string",
                "name": "productEventId",
                "type": "string"
            },
            {
                "internalType": "bytes32",
                "name": "_dataHash",
                "type": "bytes32"
            },
            {
                "internalType": "bytes",
                "name": "_signature",
                "type": "bytes"
            }
        ],
        "name": "addProductEvent",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "string",
                "name": "productEventId",
                "type": "string"
            }
        ],
        "name": "getProductEventById",
        "outputs": [
            {
                "components": [
                {
                    "internalType": "string",
                    "name": "productEventId",
                    "type": "string"
                },
                {
                    "internalType": "bytes32",
                    "name": "dataHash",
                    "type": "bytes32"
                }
                ],
                "internalType": "struct SupplyChainTracker.ProductEvent",
                "name": "",
                "type": "tuple"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "owner",
        "outputs": [
            {
                "internalType": "address",
                "name": "",
                "type": "address"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "string",
                "name": "",
                "type": "string"
            }
        ],
        "name": "productEvents",
        "outputs": [
            {
                "internalType": "string",
                "name": "productEventId",
                "type": "string"
            },
            {
                "internalType": "bytes32",
                "name": "dataHash",
                "type": "bytes32"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "_actor",
                "type": "address"
            }
        ],
        "name": "removeActor",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    }
];