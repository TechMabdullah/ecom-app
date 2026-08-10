"use client";

import { useState } from "react";

interface Props {
  images: string[];
  name: string;
  category: string;
  id: string;
}

export default function ProductGallery({ images, name, category, id }: Props) {
  const [active, setActive] = useState(0);

  return (
    <div className="animate-fade-up">
      <div className="component-card relative rounded-sm overflow-hidden mb-3">
        <div className="designator">
          {category.slice(0, 2).toUpperCase()}-{id.slice(0, 3)}
        </div>
        <img src={images[active]} alt={name} className="w-full aspect-square object-cover" />
      </div>

      {images.length > 1 && (
        <div className="flex gap-2">
          {images.map((img, i) => (
            <button
              key={i}
              onClick={() => setActive(i)}
              className="w-16 h-16 rounded-sm overflow-hidden border"
              style={{ borderColor: active === i ? "var(--amber)" : "var(--trace)" }}
            >
              <img src={img} alt="" className="w-full h-full object-cover" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}