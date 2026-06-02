"use client";

import React from "react";
import { ArrayOfObjectsInputProps } from "sanity";/**
 * Portable Text Input
 * Uses Sanity's native array input renderer, which handles:
 * - Block editing (headings, paragraphs, etc.)
 * - Inline decorators (bold, italic, etc.)
 * - Image blocks
 * - Automatic UI and toolbar generation
 *
 * This replaces the broken @portabletext/toolbar package with
 * Sanity's stable, production-ready input components.
 */
export function PortableTextInput(props: ArrayOfObjectsInputProps) {
  const { renderDefault } = props;

  return (
    <div className="sanity-portable-text-input">
      {/* Sanity's native array input handles all rendering and editing */}
      {renderDefault(props)}
    </div>
  );
}

export default PortableTextInput;
