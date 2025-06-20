const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');
const { ethers } = require('ethers');

const app = express();
const PORT = 5000;

// Pinata keys
const PINATA_API_KEY = '3ed821b090e838b7a70e';
const PINATA_API_SECRET = '9bec76483141bac69f915be60f7bc5d4374dbe9d7727bcf4d41d3d4eed3a6ae8';

// Blockchain keys
const PRIVATE_KEY = 'a3a711b3ce1f86a929dcc4ed6412ba8b9631edeb261309e97d3fcbfcad35a0f5';
const RPC_URL = 'https://rpc.sepolia.org';
const CONTRACT_ADDRESS = '0xF23133f1cd75C8AF6dEe73389BbB4C327697B82D';

// ABI file
const ABI = require('./JusticeChainABI.json');

// Blockchain setup
const provider = new ethers.JsonRpcProvider(RPC_URL);
const wallet = new ethers.Wallet(PRIVATE_KEY, provider);
const contract = new ethers.Contract(CONTRACT_ADDRESS, ABI, wallet);

// MIDDLEWARE
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// ROUTES
app.get('/', (req, res) => {
    res.send('JusticeChain backend running ✅');
});

app.post('/api/uploadFIR', async (req, res) => {
    try {
        const firData = req.body;

        console.log('FIR received:', firData);

        // Upload to Pinata
        const pinataResponse = await axios.post(
            'https://api.pinata.cloud/pinning/pinJSONToIPFS',
            {
                pinataMetadata: {
                    name: `FIR-${Date.now()}`
                },
                pinataContent: firData
            },
            {
                headers: {
                    'Content-Type': 'application/json',
                    pinata_api_key: PINATA_API_KEY,
                    pinata_secret_api_key: PINATA_API_SECRET
                }
            }
        );

        const ipfsHash = pinataResponse.data.IpfsHash;

        console.log('Uploaded to Pinata:', ipfsHash);

        // Send to Blockchain
        const tx = await contract.createFIR(
            firData.incidentType,
            firData.incidentDescription,
            5, // example severity
            ipfsHash
        );

        console.log('TX sent:', tx.hash);

        await tx.wait();

        console.log('TX confirmed');

        res.json({
            success: true,
            ipfsHash: ipfsHash,
            txHash: tx.hash
        });

    } catch (error) {
        console.error('Error uploading FIR:', error);
        res.status(500).json({
            success: false,
            message: 'Error uploading FIR',
            error: error.message
        });
    }
});

// START SERVER
app.listen(PORT, () => {
    console.log(`✅ Backend running at http://localhost:${PORT}`);
});

