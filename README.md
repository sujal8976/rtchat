# RtChat v2

RtChat v2 is a purely room-based real-time chat system. It allows users to create and join chat rooms. The system is designed to be fast and performant.

## Features
- **Room-based real-time communication**: Users can join any room and chat in real time.
- **Accessible**: Anyone can join.
- **Fast and performant**: Built with optimized tech stacks for speed and reliability.

---

## Tech Stack
- **Monorepo**: Managed with Turborepo for efficient development.
- **Frontend & HTTP Server**: Built with Next.js.
- **Styling**: Tailwind CSS for rapid UI development.
- **WebSocket Server**: Implemented using the `ws` library in Node.js.
- **Database**: PostgreSQL for robust and reliable data storage.
- **ORM**: Prisma for database schema management and query building.
- **State Management**: Zustand for simple and flexible client-side state handling.

---

## System Design
The development of RtChat v2 adheres to several fundamental and efficient system design principles to ensure reliability, performance, and maintainability:

- **Debouncing**: Implemented to prevent redundant API calls during rapid user actions, enhancing responsiveness and reducing server load.
- **Infinite Scrolling**: Used in chat history views to load data progressively as the user scrolls, ensuring a smooth user experience.
- **Singleton Pattern**: Applied to manage WebSocket connections both on the frontend and backend, ensuring a single active connection per client and reducing resource usage.
- **Database Indexing**: Added indexes to frequently queried fields to optimize database performance and reduce query latency.
- **Separation of Concerns**: Clearly divided responsibilities among different components and services for better maintainability.
- **Retry and Fallback Mechanisms**: Incorporated retries for transient failures in WebSocket communication, with appropriate fallback strategies.
- **Efficient State Management**: Utilized lightweight state management library `zustand` to manage application state seamlessly without unnecessary overhead.

---

## Installation Guide

### Use node version v22.12.0(lts).

### Step 1: Set up the project directory
```bash
mkdir rtchat
cd rtchat
git clone https://github.com/sujal8976/rtchat.git .
```

### Step 2: Install dependencies
Make sure you have `pnpm` installed globally. If not, install it using:
```bash
npm install -g pnpm
```
Then, install project dependencies:
```bash
pnpm install
```

### Step 3: Configure environment variables
Add environment variables for each app. Refer to the `.env.example` file in the respective directories for guidance.

#### apps/web/.env
```env
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=test
AUTH_TRUST_HOST=http://localhost:3000
WS_URL=ws://localhost:5000
JWT_SECRET=your-256-bit-secret
NEXT_PUBLIC_WS_URL=ws://localhost:5000
```

#### apps/ws/.env
```env
JWT_SECRET=your-256-bit-secret
PORT=5000
```

#### packages/db/.env
```env
DATABASE_URL="postgres://postgres:@localhost:5432/rtchat"
```

### Step 4: Run Prisma migrations
Apply the database migrations:
```bash
pnpm run prisma:migrate
```

### Step 5: Generate Prisma client
Generate the Prisma client for database interactions:
```bash
pnpm run prisma:generate
```

### Step 6: Seed the database
Populate the database with initial data:
```bash
pnpm run prisma:seed
```

### Step 7: Start the development server
Start both the frontend and WebSocket servers:
```bash
pnpm run dev
```

---

## Known Issues

### Issue: Refresh required after login
After logging in, users may need to refresh the page to see updated session data. This occurs due to a known issue in `next-auth` v5 (beta), where server-side updates happen immediately but client-side updates lag.

#### Why does this happen?
When a user logs in, the session is updated server-side, but the client-side session state isn't immediately refreshed. This issue is tracked in the following GitHub discussion:
[NextAuth.js Issue #11034](https://github.com/nextauthjs/next-auth/issues/11034)

#### Current Workaround
We are actively exploring solutions, including switching away from `next-auth` or implementing custom authentication logic.

---

## Feedback & Contributions
Thank you for exploring RtChat v2! We value your feedback, bug reports, and suggestions for improvement. Feel free to share your experience and let us know what works well and what could be improved.

---

Happy chatting! 🚀

