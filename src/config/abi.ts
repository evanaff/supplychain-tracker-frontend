export const SMART_CONTRACT_ABI = [
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "_executor",
                "type": "address"
            }
        ],
        "name": "addExecutor",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "string",
                "name": "_traceEventId",
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
        "name": "addTraceEvent",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "",
                "type": "address"
            }
        ],
        "name": "executors",
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
            "internalType": "string",
            "name": "_traceEventId",
            "type": "string"
            }
        ],
        "name": "getTraceEventById",
        "outputs": [
            {
                "components": [
                    {
                        "internalType": "string",
                        "name": "traceEventId",
                        "type": "string"
                    },
                    {
                        "internalType": "bytes32",
                        "name": "dataHash",
                        "type": "bytes32"
                    }
                ],
                "internalType": "struct SupplyChainTracker.TraceEvent",
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
        "name": "traceEvents",
        "outputs": [
            {
                "internalType": "string",
                "name": "traceEventId",
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
    }
  ];