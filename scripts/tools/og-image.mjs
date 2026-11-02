// Renders the social share image: node scripts/tools/og-image.mjs → frontend/public/og-image.png (1200×630).
// Kept generic (no levels or lesson counts) so it stays true as the course grows.
import sharp from 'sharp';

const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
 <rect width="1200" height="630" fill="#F5F1E8"/>
 <rect x="0" y="0" width="16" height="630" fill="#C0392B"/>
 <text x="1150" y="560" text-anchor="end" font-family="Noto Serif JP" font-weight="700" font-size="440" fill="#C0392B" fill-opacity="0.09">日本語</text>
 <g font-family="Segoe UI">
  <text x="90" y="130" font-size="40" font-weight="700" fill="#1C1712"><tspan fill="#C0392B" font-family="Noto Serif JP">日</tspan>  LearnJP</text>
  <text x="90" y="285" font-size="80" font-weight="700" fill="#1C1712">Học tiếng Nhật</text>
  <text x="90" y="380" font-size="80" font-weight="700" fill="#1C1712">từng bài, vững từng bước</text>
  <text x="90" y="460" font-size="32" fill="#5c5249">Lộ trình JLPT · Từ vựng · Hán tự · Ngữ pháp · Nghe · Đọc</text>
  <text x="90" y="530" font-size="32" fill="#5c5249">Bài kiểm tra và đề thi thử có giải thích</text>
 </g>
</svg>`;
await sharp(Buffer.from(svg)).png({ compressionLevel: 9 }).toFile('frontend/public/og-image.png');
console.log('frontend/public/og-image.png');
