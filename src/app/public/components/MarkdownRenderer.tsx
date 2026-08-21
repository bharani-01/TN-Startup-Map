import React, { useState } from 'react';
import { Copy, Check, ExternalLink } from 'lucide-react';

interface MarkdownRendererProps {
  content: string;
  className?: string;
}

export const MarkdownRenderer: React.FC<MarkdownRendererProps> = ({ content, className = '' }) => {
  const [copiedCodeIdx, setCopiedCodeIdx] = useState<number | null>(null);

  const handleCopyCode = (code: string, idx: number) => {
    navigator.clipboard.writeText(code);
    setCopiedCodeIdx(idx);
    setTimeout(() => setCopiedCodeIdx(null), 2000);
  };

  // Helper to parse inline Markdown: **bold**, *italic*, `code`, [link](url), ~~strike~~
  const parseInlineMarkdown = (text: string): React.ReactNode[] => {
    // Tokenize by inline markers
    const tokens: React.ReactNode[] = [];
    let remaining = text;
    let keyIdx = 0;

    // Combined regex for inline elements:
    // 1. Bold: **text** or __text__
    // 2. Italic: *text* or _text_
    // 3. Code: `text`
    // 4. Link: [text](url)
    // 5. Strikethrough: ~~text~~
    const inlineRegex = /(\*\*|__)(.*?)\1|(\*|_)(.*?)\3|(`)(.*?)\5|(\[)(.*?)\]\((.*?)\)|(~~)(.*?)\10/g;

    let lastIndex = 0;
    let match: RegExpExecArray | null;

    while ((match = inlineRegex.exec(text)) !== null) {
      // Push preceding raw text
      if (match.index > lastIndex) {
        tokens.push(text.slice(lastIndex, match.index));
      }

      const fullMatch = match[0];
      const boldText = match[2];
      const italicText = match[4];
      const codeText = match[6];
      const linkText = match[8];
      const linkUrl = match[9];
      const strikeText = match[11];

      if (boldText !== undefined) {
        tokens.push(
          <strong key={`b-${keyIdx++}`} className="font-bold text-[#1D1D1F]">
            {parseInlineMarkdown(boldText)}
          </strong>
        );
      } else if (italicText !== undefined) {
        tokens.push(
          <em key={`i-${keyIdx++}`} className="italic text-[#1D1D1F]">
            {parseInlineMarkdown(italicText)}
          </em>
        );
      } else if (codeText !== undefined) {
        tokens.push(
          <code
            key={`c-${keyIdx++}`}
            className="px-1.5 py-0.5 rounded-md bg-black/[0.06] text-[#0071E3] font-mono text-xs sm:text-[13px] font-semibold border border-black/[0.05]"
          >
            {codeText}
          </code>
        );
      } else if (linkText !== undefined && linkUrl !== undefined) {
        tokens.push(
          <a
            key={`a-${keyIdx++}`}
            href={linkUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-[#0071E3] font-semibold underline hover:text-[#0077ED] inline-flex items-center gap-0.5 transition-colors"
          >
            <span>{linkText}</span>
            <ExternalLink className="w-3 h-3 text-[#0071E3]/70" />
          </a>
        );
      } else if (strikeText !== undefined) {
        tokens.push(
          <del key={`d-${keyIdx++}`} className="line-through text-[#86868B]">
            {parseInlineMarkdown(strikeText)}
          </del>
        );
      } else {
        tokens.push(fullMatch);
      }

      lastIndex = match.index + fullMatch.length;
    }

    if (lastIndex < text.length) {
      tokens.push(text.slice(lastIndex));
    }

    return tokens.length > 0 ? tokens : [text];
  };

  // Block parser
  const renderBlocks = () => {
    const rawLines = content.split('\n');
    const elements: React.ReactNode[] = [];
    let i = 0;
    let blockIdx = 0;

    while (i < rawLines.length) {
      const line = rawLines[i];
      const trimmed = line.trim();

      // 1. Fenced Code Block (```lang ... ```)
      if (trimmed.startsWith('```')) {
        const lang = trimmed.replace('```', '').trim() || 'text';
        const codeLines: string[] = [];
        i++;
        while (i < rawLines.length && !rawLines[i].trim().startsWith('```')) {
          codeLines.push(rawLines[i]);
          i++;
        }
        i++; // skip closing ```
        const fullCode = codeLines.join('\n');
        const codeId = blockIdx++;

        elements.push(
          <div
            key={`code-${codeId}`}
            className="my-6 rounded-2xl overflow-hidden bg-[#1E1E24] text-slate-100 shadow-apple-card border border-white/10"
          >
            <div className="flex items-center justify-between px-4 py-2.5 bg-white/[0.06] border-b border-white/[0.08] text-xs">
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1.5">
                  <div className="w-2.5 h-2.5 rounded-full bg-red-500/80" />
                  <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/80" />
                  <div className="w-2.5 h-2.5 rounded-full bg-green-500/80" />
                </div>
                <span className="font-mono uppercase text-[10px] text-white/50 tracking-wider ml-1">
                  {lang}
                </span>
              </div>

              <button
                onClick={() => handleCopyCode(fullCode, codeId)}
                className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white/10 hover:bg-white/20 text-white/80 hover:text-white transition-all text-xs apple-press-subtle"
              >
                {copiedCodeIdx === codeId ? (
                  <>
                    <Check className="w-3 h-3 text-green-400" />
                    <span className="text-[11px] text-green-400 font-semibold">Copied</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3 h-3 text-white/60" />
                    <span className="text-[11px]">Copy</span>
                  </>
                )}
              </button>
            </div>
            <pre className="p-4 sm:p-5 overflow-x-auto text-xs sm:text-sm font-mono leading-relaxed text-slate-200">
              <code>{fullCode}</code>
            </pre>
          </div>
        );
        continue;
      }

      // 2. Empty Lines
      if (!trimmed) {
        elements.push(<div key={`sp-${blockIdx++}`} className="h-4" />);
        i++;
        continue;
      }

      // 3. Headings
      if (trimmed.startsWith('# ')) {
        elements.push(
          <h1 key={`h1-${blockIdx++}`} className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[#1D1D1F] font-display pt-8 pb-3 tracking-tight">
            {parseInlineMarkdown(trimmed.replace('# ', ''))}
          </h1>
        );
        i++;
        continue;
      }

      if (trimmed.startsWith('## ')) {
        elements.push(
          <h2 key={`h2-${blockIdx++}`} className="text-xl sm:text-2xl lg:text-3xl font-extrabold text-[#1D1D1F] font-display pt-7 pb-2.5 tracking-tight border-b border-black/[0.06] mb-2">
            {parseInlineMarkdown(trimmed.replace('## ', ''))}
          </h2>
        );
        i++;
        continue;
      }

      if (trimmed.startsWith('### ')) {
        elements.push(
          <h3 key={`h3-${blockIdx++}`} className="text-lg sm:text-xl lg:text-2xl font-bold text-[#1D1D1F] font-display pt-6 pb-2 tracking-tight">
            {parseInlineMarkdown(trimmed.replace('### ', ''))}
          </h3>
        );
        i++;
        continue;
      }

      if (trimmed.startsWith('#### ')) {
        elements.push(
          <h4 key={`h4-${blockIdx++}`} className="text-base sm:text-lg font-bold text-[#1D1D1F] font-display pt-4 pb-1.5 tracking-tight">
            {parseInlineMarkdown(trimmed.replace('#### ', ''))}
          </h4>
        );
        i++;
        continue;
      }

      // 4. Horizontal Dividers
      if (trimmed === '---' || trimmed === '***') {
        elements.push(<hr key={`hr-${blockIdx++}`} className="my-8 border-black/[0.08]" />);
        i++;
        continue;
      }

      // 5. Blockquotes (> ...)
      if (trimmed.startsWith('> ')) {
        const quoteLines: string[] = [];
        while (i < rawLines.length && rawLines[i].trim().startsWith('> ')) {
          quoteLines.push(rawLines[i].trim().replace(/^>\s?/, ''));
          i++;
        }
        elements.push(
          <blockquote
            key={`bq-${blockIdx++}`}
            className="my-6 pl-5 py-4 pr-5 border-l-4 border-[#0071E3] bg-[#0071E3]/[0.06] rounded-r-2xl text-[#1D1D1F] text-base sm:text-lg font-medium italic shadow-2xs space-y-2"
          >
            {quoteLines.map((ql, qIdx) => (
              <p key={qIdx} className="leading-relaxed">
                {parseInlineMarkdown(ql)}
              </p>
            ))}
          </blockquote>
        );
        continue;
      }

      // 6. Unordered Lists (- , * , + )
      if (/^[-*+]\s/.test(trimmed)) {
        const listItems: string[] = [];
        while (i < rawLines.length && /^[-*+]\s/.test(rawLines[i].trim())) {
          listItems.push(rawLines[i].trim().replace(/^[-*+]\s+/, ''));
          i++;
        }
        elements.push(
          <ul key={`ul-${blockIdx++}`} className="my-4 space-y-2 pl-6 list-disc text-sm sm:text-base text-[#1D1D1F]/90 leading-relaxed">
            {listItems.map((item, lIdx) => (
              <li key={lIdx} className="pl-1">
                {parseInlineMarkdown(item)}
              </li>
            ))}
          </ul>
        );
        continue;
      }

      // 7. Ordered Lists (1. , 2. )
      if (/^\d+\.\s/.test(trimmed)) {
        const listItems: string[] = [];
        while (i < rawLines.length && /^\d+\.\s/.test(rawLines[i].trim())) {
          listItems.push(rawLines[i].trim().replace(/^\d+\.\s+/, ''));
          i++;
        }
        elements.push(
          <ol key={`ol-${blockIdx++}`} className="my-4 space-y-2 pl-6 list-decimal text-sm sm:text-base text-[#1D1D1F]/90 leading-relaxed font-semibold text-[#0071E3]">
            {listItems.map((item, lIdx) => (
              <li key={lIdx} className="pl-1 text-[#1D1D1F]/90 font-normal">
                {parseInlineMarkdown(item)}
              </li>
            ))}
          </ol>
        );
        continue;
      }

      // 8. Regular Paragraph with inline Markdown parsing
      elements.push(
        <p key={`p-${blockIdx++}`} className="text-sm sm:text-base lg:text-[16.5px] text-[#1D1D1F]/90 leading-[1.8] mb-4">
          {parseInlineMarkdown(trimmed)}
        </p>
      );
      i++;
    }

    return elements;
  };

  return (
    <div className={`prose-custom text-[#1D1D1F] space-y-1 ${className}`}>
      {renderBlocks()}
    </div>
  );
};
