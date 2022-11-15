"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ServicesPsCommand = void 0;
const ConfigService_1 = require("../services/ConfigService");
class ServicesPsCommand {
    constructor(config, systemService) {
        this.config = config;
        this.systemService = systemService;
    }
    invoke() {
        if (this.config.fileSystem === ConfigService_1.FileSystem.MACOS_MUTAGEN) {
            this.systemService.exec('mutagen-compose ps');
        }
        else {
            this.systemService.exec('docker-compose ps');
        }
    }
}
exports.ServicesPsCommand = ServicesPsCommand;
//# sourceMappingURL=ServicesPsCommand.js.map