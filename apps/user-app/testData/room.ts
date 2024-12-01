export interface Room {
  id: string;
  name: string;
  description: string;
  members: number
}

export const DEMO_ROOMS: Room[] = [
  {
    "id": "1",
    "name": "General Discussion",
    "description": "A place for general chat and discussions",
    "members": 124
  },
  {
    "id": "2",
    "name": "Tech Support",
    "description": "Get help with technical issues and troubleshooting",
    "members": 276
  },
  {
    "id": "3", 
    "name": "Product Updates",
    "description": "Latest news and announcements about our products",
    "members": 512
  },
  {
    "id": "4",
    "name": "Random Memes",
    "description": "Share the funniest and most entertaining memes",
    "members": 345
  },
  {
    "id": "5",
    "name": "Developer Corner",
    "description": "Coding tips, programming languages, and tech discussions",
    "members": 203
  },
  {
    "id": "6",
    "name": "Marketing Insights",
    "description": "Strategies, trends, and marketing best practices",
    "members": 187
  },
  {
    "id": "7",
    "name": "Coffee Break",
    "description": "Casual conversations and team bonding",
    "members": 156
  },
  {
    "id": "8",
    "name": "Design Inspiration",
    "description": "Share creative ideas and design concepts",
    "members": 98
  },
  {
    "id": "9",
    "name": "Career Growth",
    "description": "Professional development and career advice",
    "members": 211
  },
  {
    "id": "10",
    "name": "Global Events",
    "description": "Discussions about international news and current events",
    "members": 267
  }
]
