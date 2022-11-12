"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ConfigService = exports.FILE_SYSTEM_MACOS_NFS = exports.FILE_SYSTEM_MACOS_MUTAGEN = exports.FILE_SYSTEM_MACOS_DEFAULT = exports.FILE_SYSTEM_LINUX_DEFAULT = exports.OS_NAME_MACOS = exports.OS_NAME_LINUX = void 0;
const yaml = require('js-yaml');
const fs = require('fs');
exports.OS_NAME_LINUX = 'linux';
exports.OS_NAME_MACOS = 'macos';
exports.FILE_SYSTEM_LINUX_DEFAULT = 'linux_default';
exports.FILE_SYSTEM_MACOS_DEFAULT = 'macos_default';
exports.FILE_SYSTEM_MACOS_MUTAGEN = 'macos_mutagen';
exports.FILE_SYSTEM_MACOS_NFS = 'macos_nfs';
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
}
exports.ConfigService = ConfigService;
//# sourceMappingURL=ConfigService.js.map