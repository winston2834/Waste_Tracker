import { useState } from "react";
import { Star } from "lucide-react";

export default function StarRating({ value = 0, onChange, size = 32, readOnly = false }) {
  const [hover, setHover] = useState(0);
  const shown = hover || value;
  return (
    <div className="flex gap-1.5" data-testid="star-rating">
      {[1, 2, 3, 4, 5].map((n) => {
        const active = shown >= n;
        return (
          <button
            key={n}
            type="button"
            data-testid={`star-${n}`}
            disabled={readOnly}
            aria-label={`${n} star`}
            onMouseEnter={() => !readOnly && setHover(n)}
            onMouseLeave={() => !readOnly && setHover(0)}
            onClick={() => !readOnly && onChange?.(n)}
            className={readOnly ? "cursor-default" : "cursor-pointer transition-transform duration-150 hover:scale-125 active:scale-95"}
          >
            <Star
              size={size}
              strokeWidth={2.5}
              className={active ? "fill-[#E9C46A] text-[#E9C46A]" : "fill-transparent text-[#E3CFAF]"}
            />
          </button>
        );
      })}
    </div>
  );
}
