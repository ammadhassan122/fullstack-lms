import { PortableText, type PortableTextComponents } from "@portabletext/react";
import type { TypedObject } from "@portabletext/types";
import { urlFor } from "@/sanity/lib/image";
import Image from "next/image";

const components: PortableTextComponents = {
  block: {
    h1: ({ children }) => (
      <h1 className="text-3xl font-black mt-8 mb-4 text-foreground first:mt-0">
        {children}
      </h1>
    ),
    h2: ({ children }) => (
      <h2 className="text-2xl font-bold mt-6 mb-3 text-foreground">{children}</h2>
    ),
    h3: ({ children }) => (
      <h3 className="text-xl font-semibold mt-5 mb-2 text-foreground">{children}</h3>
    ),
    h4: ({ children }) => (
      <h4 className="text-lg font-semibold mt-4 mb-2 text-foreground">{children}</h4>
    ),
    normal: ({ children }) => (
      <p className="text-foreground/90 leading-relaxed mb-4 text-base">{children}</p>
    ),
    blockquote: ({ children }) => (
      <blockquote className="rounded-xl border-2 border-sky-200 bg-pastel-sky/70 px-5 py-4 my-4 text-sky-950 text-base leading-relaxed [&_em]:text-sky-900 [&_em]:not-italic [&_strong]:text-sky-950">
        {children}
      </blockquote>
    ),
  },
  list: {
    bullet: ({ children }) => (
      <ul className="list-disc list-inside space-y-2 mb-4 text-foreground/90">
        {children}
      </ul>
    ),
    number: ({ children }) => (
      <ol className="list-decimal list-inside space-y-2 mb-4 text-foreground/90">
        {children}
      </ol>
    ),
  },
  listItem: {
    bullet: ({ children }) => <li className="ml-2">{children}</li>,
    number: ({ children }) => <li className="ml-2">{children}</li>,
  },
  marks: {
    strong: ({ children }) => (
      <strong className="font-bold text-foreground">{children}</strong>
    ),
    em: ({ children }) => (
      <em className="italic text-foreground/85">{children}</em>
    ),
    code: ({ children }) => (
      <code className="bg-pastel-sky/80 px-1.5 py-0.5 rounded text-sm text-sky-900 font-mono border border-sky-200">
        {children}
      </code>
    ),
    link: ({ children, value }) => (
      <a
        href={value?.href}
        target="_blank"
        rel="noopener noreferrer"
        className="text-sky-700 hover:text-sky-900 font-semibold underline underline-offset-2 transition-colors"
      >
        {children}
      </a>
    ),
  },
  types: {
    image: ({ value }) => {
      if (!value?.asset) {
        return null;
      }

      const imageUrl = urlFor(value).width(1200).auto("format").url();

      return (
        <figure className="my-6">
          <div className="relative w-full aspect-video rounded-lg overflow-hidden bg-pastel-sky/40 border-2 border-sky-200">
            <Image
              src={imageUrl}
              alt={value.alt || "Lesson image"}
              fill
              className="object-contain"
            />
          </div>
          {value.caption && (
            <figcaption className="text-sm text-muted-foreground mt-2 text-center italic">
              {value.caption}
            </figcaption>
          )}
        </figure>
      );
    },
  },
};

interface LessonContentProps {
  content: TypedObject[] | null | undefined;
}

export function LessonContent({ content }: LessonContentProps) {
  if (!content || content.length === 0) {
    return null;
  }

  return (
    <div className="prose prose-slate max-w-none">
      <PortableText value={content} components={components} />
    </div>
  );
}
