import dayjs from 'dayjs';
import { createPublicClient, http, parseAbiItem } from 'viem';
import { mainnet } from 'viem/chains';

const PARASWAP_AUGUSTUS_RFQ_MAINNET =
  '0xe92b586627cca7a83dc919cc7127196d70f55a06';

const ORDER_FILLED_EVENT =
  'event OrderFilled(bytes32 indexed orderHash,address indexed maker,address makerAsset,uint256 makerAmount,address indexed taker,address takerAsset,uint256 takerAmount)';

const orderFilledEventAbi = parseAbiItem([ORDER_FILLED_EVENT]);

export const publicClient = createPublicClient({
  chain: mainnet,
  transport: http(),
});

const lastBlock = await publicClient.getBlock();

const log = (
  await publicClient.getLogs({
    address: PARASWAP_AUGUSTUS_RFQ_MAINNET,
    event: orderFilledEventAbi,
    toBlock: lastBlock.number,
    fromBlock: lastBlock.number - 100n,
  })
)[0];

const [transactionReceipt, transactionBlock] = await Promise.all([
  publicClient.getTransactionReceipt({
    hash: log.transactionHash,
  }),
  publicClient.getBlock({
    blockHash: log.blockHash,
  }),
]);

const jsonLog = {
  order: log.args.orderHash,
  maker: log.args.maker,
  makerAsset: log.args.makerAsset,
  makerAmount: log.args.makerAmount,
  date: dayjs.unix(Number(transactionBlock.timestamp)).toString(),
  gasUsed: transactionReceipt.gasUsed,
};

console.log(jsonLog);
