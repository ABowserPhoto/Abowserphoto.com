"use server";

import { createClient } from "../lib/supabase/server";

export type ClientBookingRecord = {
  id: string;
  title: string;
  photoshootDate: string | null;
  shootLocation: string | null;
  status: string;
  googleDriveLink: string | null;
  galleryLink: string | null;
  invoiceDate: string | null;
  invoicePaid: boolean;
  hasInvoice: boolean;
};

function sortBookings(a: ClientBookingRecord, b: ClientBookingRecord) {
  const dateA = a.photoshootDate ?? "";
  const dateB = b.photoshootDate ?? "";
  if (dateA !== dateB) {
    return dateB.localeCompare(dateA);
  }

  const addressA = (a.shootLocation || a.title || "").toLocaleLowerCase();
  const addressB = (b.shootLocation || b.title || "").toLocaleLowerCase();
  return addressA.localeCompare(addressB);
}

export async function getClientBookings(): Promise<{
  success: boolean;
  bookings: ClientBookingRecord[];
  message?: string;
}> {
  const supabase = await createClient();
  const { data: userData, error: userError } = await supabase.auth.getUser();
  if (userError || !userData.user) {
    return { success: false, bookings: [], message: "Please sign in to view your bookings." };
  }

  const { data: client, error: clientError } = await supabase
    .from("clients")
    .select("id")
    .eq("user_id", userData.user.id)
    .maybeSingle();

  if (clientError) {
    return { success: false, bookings: [], message: clientError.message };
  }

  if (!client?.id) {
    return { success: true, bookings: [] };
  }

  const { data: tasks, error: tasksError } = await supabase
    .from("tasks")
    .select(
      "id, title, photoshoot_date, shoot_location, status, google_drive_link, gallery_link, invoice_date, invoice_paid, lexoffice_document_file_id, lexoffice_invoice_id, credit_note_file_url"
    )
    .eq("client_id", client.id);

  if (tasksError) {
    return { success: false, bookings: [], message: tasksError.message };
  }

  const bookings = (tasks ?? [])
    .map((task) => ({
      id: task.id,
      title: task.title,
      photoshootDate: task.photoshoot_date,
      shootLocation: task.shoot_location,
      status: task.status,
      googleDriveLink: task.google_drive_link,
      galleryLink: task.gallery_link,
      invoiceDate: task.invoice_date,
      invoicePaid: Boolean(task.invoice_paid),
      hasInvoice: Boolean(
        task.credit_note_file_url || task.lexoffice_document_file_id || task.lexoffice_invoice_id
      ),
    }))
    .sort(sortBookings);

  return { success: true, bookings };
}
