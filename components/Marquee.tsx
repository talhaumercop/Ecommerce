import React from 'react';

const InfiniteMarquee = () => {
  const text = "/ ThreadHeist / New Arrivals / Resistance Edition / Bella Ciao / Limited Heist Collection /";

  return (
    <div className="absolute bottom-0 w-full border-t border-white/10 bg-black/90 py-5 overflow-hidden">
      <style>{`
        @keyframes marquee {
          from {
            transform: translateX(0);
          }
          to {
            transform: translateX(-25%);
          }
        }
        
        .marquee-wrapper {
          display: flex;
          animation: marquee 25s linear infinite;
        }
        
        .marquee-content {
          white-space: nowrap;
          flex-shrink: 0;
          padding-right: 0;
        }
      `}</style>
      
      <div className="marquee-wrapper">
        <span className=" tracking-widest uppercase text-white/70 mx-8 marquee-content">
          {text}
        </span>
        <span className=" tracking-widest uppercase text-white/70 mx-8 marquee-content">
          {text}
        </span>
        <span className=" tracking-widest uppercase text-white/70 mx-8 marquee-content">
          {text}
        </span>
        <span className=" tracking-widest uppercase text-white/70 mx-8 marquee-content">
          {text}
        </span>
      </div>
    </div>
  );
};

export default InfiniteMarquee;