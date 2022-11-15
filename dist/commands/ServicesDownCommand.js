"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ServicesDownCommand = void 0;
const ConfigService_1 = require("../services/ConfigService");
class ServicesDownCommand {
    constructor(config, systemService) {
        this.config = config;
        this.systemService = systemService;
    }
    invoke() {
        if (this.config.fileSystem === ConfigService_1.FileSystem.MACOS_MUTAGEN) {
            this.systemService.exec('mutagen-compose down');
        }
        else {
            this.systemService.exec('docker-compose down');
        }
    }
}
exports.ServicesDownCommand = ServicesDownCommand;
//# sourceMappingURL=ServicesDownCommand.js.map