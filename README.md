# Bid System v1.0 — Frontend

Responsive web frontend for the Competitive Bidding E-Commerce Platform. Built with **React 18**, **TypeScript**, **Vite**, and **Ant Design 5**.

## Quick Start

```bash
npm install
npm run dev          # http://localhost:3000 with HMR
npm run build        # TypeScript check + production build
npm run lint         # ESLint
npm run preview      # Preview production build
```

**Requires:** Node.js 18+

## Implemented Pages

| Route | Page | Description |
|-------|------|-------------|
| `/` | Home | Landing page |
| `/browse` | Browse | Auction catalog with filters, search, AuctionCard grid |
| `/auction/:id` | Auction Detail | Image gallery, bid history, interactive bidding panel |
| `/dashboard` | Dashboard | Stats, active bids, recent results, wallet summary |
| `/wallet` | Wallet | Balance overview, transaction history, add/withdraw modals |
| `/my-bids` | My Bids | 3 tabs (Active/Ended/Watching), table/card toggle, filters |

## Tech Stack

- **UI:** Ant Design 5+ (60+ components, Vietnamese locale)
- **State:** Redux Toolkit (auth) + TanStack Query 5 (server data)
- **Routing:** React Router v7
- **Forms:** React Hook Form + Zod
- **HTTP:** Axios
- **i18n:** react-i18next (Vietnamese primary, English secondary)

## Project Structure

```
src/
├── components/
│   ├── auction/       # AuctionCard, BiddingPanel, BidForm, ImageGallery, etc.
│   ├── dashboard/     # StatsRow, WalletSummaryCard, MyActiveBidsTable, etc.
│   ├── wallet/        # BalanceOverview, TransactionHistory, AddFundsModal, etc.
│   ├── mybids/        # ActiveBidsList, EndedBidsList, WatchingList
│   ├── layout/        # AppLayout, PublicLayout, AppHeader, Sidebar
│   └── common/        # ErrorBoundary
├── pages/
│   ├── public/        # HomePage, BrowsePage, AuctionDetailPage, Login, Register
│   ├── dashboard/     # DashboardPage
│   ├── wallet/        # WalletPage
│   └── mybids/        # MyBidsPage
├── hooks/             # useAuctions, useBidding, useWallet, useMyBids, useBreakpoint, etc.
├── services/          # API clients + mock/ data (swap to real API later)
├── types/             # TypeScript definitions (auction, user, wallet, dashboard, etc.)
├── locales/           # vi/common.json, en/common.json
├── routes/            # React Router config
├── store/             # Redux slices
└── utils/             # formatVND, formatCountdown, STATUS_KEYS, etc.
```

## Responsive Design

Uses Ant Design's grid + custom `useBreakpoint()` hook:
- **Mobile** (<768px) — single column, compact lists, Select dropdowns for long labels
- **Tablet** (768–991px) — 2 columns, sidebar hidden (hamburger menu)
- **Desktop** (≥992px) — full layout with 240px sidebar

## Path Aliases

`@/` maps to `src/`:
```ts
import { AuctionCard } from '@/components/auction/AuctionCard';
```

## Data Strategy

Mock data first — all services use `mockDelay()` + static data. When backend is ready, swap the service function bodies. UI code stays unchanged (TanStack Query handles caching/loading/errors).
