/**
 * The faint glyph field behind the closing section.
 *
 * A grid of mono characters at very low opacity, radially masked so it fades to
 * nothing at the edges and leaves the headline sitting in a clear centre.
 *
 * DETERMINISTIC ON PURPOSE. The characters come from a fixed integer hash of the
 * cell index, not `Math.random()`. This renders on the server and hydrates on the
 * client, and a random glyph would differ between the two passes and trip a
 * hydration mismatch. Same input, same output, every time.
 *
 * Purely decorative, so it is `aria-hidden` and never reaches the accessibility
 * tree or find-in-page.
 */

const GLYPHS = ["#", "%", "*", "+", "@", "/", "=", "\u00b7"];

const COLS = 44;
const ROWS = 16;

/** A small integer hash. Cheap, stable, and good enough to look unpatterned. */
function pick(i: number) {
  const h = (i * 2654435761) % 4294967296;
  return GLYPHS[Math.abs(h) % GLYPHS.length];
}

export function GlyphField() {
  const rows = Array.from({ length: ROWS }, (_, r) =>
    Array.from({ length: COLS }, (_, c) => pick(r * COLS + c + 1)).join(" "),
  );

  return (
    <div className="jn-glyphs" aria-hidden="true">
      {rows.map((row, i) => (
        <div key={i} className="jn-glyphs__row">
          {row}
        </div>
      ))}
    </div>
  );
}
