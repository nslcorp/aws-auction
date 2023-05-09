declare namespace NodeJS {
  export interface ProcessEnv {
    AUCTION_TABLE_NAME: string;
  }
}

export interface Auction {
  id: string;
  title: string;
  status: "OPEN";
  createdAt: string;
  highestBid: {
    amount: number;
    bidder: string
  };
  seller: string;
}
