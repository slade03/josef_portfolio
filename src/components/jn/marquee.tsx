/**
 * The scrolling strip.
 *
 * Two identical groups translated 0 -> -50% together, which is what makes the
 * loop seamless: the track is exactly twice one group, so half a track is one
 * full group. The second group is `aria-hidden` and holds nothing focusable,
 * so the duplication costs nothing in the accessibility tree.
 *
 * Under reduced motion the animation stops and the strip becomes horizontally
 * scrollable, so the items past the fold are still reachable rather than
 * frozen out of view.
 */
export function Marquee({
  items,
  className = "jn-strip",
}: {
  items: string[];
  className?: string;
}) {
  const group = (
    <>
      {items.map((item) => (
        <span key={item} className="jn-strip__item">
          <span>{item}</span>
          <span aria-hidden="true">✳</span>
        </span>
      ))}
    </>
  );

  return (
    <div className={className}>
      <div className="jn-strip__track">
        <div className="jn-strip__group">{group}</div>
        <div className="jn-strip__group" aria-hidden="true">
          {group}
        </div>
      </div>
    </div>
  );
}
