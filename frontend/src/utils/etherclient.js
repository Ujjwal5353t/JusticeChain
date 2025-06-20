import { BrowserProvider, Contract } from "ethers";

import { FIRStorage } from "./firStorage"


const walletAddress = "0xF23133f1cd75C8AF6dEe73389BbB4C327697B82D";

const walletAbi = [
    {
      "inputs": [],
      "stateMutability": "nonpayable",
      "type": "constructor"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "id",
          "type": "uint256"
        },
        {
          "indexed": false,
          "internalType": "string",
          "name": "title",
          "type": "string"
        },
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "severity",
          "type": "uint256"
        },
        {
          "indexed": false,
          "internalType": "string",
          "name": "ipfsHash",
          "type": "string"
        },
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "timestamp",
          "type": "uint256"
        }
      ],
      "name": "FIRCreated",
      "type": "event"
    },
    {
      "inputs": [
        {
          "internalType": "string",
          "name": "_title",
          "type": "string"
        },
        {
          "internalType": "string",
          "name": "_description",
          "type": "string"
        },
        {
          "internalType": "uint256",
          "name": "_severity",
          "type": "uint256"
        },
        {
          "internalType": "string",
          "name": "_ipfsHash",
          "type": "string"
        }
      ],
      "name": "createFIR",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "name": "firs",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "id",
          "type": "uint256"
        },
        {
          "internalType": "string",
          "name": "title",
          "type": "string"
        },
        {
          "internalType": "string",
          "name": "description",
          "type": "string"
        },
        {
          "internalType": "uint256",
          "name": "severity",
          "type": "uint256"
        },
        {
          "internalType": "string",
          "name": "ipfsHash",
          "type": "string"
        },
        {
          "internalType": "uint256",
          "name": "timestamp",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "getAllFIRs",
      "outputs": [
        {
          "components": [
            {
              "internalType": "uint256",
              "name": "id",
              "type": "uint256"
            },
            {
              "internalType": "string",
              "name": "title",
              "type": "string"
            },
            {
              "internalType": "string",
              "name": "description",
              "type": "string"
            },
            {
              "internalType": "uint256",
              "name": "severity",
              "type": "uint256"
            },
            {
              "internalType": "string",
              "name": "ipfsHash",
              "type": "string"
            },
            {
              "internalType": "uint256",
              "name": "timestamp",
              "type": "uint256"
            }
          ],
          "internalType": "struct JusticeChain.FIR[]",
          "name": "",
          "type": "tuple[]"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "_id",
          "type": "uint256"
        }
      ],
      "name": "getFIR",
      "outputs": [
        {
          "components": [
            {
              "internalType": "uint256",
              "name": "id",
              "type": "uint256"
            },
            {
              "internalType": "string",
              "name": "title",
              "type": "string"
            },
            {
              "internalType": "string",
              "name": "description",
              "type": "string"
            },
            {
              "internalType": "uint256",
              "name": "severity",
              "type": "uint256"
            },
            {
              "internalType": "string",
              "name": "ipfsHash",
              "type": "string"
            },
            {
              "internalType": "uint256",
              "name": "timestamp",
              "type": "uint256"
            }
          ],
          "internalType": "struct JusticeChain.FIR",
          "name": "",
          "type": "tuple"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "getTotalFIRs",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    }
  ]

const uploadToPinata = async (fir) => {


  const form = new FormData();
  const blob = new Blob([JSON.stringify(fir)], { type: "application/json" });

  form.append("file", blob, `${fir.firNumber}.json`);

  const response = await fetch("https://uploads.pinata.cloud/v3/files", {
    method: "POST",
    headers: {
      Authorization: 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySW5mb3JtYXRpb24iOnsiaWQiOiI0OTdiMThkZS1lYzVhLTRmMTYtYWMyOS1jNTlkMDA1MzYzNmYiLCJlbWFpbCI6InlhZGF2dWpqd2FsMjUxQGdtYWlsLmNvbSIsImVtYWlsX3ZlcmlmaWVkIjp0cnVlLCJwaW5fcG9saWN5Ijp7InJlZ2lvbnMiOlt7ImRlc2lyZWRSZXBsaWNhdGlvbkNvdW50IjoxLCJpZCI6IkZSQTEifSx7ImRlc2lyZWRSZXBsaWNhdGlvbkNvdW50IjoxLCJpZCI6Ik5ZQzEifV0sInZlcnNpb24iOjF9LCJtZmFfZW5hYmxlZCI6ZmFsc2UsInN0YXR1cyI6IkFDVElWRSJ9LCJhdXRoZW50aWNhdGlvblR5cGUiOiJzY29wZWRLZXkiLCJzY29wZWRLZXlLZXkiOiI4NWM0N2FhNjNjZjI4NzY5NDE0MiIsInNjb3BlZEtleVNlY3JldCI6ImIwY2ZlZTMwOTNlNGM0ZTk1M2I2YTQ3NDk3YTQzOTU5YzUwZGEyOTgxZDNkZWJlM2U3MDQxY2E4YmNkYTFmMTMiLCJleHAiOjE3ODE5NDcwNjd9.C6b1C1XbtJDyZeW-PFgycP4ytfwneL6uUI-Ak6jlCyQ' ,
    },
    body: form ,
  });

  
  const {cid} = await response.json();     
  return `ipfs://${cid}`;

}




export const sendFirToSmartContract = async (firNumber) => {

  try {
    const provider = new BrowserProvider(window.ethereum);


    await provider.send("eth_requestAccounts", []);

    const signer = await provider.getSigner();

    //searching FIR

    const fir = FIRStorage.searchFIR("fir", firNumber);
    if (!fir) throw new Error("FIR not found");

    //storing in Pinata

    const ipfsHash = await uploadToPinata(fir);

    
    //send to smart contract 

    const contract = new Contract(walletAddress, walletAbi, signer);


    const data = await contract.createFIR(
      fir.incidentType || "Untitled FIR",
      fir.incidentDescription || "No description",
      fir.severity || 1,
      ipfsHash
    );

    await data.wait();

    console.log("✅ FIR has been successfully submitted to the blockchain!");
    return { success: true, data };
  } catch (err) {
    return { success: false, error: err.message };
  };

}
