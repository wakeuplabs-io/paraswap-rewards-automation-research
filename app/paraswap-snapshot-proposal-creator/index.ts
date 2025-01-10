import { Provider } from '@ethersproject/providers';
import { Wallet } from '@ethersproject/wallet';
import snapshot from '@snapshot-labs/snapshot.js';
import dayjs from 'dayjs';

import 'dotenv/config';
import { ethers } from 'ethers';

function buildSafeGnosisETHTransaction({
  network,
  umaAddress, //Address of the UMA contract set on the Safe account through ZODIAC
  recipient,
  ethAmount,
  token,
}: {
  network: string;
  umaAddress: string;
  recipient: string;
  ethAmount: number;
  token: {
    name: string;
    decimals: number;
    symbol: string;
    logoUri: string;
    address: string;
  };
}) {
  const formattedAmount = ethers
    .parseUnits(ethAmount.toString(), 18)
    .toString();

  return {
    safeSnap: {
      safes: [
        {
          network,
          umaAddress,
          txs: [
            {
              hash: null,
              nonce: 0,
              mainTransaction: {
                token,
                recipient,
                operation: '0',
                nonce: '0',
                type: 'transferFunds',
                data: '0x',
                to: recipient,
                amount: formattedAmount,
                value: formattedAmount,
              },
              transactions: [
                {
                  token,
                  recipient,
                  operation: '0',
                  nonce: 0,
                  type: 'transferFunds',
                  data: '0x',
                  to: recipient,
                  amount: formattedAmount,
                  value: formattedAmount,
                },
              ],
            },
          ],
          multiSendAddress: '0x998739BFdAAdde7C933B942a68053933098f9EDa',
          hash: null,
        },
      ],
      valid: true,
    },
  };
}

function buildSafeGnosisSimpleTransferTransaction({
  network,
  umaAddress, //Address of the UMA contract set on the Safe account through ZODIAC
  recipient,
  ethAmount,
}: {
  network: string;
  umaAddress: string;
  recipient: string;
  ethAmount: number;
}) {
  const formattedAmount = ethers
    .parseUnits(ethAmount.toString(), 18)
    .toString();

  return {
    safeSnap: {
      safes: [
        {
          network,
          umaAddress,
          txs: [
            {
              hash: null,
              nonce: 0,
              mainTransaction: {
                to: recipient,
                value: formattedAmount,
                data: '0x',
                nonce: '0',
                operation: '0',
              },
              transactions: [
                {
                  to: recipient,
                  value: formattedAmount,
                  data: '0x',
                  nonce: '0',
                  operation: '0',
                },
              ],
            },
          ],
          multiSendAddress: '0x998739BFdAAdde7C933B942a68053933098f9EDa',
          hash: null,
        },
      ],
      valid: true,
    },
  };
}

const hub = 'https://hub.snapshot.org'; // or https://testnet.hub.snapshot.org for testnet
const client = new snapshot.Client712(hub);

const provider = snapshot.utils.getProvider(process.env.NETWORK_ID) as Provider;

const amount = 0.00002;

const token = {
  name: 'Ether',
  decimals: 18,
  symbol: 'ETH',
  logoUri: process.env.TRANSACTION_TOKEN_LOGO_URL!,
  address: 'main',
};

const wallet = new Wallet(process.env.SNAPSHOT_AUTHOR_PRIVATE_KEY!, provider);
const authorAddress = process.env.SNAPSHOT_AUTHOR_PUBLIC_ADDRESS!;
const blockNumber = await provider.getBlockNumber();

const start = dayjs().unix();
const end = dayjs().add(3, 'minutes').unix();

console.log('Creating proposal');

const receipt = await client.proposal(wallet, authorAddress, {
  space: 'secondary.mbarro.eth',
  title: 'WakeUp Simple Transfer Proposal',
  body: 'This is the content of the Simple Transfer Proposal',
  type: 'basic',
  choices: ['For', 'Against', 'Abstain'],
  discussion: '',
  start,
  end,
  snapshot: blockNumber,
  plugins: JSON.stringify(
    buildSafeGnosisSimpleTransferTransaction({
      network: process.env.NETWORK_ID!,
      umaAddress: process.env.UMA_ADDRESS!,
      recipient: process.env.RECIPIENT_ADDRESS!,
      ethAmount: amount,
    })
  ),
  labels: [],
  app: 'snapshot', // provide the name of your project which is using this snapshot.js integration
});

console.log('Proposal created', receipt);
