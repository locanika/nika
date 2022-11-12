"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DockerHostService = void 0;
class DockerHostService {
    constructor(configService) {
        this.configService = configService;
    }
    listingAll() {
        var _a, _b;
        let result = [];
        for (let serviceName in this.configService.dockerServices()) {
            const serviceData = this.configService.dockerServices()[serviceName];
            let serviceDomains = (_a = serviceData.environment) === null || _a === void 0 ? void 0 : _a.DOMAINS;
            if (!serviceDomains) {
                continue;
            }
            serviceDomains = serviceDomains.split(',');
            for (let key in serviceDomains) {
                const serviceDomain = serviceDomains[key];
                result.push({
                    domain: serviceDomain,
                    dockerHost: serviceName,
                    dockerPort: serviceData.ports[0].split(':')[1],
                    externalHost: '127.0.0.1',
                    externalPort: serviceData.ports[0].split(':')[0],
                    corsEnabled: !!((_b = serviceData.environment) === null || _b === void 0 ? void 0 : _b.BACKEND_API_CORS)
                });
            }
        }
        return result;
    }
}
exports.DockerHostService = DockerHostService;
//# sourceMappingURL=DockerHostService.js.map