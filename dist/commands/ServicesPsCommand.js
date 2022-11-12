"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ServicesPsCommand = void 0;
const ConfigService_1 = require("../services/ConfigService");
class ServicesPsCommand {
    constructor(configService, systemService) {
        this.configService = configService;
        this.systemService = systemService;
    }
    invoke() {
        if (this.configService.fileSystem() === ConfigService_1.FILE_SYSTEM_MACOS_MUTAGEN) {
            this.systemService.exec('mutagen-compose ps');
        }
        else {
            this.systemService.exec('docker-compose ps');
        }
    }
}
exports.ServicesPsCommand = ServicesPsCommand;
//# sourceMappingURL=ServicesPsCommand.js.map