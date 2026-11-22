import type { Metadata } from "next";
import { headers } from "next/headers";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import ResetPasswordForm, { ResetPasswordFallback } from "../../../components/Auth/ResetPasswordForm";
import { isLocale } from "../../../lib/i18n/config";
import { buildPasswordFlowMetadata } from "../../../lib/i18n/seo";

type PageProps = {
  params: Promise<{ locale: string }>;
};

function requestHost(headerStore: Headers) {
  const raw = headerStore.get("x-forwarded-host") ?? headerStore.get("host") ?? "";
  return raw.split(",")[0]?.trim() ?? "";
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  return buildPasswordFlowMetadata(locale, "reset-password", requestHost(await headers()));
}

export default async function ResetPasswordPage({ params }: PageProps) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  return (
    <Suspense fallback={<ResetPasswordFallback />}>
      <ResetPasswordForm />
    </Suspense>
  );
}
