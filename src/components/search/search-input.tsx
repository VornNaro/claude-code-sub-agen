"use client";

import { useCallback, useEffect, useRef, useState, useTransition } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Search, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { useDebounce } from "@/hooks/use-debounce";

interface SearchInputProps {
  className?: string;
}

export function SearchInput({ className }: SearchInputProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const inputRef = useRef<HTMLInputElement>(null);
  const [isPending, startTransition] = useTransition();

  // Initialise from URL param
  const initialQuery = searchParams.get("q") ?? "";
  const [query, setQuery] = useState(initialQuery);
  const debouncedQuery = useDebounce(query, 300);

  // Sync debounced query back to URL
  useEffect(() => {
    const currentQ = searchParams.get("q") ?? "";
    if (debouncedQuery === currentQ) return;

    startTransition(() => {
      if (debouncedQuery) {
        router.push(`/search?q=${encodeURIComponent(debouncedQuery)}`);
      } else {
        router.push("/search");
      }
    });
  }, [debouncedQuery, router, searchParams, startTransition]);

  // Keep local state in sync if the URL changes externally (e.g. suggested search click)
  useEffect(() => {
    const urlQuery = searchParams.get("q") ?? "";
    if (urlQuery !== query && urlQuery !== debouncedQuery) {
      setQuery(urlQuery);
    }
    // Only react to searchParams changes, not local state
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams]);

  const handleClear = useCallback(() => {
    setQuery("");
    inputRef.current?.focus();
  }, []);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === "Escape") {
        handleClear();
      }
    },
    [handleClear],
  );

  return (
    <div className={cn("relative", className)}>
      <Search className="absolute left-3.5 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
      <input
        ref={inputRef}
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Search by name, model, or body type..."
        autoFocus
        className={cn(
          "h-12 w-full rounded-lg border bg-background pl-11 pr-20 text-base outline-none transition-[color,box-shadow]",
          "placeholder:text-muted-foreground",
          "focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]",
          isPending && "opacity-70",
        )}
      />
      <div className="absolute right-3 top-1/2 flex -translate-y-1/2 items-center gap-2">
        {query && (
          <button
            type="button"
            onClick={handleClear}
            className="rounded-sm p-0.5 text-muted-foreground transition-colors hover:text-foreground"
            aria-label="Clear search"
          >
            <X className="h-4 w-4" />
          </button>
        )}
        <kbd className="hidden rounded border bg-muted px-1.5 py-0.5 text-[10px] font-mono text-muted-foreground sm:inline-block">
          Ctrl+K
        </kbd>
      </div>
    </div>
  );
}
