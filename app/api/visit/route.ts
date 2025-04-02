import { NextRequest } from "next/server";

interface VisitRequestBody {
  vendorId: string;
  visitor?: {
    walletAddress?: string;
    name?: string;
    ip?: string;
    device?: {
      type?: string;
      os?: string;
      browser?: string;
      resolution?: string;
    };
  };
}

export async function POST(request: NextRequest) {
  const res: VisitRequestBody = await request.json();

  return Response.json({ name: res.visitor?.name });
}
