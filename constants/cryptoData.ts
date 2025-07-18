export interface CryptoItem {
  id: string;
  name: string;
  symbol: string;
  imageUrl: string;
}

export const TOP_CRYPTOS: CryptoItem[] = [
  {
    id: 'bitcoin',
    name: 'Bitcoin',
    symbol: 'BTC',
    imageUrl: 'https://coin-images.coingecko.com/coins/images/1/large/bitcoin.png?1696501400',
  },
  {
    id: 'ethereum',
    name: 'Ethereum',
    symbol: 'ETH',
    imageUrl: 'https://coin-images.coingecko.com/coins/images/279/large/ethereum.png?1696501628',
  },
  {
    id: 'ripple',
    name: 'XRP',
    symbol: 'XRP',
    imageUrl: 'https://coin-images.coingecko.com/coins/images/44/large/xrp-symbol-white-128.png?1696501442',
  },
  {
    id: 'tether',
    name: 'Tether',
    symbol: 'USDT',
    imageUrl: 'https://coin-images.coingecko.com/coins/images/325/large/Tether.png?1696501661',
  },
  {
    id: 'binancecoin',
    name: 'BNB',
    symbol: 'BNB',
    imageUrl: 'https://coin-images.coingecko.com/coins/images/825/large/bnb-icon2_2x.png?1696501970',
  },
  {
    id: 'solana',
    name: 'Solana',
    symbol: 'SOL',
    imageUrl: 'https://coin-images.coingecko.com/coins/images/4128/large/solana.png?1718769756',
  },
  {
    id: 'usd-coin',
    name: 'USDC',
    symbol: 'USDC',
    imageUrl: 'https://coin-images.coingecko.com/coins/images/6319/large/usdc.png?1696506694',
  },
  {
    id: 'dogecoin',
    name: 'Dogecoin',
    symbol: 'DOGE',
    imageUrl: 'https://coin-images.coingecko.com/coins/images/5/large/dogecoin.png?1696501409',
  },
  {
    id: 'staked-ether',
    name: 'Lido Staked Ether',
    symbol: 'stETH',
    imageUrl: 'https://coin-images.coingecko.com/coins/images/13442/large/steth_logo.png?1696513206',
  },
  {
    id: 'tron',
    name: 'TRON',
    symbol: 'TRX',
    imageUrl: 'https://coin-images.coingecko.com/coins/images/1094/large/tron-logo.png?1696502193',
  },
];