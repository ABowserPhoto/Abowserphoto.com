import { respondToDecisionGet, respondToDecisionPost } from "../../../../lib/bookingDecisionHttp";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export function GET(request: Request) {
  return respondToDecisionGet("approve", request);
}

export function POST(request: Request) {
  return respondToDecisionPost("approve", request);
}
