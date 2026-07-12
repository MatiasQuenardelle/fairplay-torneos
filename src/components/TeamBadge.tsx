export default function TeamBadge({
  shortName,
  color,
  size = 36,
}: {
  shortName: string;
  color: string;
  size?: number;
}) {
  return (
    <span
      className="inline-flex shrink-0 items-center justify-center rounded-full border border-white/20 font-bold text-white"
      style={{
        width: size,
        height: size,
        backgroundColor: color,
        fontSize: size * 0.3,
      }}
    >
      {shortName}
    </span>
  );
}
