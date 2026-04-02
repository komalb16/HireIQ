import { Resume, AppStatus } from "@/types";

export const MOCK_RESUMES: Resume[] = [
  {
    id: "demo-1",
    name: "Software_Engineer_Master.pdf",
    content: "Building scalable distributed systems with Node.js and React. Specialized in cloud-native architectures.",
    lastModified: new Date().toISOString(),
    isActive: true,
  },
  {
    id: "demo-2",
    name: "Product_Manager_Lead.pdf",
    content: "Experienced product leader with 10+ years in SaaS and B2B platforms. Skilled in market research and data-driven strategy.",
    lastModified: new Date().toISOString(),
    isActive: false,
  }
];

export const MOCK_APPS: AppStatus[] = [
  {
    id: "app-1",
    title: "Senior Software Engineer",
    company: "Google",
    status: "Interviewing",
    date: new Date().toLocaleDateString(),
    notes: "Round 2 completed. Focusing on system design next.",
    addedAt: Date.now()
  },
  {
    id: "app-2",
    title: "Full Stack Developer",
    company: "Stripe",
    status: "Applied",
    date: new Date().toLocaleDateString(),
    addedAt: Date.now()
  },
  {
    id: "app-3",
    title: "Engineering Manager",
    company: "Meta",
    status: "Rejected",
    date: new Date().toLocaleDateString(),
    addedAt: Date.now()
  },
  {
    id: "app-4",
    title: "Cloud Architect",
    company: "Snowflake",
    status: "Offer Received",
    date: new Date().toLocaleDateString(),
    addedAt: Date.now()
  }
];
