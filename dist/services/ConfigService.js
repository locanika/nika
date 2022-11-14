"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ConfigService = exports.FileSystem = exports.OsName = void 0;
const yaml = require('js-yaml');
const fs = require('fs');
var OsName;
(function (OsName) {
    OsName["LINUX"] = "linux";
    OsName["MACOS"] = "macos";
})(OsName = exports.OsName || (exports.OsName = {}));
var FileSystem;
(function (FileSystem) {
    FileSystem["LINUX_DEFAULT"] = "linux_default";
    FileSystem["MACOS_DEFAULT"] = "macos_default";
    FileSystem["MACOS_MUTAGEN"] = "macos_mutagen";
    FileSystem["MACOS_NFS"] = "macos_nfs";
})(FileSystem = exports.FileSystem || (exports.FileSystem = {}));
class ConfigService {
    constructor(config) {
        this.config = config;
    }
    fileSystem() {
        return this.config.fileSystem;
    }
    dockerServices() {
        return yaml.load(fs.readFileSync(this.config.pathToDockerConfig, 'utf8'))['services'];
    }
    pathToGatewayProject() {
        return this.config.pathToGatewayProject;
    }
}
exports.ConfigService = ConfigService;
//# sourceMappingURL=ConfigService.js.map