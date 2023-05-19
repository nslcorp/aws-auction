declare namespace NodeJS {
  export interface ProcessEnv {
    AUCTION_TABLE_NAME: string;
    AUCTION_BUCKET_NAME: string;
  }
}

export interface Auction {
  id: string;
  title: string;
  status: "OPEN";
  createdAt: string;
  highestBid: {
    amount: number;
    bidder: string;
  };
  seller: string;
}

export interface MessageQueueRecord {
  subjectText: string;
  bodyText: string;
  recipients: string[];
}
