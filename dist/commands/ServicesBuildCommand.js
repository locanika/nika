"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ServicesBuildCommand = void 0;
const ConfigService_1 = require("../services/ConfigService");
class ServicesBuildCommand {
    constructor(configService, systemService) {
        this.configService = configService;
        this.systemService = systemService;
    }
    invoke() {
        if (this.configService.fileSystem() === ConfigService_1.FileSystem.MACOS_MUTAGEN) {
            this.systemService.exec('mutagen-compose pull');
            this.systemService.exec('mutagen-compose build');
        }
        else {
            this.systemService.exec('docker-compose pull');
            this.systemService.exec('docker-compose build');
        }
    }
}
exports.ServicesBuildCommand = ServicesBuildCommand;
//# sourceMappingURL=ServicesBuildCommand.js.map