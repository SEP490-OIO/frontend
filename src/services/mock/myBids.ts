/**
 * Mock data for the My Bids page — expanded from dashboard mock data.
 *
 * Dashboard shows a preview (3 active, 2 ended). My Bids shows the
 * COMPLETE picture of all auctions the user is involved in:
 * - Active: #1 (winning), #3 (outbid), #4 (outbid), #5 (sealed/qualified)
 * - Ended: #8 (won), #9 (lost)
 * - Watching (heart only, no deposit): #2, #6, #12
 *
 * The "current user" is user-00000100-mock (same as dashboard & wallet).
 */

import type { MyBidItem, AuctionListItem } from '@/types';
import { MOCK_AUCTION_LIST } from './auctions';
import { CURRENT_USER_ID } from './auctionDetails';
import { mockId, mockDate } from './helpers';

// ─── Active Bids (deposit paid or bid placed) ─────────────────────

export const MOCK_MY_ACTIVE_BIDS_FULL: MyBidItem[] = [
  // #1 iPhone — winning (same as dashboard)
  {
    auction: MOCK_AUCTION_LIST[0],
    myLatestBid: {
      id: mockId('bid', 100),
      auctionId: mockId('auction', 1),
      bidderId: CURRENT_USER_ID,
      bidderName: 'Bạn',
      amount: 24_500_000,
      isAutoBid: false,
      autoBidId: null,
      status: 'winning',
      createdAt: mockDate(-1),
    },
    myBidStatus: 'winning',
  },
  // #3 MacBook — outbid (same as dashboard)
  {
    auction: MOCK_AUCTION_LIST[2],
    myLatestBid: {
      id: mockId('bid', 101),
      auctionId: mockId('auction', 3),
      bidderId: CURRENT_USER_ID,
      bidderName: 'Bạn',
      amount: 20_500_000,
      isAutoBid: true,
      autoBidId: mockId('autobid', 3),
      status: 'outbid',
      createdAt: mockDate(-2),
    },
    myBidStatus: 'outbid',
  },
  // #4 Pokemon — outbid (same as dashboard)
  {
    auction: MOCK_AUCTION_LIST[3],
    myLatestBid: {
      id: mockId('bid', 102),
      auctionId: mockId('auction', 4),
      bidderId: CURRENT_USER_ID,
      bidderName: 'Bạn',
      amount: 4_000_000,
      isAutoBid: false,
      autoBidId: null,
      status: 'outbid',
      createdAt: mockDate(-5),
    },
    myBidStatus: 'outbid',
  },
  // #5 Sony XM5 — sealed auction, user qualified + submitted bid
  // Dashboard doesn't include this (it only shows open active bids)
  {
    auction: MOCK_AUCTION_LIST[4],
    myLatestBid: {
      id: mockId('bid', 103),
      auctionId: mockId('auction', 5),
      bidderId: CURRENT_USER_ID,
      bidderName: null, // Sealed — name hidden
      amount: 6_500_000,
      isAutoBid: false,
      autoBidId: null,
      status: 'active', // Sealed bids don't have winning/outbid until reveal
      createdAt: mockDate(-4),
    },
    myBidStatus: 'active',
  },
];

// ─── Ended Bids (auction finished, user participated) ──────────────

export const MOCK_MY_ENDED_BIDS: MyBidItem[] = [
  // #8 PS5 — won
  {
    auction: MOCK_AUCTION_LIST[7],
    myLatestBid: {
      id: mockId('bid', 110),
      auctionId: mockId('auction', 8),
      bidderId: CURRENT_USER_ID,
      bidderName: 'Bạn',
      amount: 12_800_000,
      isAutoBid: false,
      autoBidId: null,
      status: 'won',
      createdAt: mockDate(-50),
    },
    myBidStatus: 'won',
  },
  // #9 Giant bike — lost
  {
    auction: MOCK_AUCTION_LIST[8],
    myLatestBid: {
      id: mockId('bid', 111),
      auctionId: mockId('auction', 9),
      bidderId: CURRENT_USER_ID,
      bidderName: 'Bạn',
      amount: 7_000_000,
      isAutoBid: false,
      autoBidId: null,
      status: 'outbid',
      createdAt: mockDate(-80),
    },
    myBidStatus: 'outbid',
  },
];

// ─── Watching (heart only, no deposit paid) ────────────────────────

export const MOCK_MY_WATCHED_AUCTIONS: AuctionListItem[] = [
  MOCK_AUCTION_LIST[1],  // #2 Jordan 1 (active)
  MOCK_AUCTION_LIST[5],  // #6 Canon R6 (qualifying)
  MOCK_AUCTION_LIST[11], // #12 G-Shock (qualifying)
];
