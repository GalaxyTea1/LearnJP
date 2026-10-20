export default function WritingGrid({ size = 200 }: { size?: number }) {
    const s = size;
    const half = s / 2;
    return (
        <svg width={s} height={s} className="absolute inset-0 pointer-events-none">
            {/* outer border */}
            <rect x={0} y={0} width={s} height={s} fill="none" stroke="rgba(192,57,43,0.15)" strokeWidth={1.5} />
            {/* center cross */}
            <line x1={half} y1={0} x2={half} y2={s} stroke="rgba(192,57,43,0.15)" strokeWidth={1} strokeDasharray="4,4" />
            <line x1={0} y1={half} x2={s} y2={half} stroke="rgba(192,57,43,0.15)" strokeWidth={1} strokeDasharray="4,4" />
            {/* diagonals — lighter */}
            <line x1={0} y1={0} x2={s} y2={s} stroke="rgba(192,57,43,0.07)" strokeWidth={1} />
            <line x1={s} y1={0} x2={0} y2={s} stroke="rgba(192,57,43,0.07)" strokeWidth={1} />
        </svg>
    );
}
