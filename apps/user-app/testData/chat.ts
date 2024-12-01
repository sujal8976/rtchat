export type Message = {
  id: string;
  userId: string;
  message: string;
  timestamp: string;
  type?: "text" | "image" | "file";
  status?: "sent" | "delivered" | "read";
};

export type User = {
  id: string;
  name: string;
  avatar?: string;
  status: "online" | "offline" | "away";
  role?: string;
};

export const DEMO_USERS: User[] = [
  {
    id: "1",
    name: "Jane Smith",
    status: "online",
    avatar:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=32&h=32&q=80",
  },
  {
    id: "2",
    name: "Michael Johnson",
    status: "offline",
    avatar:
      "https://images.unsplash.com/photo-1506794778202-cad84cf45f1a?w=32&h=32&q=80",
  },
  {
    id: "3",
    name: "Emily Davis",
    status: "online",
    avatar:
      "https://images.unsplash.com/photo-1517841905240-472988babdf7?w=32&h=32&q=80",
  },
  {
    id: "4",
    name: "David Brown",
    status: "offline",
    avatar:
      "https://images.unsplash.com/photo-1568602471122-7b2b1d1c1c9f?w=32&h=32&q=80",
  },
  {
    id: "5",
    name: "Sarah Wilson",
    status: "online",
    avatar:
      "https://images.unsplash.com/photo-1534751516642-a1af1ef26a56?w=32&h=32&q=80",
  },
  {
    id: "6",
    name: "Robert Taylor",
    status: "offline",
    avatar:
      "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=32&h=32&q=80",
  },
  {
    id: "7",
    name: "Amanda Martinez",
    status: "online",
    avatar:
      "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=32&h=32&q=80",
  },
  {
    id: "8",
    name: "Christopher Lee",
    status: "offline",
    avatar:
      "https://images.unsplash.com/photo-1519764622478-6fc6127ba457?w=32&h=32&q=80",
  },
  {
    id: "9",
    name: "Jessica Anderson",
    status: "online",
    avatar:
      "https://images.unsplash.com/photo-1544005313-94ddc0dea70d?w=32&h=32&q=80",
  },
  {
    id: "10",
    name: "Kevin Wright",
    status: "offline",
    avatar:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=32&h=32&q=80",
  },
];

export const DEMO_MESSAGES: Message[] = [
  {
    id: "1",
    userId: "7",
    message: "The latest deployment went smoothly! Great work team 🎉",
    timestamp: "2024-01-10T09:05:00Z",
    status: "delivered",
  },
  {
    id: "2",
    userId: "1",
    message:
      "We need to discuss the Q1 marketing strategy tomorrow. Can everyone join the meeting? 📅",
    timestamp: "2024-02-15T14:30:22Z",
    status: "sent",
  },
  {
    id: "3",
    userId: "5",
    message:
      "Just completed the user interface redesign. What do you all think? 🎨",
    timestamp: "2024-03-22T11:45:37Z",
    status: "read",
  },
  {
    id: "4",
    userId: "9",
    message:
      "Server maintenance scheduled for next Tuesday at midnight. Prepare for potential downtime. ⚠️",
    timestamp: "2024-04-05T16:20:11Z",
    status: "delivered",
  },
  {
    id: "5",
    userId: "2",
    message: "Our new product feature is getting amazing initial feedback! 🚀",
    timestamp: "2024-01-30T10:15:45Z",
    status: "sent",
  },
  {
    id: "6",
    userId: "1",
    message:
      "Can someone help me troubleshoot the database connection issue? 🤔",
    timestamp: "2024-02-28T13:55:29Z",
    status: "read",
  },
  {
    id: "7",
    userId: "6",
    message:
      "Congratulations to the sales team for hitting our quarterly targets! 🏆",
    timestamp: "2024-03-15T08:40:56Z",
    status: "delivered",
  },
  {
    id: "8",
    userId: "4",
    message:
      "New security patches have been deployed across all production environments. 🛡️",
    timestamp: "2024-04-18T17:30:00Z",
    status: "sent",
  },
  {
    id: "9",
    userId: "8",
    message:
      "Team lunch this Friday to celebrate our recent project success! 🍽️",
    timestamp: "2024-02-05T15:10:33Z",
    status: "read",
  },
  {
    id: "10",
    userId: "1",
    message:
      "We're looking for beta testers for our upcoming mobile app. Interested? 📱",
    timestamp: "2024-03-07T12:25:17Z",
    status: "delivered",
  },
];
