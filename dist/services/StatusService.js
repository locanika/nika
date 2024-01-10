"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.StatusService = void 0;
const ConfigService_1 = require("./ConfigService");
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
        this.loggerService.warning('Docker mode:');
        this.loggerService.info(this.config.dockerMode + "\n");
        this.loggerService.warning('Services:');
        for (const i in this.config.services) {
            const service = this.config.services[i];
            if (service.type === ConfigService_1.ServiceType.SEPARATOR) {
                this.loggerService.warning("  " + service.name);
            }
            else {
                if (service.enabled) {
                    this.loggerService.info("    " + service.name);
                }
                else {
                    this.loggerService.warning("    " + service.name + " [DISABLED]");
                }
            }
        }
    }
}
exports.StatusService = StatusService;
//# sourceMappingURL=StatusService.js.map