"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ServicesUpCommand = void 0;
const ConfigService_1 = require("../services/ConfigService");
class ServicesUpCommand {
    constructor(config, systemService) {
        this.config = config;
        this.systemService = systemService;
    }
    invoke() {
        if (this.config.fileSystem === ConfigService_1.FileSystem.MACOS_MUTAGEN) {
            this.systemService.exec('mutagen-compose up -d');
        }
        else {
            this.systemService.exec('docker-compose up -d');
        }
    }
}
exports.ServicesUpCommand = ServicesUpCommand;
//# sourceMappingURL=ServicesUpCommand.js.map