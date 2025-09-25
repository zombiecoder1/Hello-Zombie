"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.metadata = void 0;
const google_1 = require("next/font/google");
require("./globals.css");
const inter = (0, google_1.Inter)({ subsets: ["latin"] });
exports.metadata = {
    title: "বাংলা প্রাইভেসি কোড এডিটর",
    description: "Privacy-first Bengali coding assistant - সম্পূর্ণ লোকাল AI-পাওয়ারড কোডিং এডিটর",
    generator: 'v0.dev'
};
function RootLayout({ children, }) {
    return (<html lang="bn">
      <body className={inter.className}>{children}</body>
    </html>);
}
exports.default = RootLayout;
//# sourceMappingURL=layout.js.map