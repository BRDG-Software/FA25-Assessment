export function encodeBMP(
  width: number,
  height: number,
  imageData: ImageData
): Blob {
  const rowSize = Math.ceil((24 * width) / 32) * 4;
  const imageSize = rowSize * height;
  const fileSize = 54 + imageSize;

  const buffer = new ArrayBuffer(fileSize);
  const view = new DataView(buffer);
  let pos = 0;

  // BMP Header
  view.setUint16(pos, 0x424d, false);
  pos += 2; // Signature "BM"
  view.setUint32(pos, fileSize, true);
  pos += 4; // File size
  view.setUint32(pos, 0, true);
  pos += 4; // Reserved
  view.setUint32(pos, 54, true);
  pos += 4; // Offset

  // DIB Header
  view.setUint32(pos, 40, true);
  pos += 4; // Header size
  view.setInt32(pos, width, true);
  pos += 4;
  view.setInt32(pos, -height, true);
  pos += 4; // Negative for top-down
  view.setUint16(pos, 1, true);
  pos += 2; // Planes
  view.setUint16(pos, 24, true);
  pos += 2; // Bits per pixel
  view.setUint32(pos, 0, true);
  pos += 4; // Compression
  view.setUint32(pos, imageSize, true);
  pos += 4; // Image size
  view.setUint32(pos, 2835, true);
  pos += 4; // X pixels/meter
  view.setUint32(pos, 2835, true);
  pos += 4; // Y pixels/meter
  view.setUint32(pos, 0, true);
  pos += 4; // Colors used
  view.setUint32(pos, 0, true);
  pos += 4; // Important colors

  const rowPadding = rowSize - width * 3;
  const data = imageData.data;

  let i = 0;
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++, i += 4) {
      view.setUint8(pos++, data[i + 2]); // B
      view.setUint8(pos++, data[i + 1]); // G
      view.setUint8(pos++, data[i]); // R
    }
    pos += rowPadding;
  }

  return new Blob([buffer], { type: "image/bmp" });
}
