"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ServicesUpCommand = void 0;
const ConfigService_1 = require("../services/ConfigService");
class ServicesUpCommand {
    constructor(configService, systemService) {
        this.configService = configService;
        this.systemService = systemService;
    }
    invoke() {
        if (this.configService.fileSystem() === ConfigService_1.FILE_SYSTEM_MACOS_MUTAGEN) {
            this.systemService.exec('mutagen-compose up -d');
        }
        else {
            this.systemService.exec('docker-compose up -d');
        }
    }
}
exports.ServicesUpCommand = ServicesUpCommand;
//# sourceMappingURL=ServicesUpCommand.js.map