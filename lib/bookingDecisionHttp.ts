import { applyShootDecision, previewShootDecision } from "./bookingRequests";
import { renderDecisionPage, type DecisionAction } from "./bookingDecisionPage";

function htmlResponse(body: string) {
  return new Response(body, {
    status: 200,
    headers: {
      "Content-Type": "text/html; charset=utf-8",
      "Cache-Control": "no-store",
      "Referrer-Policy": "no-referrer",
      "X-Content-Type-Options": "nosniff",
      "X-Robots-Tag": "noindex, nofollow",
      "Content-Security-Policy":
        "default-src 'none'; style-src 'unsafe-inline' https://fonts.googleapis.com; font-src https://fonts.gstatic.com; base-uri 'none'; form-action 'self'",
    },
  });
}

function failurePage() {
  return htmlResponse(renderDecisionPage({ state: "failed", rows: null }));
}

export async function respondToDecisionGet(action: DecisionAction, request: Request) {
  const token = new URL(request.url).searchParams.get("token") ?? "";
  try {
    return htmlResponse(renderDecisionPage(await previewShootDecision(action, token)));
  } catch (error) {
    console.error("Booking decision page failed:", error instanceof Error ? error.message : "decision failed");
    return failurePage();
  }
}

export async function respondToDecisionPost(action: DecisionAction, request: Request) {
  let token = "";
  try {
    const form = await request.formData();
    const value = form.get("token");
    token = typeof value === "string" ? value : "";
  } catch (error) {
    console.error("Booking decision form could not be read:", error instanceof Error ? error.message : "form failed");
  }

  try {
    return htmlResponse(renderDecisionPage(await applyShootDecision(action, token)));
  } catch (error) {
    console.error("Booking decision failed:", error instanceof Error ? error.message : "decision failed");
    return failurePage();
  }
}
