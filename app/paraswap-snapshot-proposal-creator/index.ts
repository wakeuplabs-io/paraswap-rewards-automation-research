import { Provider } from '@ethersproject/providers';
import { Wallet } from '@ethersproject/wallet';
import snapshot from '@snapshot-labs/snapshot.js';
import dayjs from 'dayjs';

import 'dotenv/config';

const hub = 'https://hub.snapshot.org'; // or https://testnet.hub.snapshot.org for testnet
const client = new snapshot.Client712(hub);

const provider = snapshot.utils.getProvider(process.env.CHAIN_ID) as Provider;

const wallet = new Wallet(process.env.SNAPSHOT_AUTHOR_PRIVATE_KEY!, provider);
const authorAddress = process.env.SNAPSHOT_AUTHOR_PUBLIC_ADDRESS!;
const blockNumber = await provider.getBlockNumber();

const start = dayjs().unix();
const end = dayjs().add(3, 'minutes').unix();

console.log('Creating proposal');

const receipt = await client.proposal(wallet, authorAddress, {
  space: 'secondary.mbarro.eth',
  title: 'Test proposal using Snapshot.js 2',
  body: 'This is the content of the proposal',
  type: 'basic',
  choices: ['For', 'Against', 'Abstain'],
  discussion: '',
  start,
  end,
  snapshot: blockNumber,
  plugins: JSON.stringify({}),
  labels: [],
  app: 'snapshot', // provide the name of your project which is using this snapshot.js integration
});

console.log('Proposal created', receipt);
