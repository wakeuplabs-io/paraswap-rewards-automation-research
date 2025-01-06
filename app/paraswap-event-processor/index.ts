import dayjs from 'dayjs';
import { createPublicClient, hexToBigInt, http, parseAbiItem } from 'viem';
import { mainnet } from 'viem/chains';
import { z } from 'zod';

const PARASWAP_AUGUSTUS_RFQ_MAINNET =
  '0xe92b586627cca7a83dc919cc7127196d70f55a06';

const ORDER_FILLED_EVENT =
  'event OrderFilled(bytes32 indexed orderHash,address indexed maker,address makerAsset,uint256 makerAmount,address indexed taker,address takerAsset,uint256 takerAmount)';

const orderFilledEventAbi = parseAbiItem([ORDER_FILLED_EVENT]);

// Data structure: https://developers.paraswap.network/api/limit-orders/data-structure-in-our-centralized-system

const schema = z.object({
  orderHash: z.string(),
  maker: z.string(),
  makerAsset: z.string(),
  makerAmount: z.bigint(),
  taker: z.string(),
  takerAsset: z.string(),
  takerAmount: z.bigint(),
  timeStamp: z.bigint().transform((val) => dayjs.unix(Number(val)).toString()),
  block: z.bigint(),
  gasUsed: z.bigint(),
});

export const publicClient = createPublicClient({
  chain: mainnet,
  transport: http(),
});

const lastBlock = await publicClient.getBlock();

const logs = await publicClient.getLogs({
  address: PARASWAP_AUGUSTUS_RFQ_MAINNET,
  event: orderFilledEventAbi,
  toBlock: lastBlock.number,
  fromBlock: lastBlock.number - 1000n,
});

const ordersFilled = await Promise.all(
  logs.map(async (log) => {
    const transactionReceipt = await publicClient.getTransactionReceipt({
      hash: log.transactionHash,
    });
    return {
      ...log.args,
      gasUsed: transactionReceipt.gasUsed,
      block: transactionReceipt.blockNumber,
      timeStamp: hexToBigInt((log as any)['blockTimestamp']),
    };
  })
);

console.log(ordersFilled.map((order) => schema.parse(order)));
