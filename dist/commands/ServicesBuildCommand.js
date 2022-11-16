"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ServicesBuildCommand = void 0;
const ConfigService_1 = require("../services/ConfigService");
class ServicesBuildCommand {
    constructor(config, systemService) {
        this.config = config;
        this.systemService = systemService;
    }
    invoke() {
        if (this.config.fileSystem === ConfigService_1.FileSystem.MACOS_MUTAGEN) {
            this.systemService.execShellCommandSync('mutagen-compose pull');
            this.systemService.execShellCommandSync('mutagen-compose build');
        }
        else {
            this.systemService.execShellCommandSync('docker-compose pull');
            this.systemService.execShellCommandSync('docker-compose build');
        }
    }
}
exports.ServicesBuildCommand = ServicesBuildCommand;
//# sourceMappingURL=ServicesBuildCommand.js.map