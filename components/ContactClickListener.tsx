"use client";

import { useEffect } from "react";
import { installContactClickListener } from "../lib/analytics";

/** Site-wide tel: and mailto: clicks. Mounted once from the root layout. */
export default function ContactClickListener() {
  useEffect(() => installContactClickListener(), []);
  return null;
}
