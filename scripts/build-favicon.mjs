import fs from "node:fs/promises";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

// PNG-backed ICO frames retain the source alpha at each browser-tab size.
const source = new URL("../portfolio-favicon.png", import.meta.url);
const sizes = [16, 32, 48, 256];
const frames = await Promise.all(
  sizes.map((size) => sharp(fileURLToPath(source))
    .resize(size, size).png().toBuffer()),
);
const header = Buffer.alloc(6 + 16 * frames.length);
header.writeUInt16LE(1, 2);
header.writeUInt16LE(frames.length, 4);
let offset = header.length;
frames.forEach((frame, i) => {
  const entry = 6 + i * 16;
  header[entry] = header[entry + 1] = sizes[i] === 256 ? 0 : sizes[i];
  header.writeUInt16LE(1, entry + 4);
  header.writeUInt16LE(32, entry + 6);
  header.writeUInt32LE(frame.length, entry + 8);
  header.writeUInt32LE(offset, entry + 12);
  offset += frame.length;
});
await fs.writeFile(new URL("../src/app/favicon.ico", import.meta.url), Buffer.concat([header, ...frames]));
await fs.copyFile(source, new URL("../src/app/icon.png", import.meta.url));
console.log("Generated app icon and 16/32/48/256px favicon frames.");
