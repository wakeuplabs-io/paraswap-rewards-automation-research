import dayjs from 'dayjs';
import { gql, request } from 'graphql-request';
import dotenv from 'dotenv';

// subgraph schema reference: https://github.com/paraswap/paraswap-rfq-subgraph/blob/master/schema.graphql

dotenv.config();

const url = `${process.env.SUBGRAPH_BASE_URL}/${process.env.SUBGRAPH_API_KEY}/subgraphs/id/${process.env.SUBGRAPH_PARASWAP_AUGUSTUS_RFQ_MAINNET_ID}`;

const december2024Start = dayjs('2024-12-01 00:00:00').unix();
const december2024End = dayjs('2024-12-31 23:59:59').unix();

const filledOrdersQuery = gql`
  {
    filledOrders(first: 100, orderBy: timestamp, orderDirection: desc, where: { timestamp_gt: ${december2024Start}, timestamp_lt: ${december2024End} }) {
      id
      augustusRFQ
      augustusRFQVersion
      orderHash
      txGasLimit
      txOrigin
      txHash
      timestamp
    }
  }
`;

const response = (await request(url, filledOrdersQuery)) as {
  filledOrders: any[];
  _meta: any;
};

console.log('meta', response._meta);

console.log(
  response.filledOrders.map((item) => ({
    ...item,
    date: dayjs.unix(item.timestamp).format('YYYY-MM-DD HH:mm:ss'),
  }))
);
