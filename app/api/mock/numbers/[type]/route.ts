import { NextResponse } from "next/server";

// Mock data for testing when the real backend is not available
const mockData = {
  p: {
    windowPrevState: [],
    windowCurrState: [1, 3, 5, 7],
    numbers: [1, 3, 5, 7],
    avg: 4.0,
  },
  f: {
    windowPrevState: [],
    windowCurrState: [1, 1, 2, 3, 5, 8],
    numbers: [1, 1, 2, 3, 5, 8],
    avg: 3.33,
  },
  e: {
    windowPrevState: [2, 4, 6, 8],
    windowCurrState: [10, 12, 14, 16, 18, 20],
    numbers: [2, 4, 6, 8, 10, 12, 14, 16, 18, 20],
    avg: 11.0,
  },
  r: {
    windowPrevState: [5, 10, 15],
    windowCurrState: [20, 25, 30, 35, 40],
    numbers: [5, 10, 15, 20, 25, 30, 35, 40],
    avg: 22.5,
  },
};

// ✅ Correct way to access params from App Router
export async function GET(request: Request, context: { params: { type: string } }) {
  const { type } = context.params;

  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 500));

  if (!["p", "f", "e", "r"].includes(type)) {
    return NextResponse.json(
      { error: "Invalid number type. Use p, f, e, or r." },
      { status: 400 }
    );
  }

  // Return mock data based on the requested type
  return NextResponse.json(mockData[type as keyof typeof mockData]);
}