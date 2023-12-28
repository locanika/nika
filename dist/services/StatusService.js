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
        this.loggerService.warning('Docker mode:');
        this.loggerService.info(this.config.dockerMode + "\n");
        this.loggerService.warning('Enabled services:');
        this.loggerService.info(this.config.enabledServices.sort().join("\n") + "\n");
    }
}
exports.StatusService = StatusService;
//# sourceMappingURL=StatusService.js.map