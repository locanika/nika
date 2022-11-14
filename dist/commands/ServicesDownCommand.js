"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ServicesDownCommand = void 0;
const ConfigService_1 = require("../services/ConfigService");
class ServicesDownCommand {
    constructor(configService, systemService) {
        this.configService = configService;
        this.systemService = systemService;
    }
    invoke() {
        if (this.configService.fileSystem() === ConfigService_1.FILE_SYSTEM_MACOS_MUTAGEN) {
            this.systemService.exec('mutagen-compose down');
        }
        else {
            this.systemService.exec('docker-compose down');
        }
    }
}
exports.ServicesDownCommand = ServicesDownCommand;
//# sourceMappingURL=ServicesDownCommand.js.map