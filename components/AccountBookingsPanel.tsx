"use client";

import type { ClientBookingRecord } from "../actions/getClientBookings";

function formatDate(value: string | null) {
  if (!value) return "Date TBD";
  const date = new Date(`${value}T12:00:00`);
  if (Number.isNaN(date.getTime())) return value;
  return new Intl.DateTimeFormat("de-DE", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(date);
}

function projectLabel(booking: ClientBookingRecord) {
  return booking.shootLocation?.trim() || booking.title || "Photoshoot";
}

type AccountBookingsPanelProps = {
  bookings: ClientBookingRecord[];
  mode: "bookings" | "invoices";
  emptyMessage: string;
};

export default function AccountBookingsPanel({
  bookings,
  mode,
  emptyMessage,
}: AccountBookingsPanelProps) {
  const items =
    mode === "invoices" ? bookings.filter((booking) => booking.hasInvoice) : bookings;

  if (items.length === 0) {
    return (
      <div className="border border-gray-800 bg-[#1A1A1A] px-4 py-8 text-center text-sm text-[#F4F1ED]/70">
        {emptyMessage}
      </div>
    );
  }

  return (
    <ul className="space-y-3">
      {items.map((booking) => {
        const driveHref = booking.googleDriveLink || booking.galleryLink;
        return (
          <li
            key={booking.id}
            className="border border-gray-800 bg-[#1A1A1A] px-4 py-4 sm:px-5"
          >
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
              <div className="min-w-0">
                <p className="text-xs uppercase tracking-[0.14em] text-[#F4F1ED]/55">
                  {formatDate(booking.photoshootDate)}
                </p>
                <p className="mt-2 text-sm font-medium text-[#F4F1ED] sm:text-base">
                  {projectLabel(booking)}
                </p>
                {booking.shootLocation && booking.title !== booking.shootLocation ? (
                  <p className="mt-1 truncate text-xs text-[#F4F1ED]/55">{booking.title}</p>
                ) : null}
                <p className="mt-2 text-[11px] uppercase tracking-[0.14em] text-[#F4F1ED]/45">
                  {booking.status}
                  {mode === "invoices"
                    ? booking.invoicePaid
                      ? " · Paid"
                      : " · Unpaid"
                    : null}
                </p>
              </div>

              <div className="flex flex-wrap gap-2 sm:justify-end">
                {mode === "bookings" && driveHref ? (
                  <a
                    href={driveHref}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex border border-gray-700 px-3 py-2 text-[11px] font-semibold uppercase tracking-[0.14em] text-[#F4F1ED] transition-colors hover:border-[#F4F1ED]/60"
                  >
                    Google Drive
                  </a>
                ) : null}
                {mode === "bookings" && booking.hasInvoice ? (
                  <a
                    href={`/api/client-invoices/${booking.id}`}
                    className="inline-flex border border-gray-700 px-3 py-2 text-[11px] font-semibold uppercase tracking-[0.14em] text-[#F4F1ED] transition-colors hover:border-[#F4F1ED]/60"
                  >
                    Download Invoice
                  </a>
                ) : null}
                {mode === "invoices" && booking.hasInvoice ? (
                  <a
                    href={`/api/client-invoices/${booking.id}`}
                    className="inline-flex border border-[#F4F1ED] bg-[#F4F1ED] px-3 py-2 text-[11px] font-semibold uppercase tracking-[0.14em] text-black transition-opacity hover:opacity-90"
                  >
                    Download Invoice
                  </a>
                ) : null}
                {mode === "bookings" && !driveHref && !booking.hasInvoice ? (
                  <span className="self-center text-xs text-[#F4F1ED]/45">Files pending</span>
                ) : null}
              </div>
            </div>
          </li>
        );
      })}
    </ul>
  );
}
