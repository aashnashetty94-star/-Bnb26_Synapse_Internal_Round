import { NextResponse } from 'next/server';

// In-memory counters for your hackathon demo
const globalStats = {
  totalUsers: 50000,
  incomingRequests: 2400000,
  seatsAllocated: 483, // Starts close to 500
  humanAllocations: 463,
  botAllocations: 37,
  blockedRequests: 1100000,
  throttled: 120000,
};

// GET endpoint to fetch live metrics for the Admin Dashboard
export async function GET() {
  return NextResponse.json(globalStats);
}

// POST endpoint triggered when someone clicks "Book Ticket Now" or when tests hit it
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const isBot = body.isBot || false;

    // Increment metrics dynamically based on real activity!
    globalStats.incomingRequests += 1;

    if (isBot) {
      globalStats.botAllocations += 1;
      globalStats.blockedRequests += 1;
    } else {
      if (globalStats.seatsAllocated < 500) {
        globalStats.seatsAllocated += 1;
        globalStats.humanAllocations += 1;
      }
    }

    return NextResponse.json({ 
      success: true, 
      seat: `MZP-${Math.floor(Math.random() * 499) + 1}`,
      stats: globalStats 
    });
  } catch {
    return NextResponse.json({ success: false, error: 'Invalid request' }, { status: 400 });
  }
}