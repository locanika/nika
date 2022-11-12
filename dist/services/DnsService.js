"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DnsService = void 0;
const fs_1 = __importDefault(require("fs"));
class DnsService {
    constructor(configService, dockerHostService) {
        this.configService = configService;
        this.dockerHostService = dockerHostService;
    }
    generateEtcHosts() {
        let etcHosts = fs_1.default.readFileSync('/etc/hosts', 'utf8');
        this.dockerHostService.listingAll().forEach(function (host) {
            if (!etcHosts.includes(host.domain)) {
                etcHosts += "127.0.0.1 " + host.domain + "\n";
            }
        });
        fs_1.default.writeFileSync('/etc/hosts', etcHosts);
        console.log("Configured /etc/hosts file");
    }
    generateGatewayConfigs() {
    }
}
exports.DnsService = DnsService;
//# sourceMappingURL=DnsService.js.map