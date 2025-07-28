type TripleDotGraphProps = {
  structurePct: number; // 0-100
  pegasusPct: number; // 0-100
  vomeroPct: number; // 0-100
  size?: number;
};

function getCircumcircle(
  p1: { x: number; y: number },
  p2: { x: number; y: number },
  p3: { x: number; y: number }
) {
  const A = p2.x - p1.x;
  const B = p2.y - p1.y;
  const C = p3.x - p1.x;
  const D = p3.y - p1.y;
  const E = A * (p1.x + p2.x) + B * (p1.y + p2.y);
  const F = C * (p1.x + p3.x) + D * (p1.y + p3.y);
  const G = 2 * (A * (p3.y - p2.y) - B * (p3.x - p2.x));
  if (G === 0) {
    const minX = Math.min(p1.x, p2.x, p3.x);
    const maxX = Math.max(p1.x, p2.x, p3.x);
    const minY = Math.min(p1.y, p2.y, p3.y);
    const maxY = Math.max(p1.y, p2.y, p3.y);
    return {
      cx: (minX + maxX) / 2,
      cy: (minY + maxY) / 2,
      r: Math.max(maxX - minX, maxY - minY) / 2,
    };
  }
  const cx = (D * E - B * F) / G;
  const cy = (A * F - C * E) / G;
  const r = Math.hypot(p1.x - cx, p1.y - cy);
  return { cx, cy, r };
}

// Helper to find intersection of a line from (x0, y0) to (x1, y1) with a circle at (cx, cy, r)
function lineCircleIntersection(
  x0: number,
  y0: number,
  x1: number,
  y1: number,
  cx: number,
  cy: number,
  r: number
) {
  // Parametric line: (x, y) = (x0, y0) + t * (dx, dy)
  const dx = x1 - x0;
  const dy = y1 - y0;
  const fx = x0 - cx;
  const fy = y0 - cy;

  const a = dx * dx + dy * dy;
  const b = 2 * (fx * dx + fy * dy);
  const c = fx * fx + fy * fy - r * r;

  const discriminant = b * b - 4 * a * c;
  if (discriminant < 0) return null; // No intersection

  const sqrtD = Math.sqrt(discriminant);
  // We want the intersection closest to the starting point (t in [0,1])
  const t1 = (-b + sqrtD) / (2 * a);
  const t2 = (-b - sqrtD) / (2 * a);

  // Pick the t that is between 0 and 1 (on the segment)
  let t = null;
  if (t1 >= 0 && t1 <= 1) t = t1;
  else if (t2 >= 0 && t2 <= 1) t = t2;
  else t = Math.max(0, Math.min(1, t1, t2)); // fallback

  return {
    x: x0 + t * dx,
    y: y0 + t * dy,
  };
}

const TripleDotGraph: React.FC<TripleDotGraphProps> = ({
  structurePct,
  pegasusPct,
  vomeroPct,
  size = 240, // Increased from 200 to 280
}) => {
  // Layout
  const cx = size / 2;
  const cy = size / 2;
  const squareOffset = size * 0.05;
  const squareMin = squareOffset;
  const squareMax = size - squareOffset;

  // Outer circle is inset from the square
  const outerR = size / 2 - squareOffset * 2.3;
  const innerR = size * 0.25;

  const angles = {
    Structure: 0,
    Pegasus: 90,
    Vomero: 180,
  };

  const getDot = (
    angleDeg: number,
    value: number,
    cx: number,
    cy: number,
    innerR: number
  ) => {
    const angleRad = ((angleDeg - 90) * Math.PI) / 180;
    const r = innerR * (value / 100);
    return {
      x: cx + r * Math.cos(angleRad),
      y: cy + r * Math.sin(angleRad),
    };
  };

  // Dot positions (never outside inner circle)
  const dotA = getDot(angles.Structure, structurePct, cx, cy, innerR); // Top
  const dotB = getDot(angles.Pegasus, pegasusPct, cx, cy, innerR); // Left
  const dotC = getDot(angles.Vomero, vomeroPct, cx, cy, innerR); // Right

  // Circumcircle through the three dots
  const { cx: ccx, cy: ccy, r: cr } = getCircumcircle(dotA, dotB, dotC);

  // Diagonal lines: from each corner to intersection with outer circle
  const diagonalDefs = [
    // Top-left
    {
      from: { x: squareMin, y: squareMin },
      angle: Math.atan2(cy - squareMin, cx - squareMin),
    },
    // Top-right
    {
      from: { x: squareMax, y: squareMin },
      angle: Math.atan2(cy - squareMin, cx - squareMax),
    },
    // Bottom-right
    {
      from: { x: squareMax, y: squareMax },
      angle: Math.atan2(cy - squareMax, cx - squareMax),
    },
    // Bottom-left
    {
      from: { x: squareMin, y: squareMax },
      angle: Math.atan2(cy - squareMax, cx - squareMin),
    },
  ];

  const diagonalLines = diagonalDefs.map(({ from }, i) => {
    const to = lineCircleIntersection(from.x, from.y, cx, cy, cx, cy, outerR);

    // Only render if intersection is found
    return to ? (
      <line
        key={i}
        x1={from.x}
        y1={from.y}
        x2={to.x}
        y2={to.y}
        stroke="black"
        strokeWidth={1}
      />
    ) : null;
  });

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      {/* Outer square */}
      <rect
        x={squareMin}
        y={squareMin}
        width={squareMax - squareMin}
        height={squareMax - squareMin}
        fill="none"
        stroke="black"
        strokeWidth={1}
      />
      {/* Diagonals (now 4, from square to outer circle) */}
      {diagonalLines}

      {/* the diagonal lines shall only be as lengthed until it touches this below circle
       */}
      {/* Outer circle */}
      <circle
        cx={cx}
        cy={cy}
        r={outerR}
        fill="none"
        stroke="black"
        strokeWidth={2}
      />
      {/* Inner circle (reference/perfect) */}
      <circle
        cx={cx}
        cy={cy}
        r={innerR}
        fill="none"
        stroke="black"
        strokeWidth={2}
      />
      {/* Crosshairs */}
      <line
        x1={cx}
        y1={cy - outerR}
        x2={cx}
        y2={cy + outerR}
        stroke="black"
        strokeWidth={1}
      />
      <line
        x1={cx - outerR}
        y1={cy}
        x2={cx + outerR}
        y2={cy}
        stroke="black"
        strokeWidth={1}
      />
      {/* Circumcircle through the three dots (black border) */}
      <circle
        cx={ccx}
        cy={ccy}
        r={cr}
        fill="none"
        stroke="black"
        strokeWidth={3}
      />
      {/* Dots (pink fill) */}
      <circle cx={dotA.x} cy={dotA.y} r={5} fill="#EE2751" />
      <circle cx={dotB.x} cy={dotB.y} r={5} fill="#EE2751" />
      <circle cx={dotC.x} cy={dotC.y} r={5} fill="#EE2751" />
    </svg>
  );
};
export default TripleDotGraph;
