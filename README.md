# RtChat v2: Your Flexible Real-Time Chat Platform 💬🌐

## Overview
RtChat v2 is a powerful, room-based real-time chat application. Designed for seamless interaction, it offers both public and private chat rooms, catering to diverse communication needs.

## Live Demo
🌐 **Access RtChat v2**
- **Web App**: [https://rtchat.thesujal.buzz](https://rtchat.thesujal.buzz)
- **Status**: Active and Open for Users 🟢

## Key Features
🌟 **Versatile Room-Based Communication**
- Create and join multiple chat rooms
- Choose between **public** and **private** room options
- Instant, real-time messaging across rooms

🔒 **Flexible Access Controls**
- Public rooms: Open to all users
- Private rooms: Need room's private key

⚡ **High-Performance Architecture**
- Low-latency communication
- Optimized for smooth user experience
- Scalable design supporting multiple concurrent users

## Tech Stack
- **Monorepo**: Turborepo
- **Frontend**: Next.js
- **Styling**: Tailwind CSS
- **WebSocket**: Node.js `ws` library
- **Database**: PostgreSQL
- **ORM**: Prisma
- **State Management**: Zustand
- **Type Safety**: Zod

## System Design Principles
💡 **Smart Architecture**
- Debouncing to prevent redundant API calls
- Infinite scrolling for efficient chat history
- Singleton WebSocket connection management
- Optimized database indexing
- Robust retry and fallback mechanisms
- Real-time sending/sent status tracking
- Room members joined/online/offline/left status tracking

## Installation Guide
### Prerequisites
- Node.js v22.12.0 (LTS)
- PostgreSQL
- pnpm package manager

### Quick Setup
1. Clone the repository
```bash
git clone https://github.com/sujal8976/rtchat.git
cd rtchat
```

2. Install dependencies
```bash
npm install -g pnpm
pnpm install
```

3. Configure environment variables
- Refer to `.env.example` in each app directory
- Set up database, authentication, and WebSocket configurations

4. Database Setup
```bash
pnpm run prisma:migrate
pnpm run prisma:generate
pnpm run prisma:seed
```

5. Start Development Server
```bash
pnpm run dev
```

## Room Types
### Public Rooms
- Open to all registered users
- Discover and join rooms based on interests
- No invitation required

### Private Rooms
- Invite-only access
- Required private room key

## Getting Started
1. Register an account
2. Explore public rooms
3. Create your own rooms (public or private)
4. Invite friends to private rooms
5. Start chatting!

Happy Chatting! 🚀🌈