"use client";

import HTMLFlipBook from "react-pageflip";
import { forwardRef, type ComponentProps } from "react";

/** Client-only wrapper so Next can dynamic-import with a working ref. */
const MagazineFlipBook = forwardRef<unknown, ComponentProps<typeof HTMLFlipBook>>(
  function MagazineFlipBook(props, ref) {
    return <HTMLFlipBook ref={ref} {...props} />;
  }
);

export default MagazineFlipBook;
