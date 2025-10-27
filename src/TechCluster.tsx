// src/components/TechCluster.tsx
import React from "react";

type Props = {
  size?: number;       // overall box size
  centerSize?: number; // center logo diameter
  badge?: number;      // tech badge diameter
};

const ICONS = [
  "aws", "docker", "kubernetes",
  "azure",             "gcp",
  "python", "tensorflow", "pytorch",
] as const;
type IconName = typeof ICONS[number];

// Exact slugs for SimpleIcons
const SLUG: Record<IconName, string> = {
  aws: "amazonaws",
  docker: "docker",
  kubernetes: "kubernetes",
  azure: "microsoftazure",
  gcp: "googlecloud",
  python: "python",
  tensorflow: "tensorflow",
  pytorch: "pytorch",
};

// White Icon + 2-step CDN fallback + final placeholder
function Icon({ name, size = 26 }: { name: IconName; size?: number }) {
  const s = SLUG[name];
  const v = "v=3"; // cache buster

  const primary = `https://cdn.simpleicons.org/${s}/ffffff?${v}`;
  const fallback1 = `https://cdn.simpleicons.org/${s}?color=ffffff&${v}`;
  const fallback2 = `https://api.iconify.design/simple-icons:${s}.svg?color=%23ffffff&${v}`;

  const onError: React.ReactEventHandler<HTMLImageElement> = (e) => {
    const img = e.currentTarget;
    const step = img.dataset.errStep || "0";
    if (step === "0") {
      img.dataset.errStep = "1";
      img.src = fallback1;
      return;
    }
    if (step === "1") {
      img.dataset.errStep = "2";
      img.src = fallback2;
      return;
    }
    // final white dot as safe fallback
    img.src =
      `data:image/svg+xml;utf8,` +
      encodeURIComponent(
        `<svg xmlns='http://www.w3.org/2000/svg' width='${size}' height='${size}' viewBox='0 0 24 24' fill='white'>
           <circle cx='12' cy='12' r='9' />
         </svg>`
      );
  };

  return (
    <img
      src={primary}
      alt={name}
      width={size}
      height={size}
      style={{ width: size, height: size, display: "block" }}
      loading="lazy"
      referrerPolicy="no-referrer"
      onError={onError}
    />
  );
}

export default function TechCluster({
  size = 440,
  centerSize = 84,
  badge = 56,
}: Props) {
  return (
    <div className="relative [transform:none]" style={{ width: size, height: size }}>
      {/* floating + center pulse */}
      <style>{`
        @keyframes clusterFloat {
          0%, 100% { transform: translateY(0px); }
          50%      { transform: translateY(-8px); }
        }
        @keyframes centerPulse {
          0%, 100% { transform: scale(1); }
          50%      { transform: scale(1.06); }
        }
      `}</style>

      {/* soft background glow */}
      <div
        className="absolute inset-0 rounded-3xl blur-3xl"
        style={{ background: "radial-gradient(closest-side, rgba(255,255,255,0.08), transparent 65%)" }}
      />

      {/* icon grid */}
      <div
        className="absolute left-1/2 top-1/2 grid -translate-x-1/2 -translate-y-1/2"
        style={{
          width: "100%",
          height: "100%",
          display: "grid",
          gridTemplateColumns: "repeat(5, 1fr)",
          gridTemplateRows: "repeat(5, 1fr)",
          gap: 14,
          alignItems: "center",
          justifyItems: "center",
        }}
      >
        {/* Row 1 */}
        <Badge name="aws"        badge={badge} col={2} row={1} delay={0.2} />
        <Badge name="docker"     badge={badge} col={3} row={1} delay={0.8} />
        <Badge name="kubernetes" badge={badge} col={4} row={1} delay={1.4} />

        {/* Row 2 */}
        <Badge name="azure"      badge={badge} col={1} row={2} delay={0.5} />
        <Badge name="gcp"        badge={badge} col={5} row={2} delay={1.1} />

        {/* Center Logo — clean + UP1 shift + CL3 pulse */}
        <div
          style={{
            gridColumn: "3 / span 1",
            gridRow: "3 / span 1",
            display: "grid",
            placeItems: "center",
            transform: "translateY(-8px)", // UP1 lift
          }}
        >
          <img
            src="/logo-trs.svg"
            alt="center logo"
            width={centerSize}
            height={centerSize}
            style={{
              width: centerSize,
              height: centerSize,
              display: "block",
              animation: "centerPulse 5.2s ease-in-out infinite",
              transformOrigin: "50% 50%",
            }}
          />
        </div>

        {/* Row 4 */}
        <Badge name="python"     badge={badge} col={2} row={4} delay={0.4} />
        <Badge name="tensorflow" badge={badge} col={4} row={4} delay={1.25} />

        {/* Row 5 */}
        <Badge name="pytorch"    badge={badge} col={3} row={5} delay={0.7} />
      </div>
    </div>
  );
}

function Badge({
  name, badge, col, row, delay,
}: { name: IconName; badge: number; col: number; row: number; delay: number }) {
  return (
    <div
      style={{
        gridColumn: `${col} / span 1`,
        gridRow: `${row} / span 1`,
        width: badge,
        height: badge,
        borderRadius: 9999,
        border: "1px solid rgba(255,255,255,0.2)",
        background: "rgba(255,255,255,0.05)",
        backdropFilter: "blur(4px)",
        display: "grid",
        placeItems: "center",
        animation: `clusterFloat 3s ease-in-out infinite`,
        animationDelay: `${delay}s`,
      }}
      title={name}
    >
      <Icon name={name} />
    </div>
  );
}
