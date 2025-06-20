require('dotenv').config();
const express = require('express');
const cors = require('cors');
const axios = require('axios');
const { ethers } = require('ethers');
const fs = require('fs');

// App config
const app = express();
app.use(cors());
app.use(express.json());

// Load env
const {
    PINATA_API_KEY,
    PINATA_SECRET_API_KEY,
    PRIVATE_KEY,
    RPC_URL,
    CONTRACT_ADDRESS
} = process.env;

const CONTRACT_ABI = JSON.parse(fs.readFileSync('./JusticeChainABI.json', 'utf8'));

// ethers.js setup
const provider = new ethers.JsonRpcProvider(RPC_URL);
const wallet = new ethers.Wallet(PRIVATE_KEY, provider);
const contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, wallet);

// Pinata - Upload JSON to IPFS
const pinJSONToIPFS = async (jsonData) => {
    const url = `https://api.pinata.cloud/pinning/pinJSONToIPFS`;

    const res = await axios.post(url, jsonData, {
        headers: {
            'pinata_api_key': PINATA_API_KEY,
            'pinata_secret_api_key': PINATA_SECRET_API_KEY
        }
    });

    console.log('✅ Pinned to IPFS:', res.data);
    return res.data.IpfsHash;
};

// Routes
app.get('/', (req, res) => {
    res.send('JusticeChain Backend Running 🚀');
});

app.post('/uploadToIPFS', async (req, res) => {
    try {
        const firData = req.body;

        const ipfsHash = await pinJSONToIPFS(firData);

        res.json({
            success: true,
            ipfsHash: `https://gateway.pinata.cloud/ipfs/${ipfsHash}`
        });
    } catch (err) {
        console.error('❌ Error uploading to Pinata:', err);
        res.status(500).json({ success: false, error: err.message });
    }
});

app.post('/createFIR', async (req, res) => {
    try {
        const { title, description, severity, ipfsHash } = req.body;

        console.log('▶️ Submitting FIR to blockchain:', { title, severity, ipfsHash });

        const tx = await contract.createFIR(title, description, severity, ipfsHash);
        await tx.wait();

        console.log('✅ FIR created! Tx hash:', tx.hash);

        res.json({ success: true, txHash: tx.hash });
    } catch (err) {
        console.error('❌ Error creating FIR on blockchain:', err);
        res.status(500).json({ success: false, error: err.message });
    }
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`🚀 Server running at http://localhost:${PORT}`);
});
