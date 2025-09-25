"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PrivacyBanner = void 0;
const alert_1 = require("@/components/ui/alert");
const lucide_react_1 = require("lucide-react");
function PrivacyBanner() {
    return (<alert_1.Alert className="mb-4 border-green-200 bg-green-50">
      <lucide_react_1.Shield className="h-4 w-4 text-green-600"/>
      <alert_1.AlertDescription className="text-green-800">
        <div className="flex items-center gap-4 text-sm">
          <div className="flex items-center gap-1">
            <lucide_react_1.Lock className="h-3 w-3"/>
            <span>সম্পূর্ণ লোকাল</span>
          </div>
          <div className="flex items-center gap-1">
            <lucide_react_1.Eye className="h-3 w-3"/>
            <span>কোনো ট্র্যাকিং নেই</span>
          </div>
          <div className="flex items-center gap-1">
            <lucide_react_1.Shield className="h-3 w-3"/>
            <span>ইউজার নিয়ন্ত্রিত</span>
          </div>
        </div>
      </alert_1.AlertDescription>
    </alert_1.Alert>);
}
exports.PrivacyBanner = PrivacyBanner;
//# sourceMappingURL=privacy-banner.js.map