import { NextResponse } from "next/server";
import { createClient } from "../../../../lib/supabase/server";

type RouteContext = {
  params: Promise<{ taskId: string }>;
};

export async function GET(_request: Request, context: RouteContext) {
  const { taskId } = await context.params;
  if (!taskId) {
    return NextResponse.json({ error: "Missing task id." }, { status: 400 });
  }

  const supabase = await createClient();
  const { data: userData, error: userError } = await supabase.auth.getUser();
  if (userError || !userData.user) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  const { data: client } = await supabase
    .from("clients")
    .select("id")
    .eq("user_id", userData.user.id)
    .maybeSingle();

  if (!client?.id) {
    return NextResponse.json({ error: "Client profile not found." }, { status: 404 });
  }

  const { data: task, error: taskError } = await supabase
    .from("tasks")
    .select("id, title, credit_note_file_url, lexoffice_document_file_id, client_id")
    .eq("id", taskId)
    .eq("client_id", client.id)
    .maybeSingle();

  if (taskError || !task) {
    return NextResponse.json({ error: "Invoice not found." }, { status: 404 });
  }

  if (task.credit_note_file_url) {
    return NextResponse.redirect(task.credit_note_file_url);
  }

  const fileId = task.lexoffice_document_file_id;
  const apiKey = process.env.LEXOFFICE_API_KEY;
  if (!fileId || !apiKey) {
    return NextResponse.json(
      { error: "Invoice file is not available for download yet." },
      { status: 404 }
    );
  }

  try {
    const response = await fetch(`https://api.lexoffice.io/v1/files/${fileId}`, {
      headers: {
        Authorization: `Bearer ${apiKey}`,
        Accept: "application/pdf",
      },
      cache: "no-store",
    });

    if (!response.ok) {
      const detail = await response.text();
      console.error("Lexoffice invoice download failed:", response.status, detail);
      return NextResponse.json({ error: "Could not download invoice." }, { status: 502 });
    }

    const bytes = await response.arrayBuffer();
    const safeName = (task.title || "invoice")
      .replace(/[^\w\-]+/g, "_")
      .replace(/_+/g, "_")
      .slice(0, 80);

    return new NextResponse(bytes, {
      status: 200,
      headers: {
        "Content-Type": response.headers.get("Content-Type") || "application/pdf",
        "Content-Disposition": `attachment; filename="${safeName || "invoice"}.pdf"`,
        "Cache-Control": "private, no-store",
      },
    });
  } catch (error) {
    console.error("Lexoffice invoice download error:", error);
    return NextResponse.json({ error: "Could not download invoice." }, { status: 500 });
  }
}
