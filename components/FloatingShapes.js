'use client';

const FloatingShapes = () => {
  return (
    <div aria-hidden className="av-float-layer">
      <span className="av-float-dot" style={{ top: '12%', left: '6%' }} />
      <span
        className="av-float-dot av-float-dot--sm"
        style={{ top: '68%', left: '12%', animationDelay: '-.6s' }}
      />
      <span
        className="av-float-dot av-float-dot--lg"
        style={{ top: '22%', right: '8%', animationDelay: '-1.2s' }}
      />
      <span className="av-float-dot" style={{ bottom: '10%', right: '14%', animationDelay: '-.9s' }} />
    </div>
  );
};

export default FloatingShapes;
