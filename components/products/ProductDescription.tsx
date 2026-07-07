import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import type { Components } from "react-markdown";

interface ProductDescriptionProps {
  content: string;
}

function isSafeHref(href: string | undefined): boolean {
  if (!href) return false;
  return href.startsWith("https://") || href.startsWith("http://") || href.startsWith("/") || href.startsWith("#");
}

function isSafeImageSrc(src: unknown): src is string {
  if (typeof src !== "string") return false;
  return src.startsWith("https://") || src.startsWith("http://");
}

// Track ordered list context via a simple counter per ol render.
// Each ol re-mounts its children, so index tracking resets naturally.
let olCounter = 0;

const components: Components = {
  // Markdown h1 → h2 (page h1 is the product name). Larger size for visual distinction.
  h1: ({ children }) => (
    <h2 className="text-2xl font-bold text-gray-900 mt-10 mb-4 first:mt-0 flex items-center gap-3">
      <span className="w-1 h-7 bg-primary-500 rounded-full flex-shrink-0" />
      {children}
    </h2>
  ),
  // Markdown h2 → h3, slightly smaller.
  h2: ({ children }) => (
    <h3 className="text-xl font-bold text-gray-900 mt-10 mb-4 first:mt-0 flex items-center gap-3">
      <span className="w-1 h-6 bg-primary-500 rounded-full flex-shrink-0" />
      {children}
    </h3>
  ),
  h3: ({ children }) => (
    <h4 className="text-base font-semibold text-gray-900 mt-8 mb-3 first:mt-0">
      {children}
    </h4>
  ),
  h4: ({ children }) => (
    <h5 className="text-sm font-semibold text-gray-700 mt-6 mb-2 uppercase tracking-wide first:mt-0">
      {children}
    </h5>
  ),
  p: ({ children }) => (
    <p className="text-[15px] text-gray-700 leading-[1.8] mb-4 last:mb-0">
      {children}
    </p>
  ),
  ul: ({ children }) => (
    <ul className="space-y-2.5 mb-5 last:mb-0">
      {children}
    </ul>
  ),
  ol: ({ children }) => {
    olCounter = 0;
    return (
      <ol className="space-y-2.5 mb-5 last:mb-0">
        {children}
      </ol>
    );
  },
  li: ({ children, node }) => {
    const isOrdered = node?.position ? false : false; // Can't determine from node alone
    // Detect if parent is ol by checking if olCounter was reset
    // react-markdown renders li sequentially within their parent,
    // so we use a simple approach: check the parent tag from node
    const parentTag = (node as { parentNode?: { tagName?: string } })?.parentNode?.tagName;
    const ordered = parentTag === "ol";

    if (ordered) {
      olCounter += 1;
      return (
        <li className="flex items-start gap-3 text-[15px] text-gray-700 leading-relaxed">
          <span className="flex-shrink-0 w-6 h-6 rounded-full bg-primary-50 text-primary-600 text-xs font-semibold flex items-center justify-center mt-0.5">
            {olCounter}
          </span>
          <span className="flex-1">{children}</span>
        </li>
      );
    }

    return (
      <li className="flex items-start gap-3 text-[15px] text-gray-700 leading-relaxed">
        <span className="flex-shrink-0 mt-2">
          <svg className="w-4 h-4 text-primary-500" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
          </svg>
        </span>
        <span className="flex-1">{children}</span>
      </li>
    );
  },
  blockquote: ({ children }) => (
    <div className="my-6 bg-primary-50/50 border border-primary-100 rounded-xl px-5 py-4 flex gap-3">
      <svg className="w-5 h-5 text-primary-500 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
      </svg>
      <div className="text-sm text-primary-900/80 leading-relaxed [&>p]:mb-0">{children}</div>
    </div>
  ),
  a: ({ href, children }) => {
    const isExternal = href?.startsWith("http://") || href?.startsWith("https://");
    const safeHref = isSafeHref(href) ? href : undefined;

    return (
      <a
        href={safeHref}
        target={isExternal ? "_blank" : undefined}
        rel={isExternal ? "noopener noreferrer" : undefined}
        className="text-primary-600 font-medium hover:text-primary-700 transition-colors inline-flex items-center gap-0.5"
      >
        {children}
        {isExternal && (
          <svg className="w-3.5 h-3.5 opacity-60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
          </svg>
        )}
      </a>
    );
  },
  strong: ({ children }) => (
    <strong className="font-semibold text-gray-900">{children}</strong>
  ),
  em: ({ children }) => (
    <span className="font-medium text-gray-600">{children}</span>
  ),
  hr: () => (
    <div className="my-8 flex items-center gap-4">
      <div className="flex-1 h-px bg-gray-100" />
      <div className="flex gap-1">
        <span className="w-1.5 h-1.5 bg-gray-200 rounded-full" />
        <span className="w-1.5 h-1.5 bg-gray-200 rounded-full" />
        <span className="w-1.5 h-1.5 bg-gray-200 rounded-full" />
      </div>
      <div className="flex-1 h-px bg-gray-100" />
    </div>
  ),
  img: ({ src, alt }) => {
    if (!isSafeImageSrc(src)) {
      return alt ? <span className="text-sm text-gray-400">[{alt}]</span> : null;
    }
    return (
      <figure className="my-6">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={src}
          alt={alt || ""}
          className="w-full rounded-xl object-cover bg-gray-50"
          referrerPolicy="no-referrer"
          loading="lazy"
        />
        {alt && (
          <figcaption className="mt-2 text-center text-xs text-gray-400">{alt}</figcaption>
        )}
      </figure>
    );
  },
  table: ({ children }) => (
    <div className="my-6 overflow-x-auto rounded-xl border border-gray-100">
      <table className="w-full text-sm">{children}</table>
    </div>
  ),
  thead: ({ children }) => (
    <thead className="bg-gray-50 border-b border-gray-100">{children}</thead>
  ),
  th: ({ children }) => (
    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
      {children}
    </th>
  ),
  td: ({ children }) => (
    <td className="px-4 py-3 text-gray-700 border-t border-gray-50">{children}</td>
  ),
  code: ({ className, children, node }) => {
    // Fenced code blocks: has language class OR is direct child of <pre>
    const isBlock = className?.includes("language-") ||
      (node as { parentNode?: { tagName?: string } })?.parentNode?.tagName === "pre";
    if (isBlock) {
      return (
        <code className={`${className ?? ""} text-sm`}>
          {children}
        </code>
      );
    }
    return (
      <code className="text-sm font-medium text-primary-700 bg-primary-50/60 px-1.5 py-0.5 rounded">
        {children}
      </code>
    );
  },
  pre: ({ children }) => (
    <div className="my-6 rounded-xl overflow-hidden border border-gray-200 bg-gray-900">
      <pre className="p-4 overflow-x-auto text-sm leading-relaxed text-gray-100">
        {children}
      </pre>
    </div>
  ),
};

export function ProductDescription({ content }: ProductDescriptionProps) {
  return (
    <div className="product-description">
      <ReactMarkdown remarkPlugins={[remarkGfm]} components={components}>
        {content}
      </ReactMarkdown>
    </div>
  );
}
