"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DnsCommand = void 0;
class DnsCommand {
    constructor(dnsService) {
        this.dnsService = dnsService;
    }
    invoke() {
        this.dnsService.generateGatewayConfigs();
    }
}
exports.DnsCommand = DnsCommand;
//# sourceMappingURL=DnsCommand.js.map