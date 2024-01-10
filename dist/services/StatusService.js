"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.StatusService = void 0;
class StatusService {
    constructor(config, loggerService) {
        this.config = config;
        this.loggerService = loggerService;
    }
    displayStatus() {
        this.loggerService.warning('Operation system:');
        this.loggerService.info(this.config.osName + "\n");
        this.loggerService.warning('File system:');
        this.loggerService.info(this.config.fileSystem + "\n");
        this.loggerService.warning('Services:');
        for (const i in this.config.services) {
            const servicesGroup = this.config.services[i];
            this.loggerService.warning("  " + servicesGroup.group);
            for (const j in servicesGroup.services) {
                const service = servicesGroup.services[j];
                if (service.enabled) {
                    this.loggerService.info("    " + service.name);
                }
                else {
                    this.loggerService.warning("    [DISABLED] " + service.name);
                }
            }
        }
    }
}
exports.StatusService = StatusService;
//# sourceMappingURL=StatusService.js.map