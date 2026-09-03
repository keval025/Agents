import React from 'react';

export default function Loader({ text = 'Loading collection...' }) {
  return (
    <div className="flex flex-col items-center justify-center py-20 min-h-[300px]">
      <div className="relative w-12 h-12">
        <div className="w-12 h-12 rounded-full border-2 border-zinc-200"></div>
        <div className="w-12 h-12 rounded-full border-2 border-[#C5A880] border-t-transparent animate-spin absolute top-0 left-0"></div>
      </div>
      {text && (
        <p className="mt-4 text-xs tracking-widest text-zinc-500 uppercase font-medium">
          {text}
        </p>
      )}
    </div>
  );
}
