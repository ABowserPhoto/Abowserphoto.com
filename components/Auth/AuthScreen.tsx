"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import type { ReactNode } from "react";
import { withLocale } from "../../lib/i18n/config";
import { useDictionary, useLocale } from "../../lib/i18n/LocaleProvider";

export default function AuthScreen({ children }: { children: ReactNode }) {
  const { locale } = useLocale();
  const { auth } = useDictionary();

  return (
    <motion.main
      className="flex min-h-screen items-center justify-center bg-black/80 p-4 backdrop-blur-sm"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.22, ease: "easeOut" }}
    >
      <motion.div
        className="relative max-h-[90vh] w-full max-w-2xl overflow-y-auto border border-gray-800 bg-black px-6 py-10 sm:px-10 sm:py-12"
        initial={{ opacity: 0, y: 16, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.22, ease: "easeOut" }}
      >
        <Link
          href={withLocale("/", locale)}
          aria-label={auth.close}
          className="absolute right-4 top-4 z-10 flex h-10 w-10 items-center justify-center border border-gray-800 text-lg leading-none text-[#F4F1ED] transition-colors duration-300 hover:border-[#F4F1ED]/60"
        >
          X
        </Link>
        {children}
      </motion.div>
    </motion.main>
  );
}
