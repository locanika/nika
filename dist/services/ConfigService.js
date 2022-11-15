"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ConfigService = exports.DockerMode = exports.FileSystem = exports.OsName = void 0;
const yaml = require('js-yaml');
const fs = require('fs');
const os = require('os');
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
var DockerMode;
(function (DockerMode) {
    DockerMode["ROOT_LESS"] = "root_less";
    DockerMode["ROOT"] = "root";
})(DockerMode = exports.DockerMode || (exports.DockerMode = {}));
class ConfigService {
    build() {
        let config = yaml.load(fs.readFileSync('./config.yml', 'utf8'));
        if (fs.existsSync('./config.local.yml')) {
            config = Object.assign(Object.assign({}, config), yaml.load(fs.readFileSync('./config.local.yml', 'utf8')));
        }
        const osName = config['os_name'] || this.getDefaultOsName();
        const fileSystem = config['file_system'] || this.getDefaultFileSystem(osName);
        return {
            pathToGatewayProject: './projects/gateway/',
            pathToDockerConfig: './docker-compose.yml',
            osName: osName,
            fileSystem: fileSystem,
            dockerMode: config['docker_mode'],
            servicesRestartPolicy: config['services_restart_policy'],
            enabledServices: config['enabled_services']
        };
    }
    getDefaultOsName() {
        if (os.platform() === 'linux') {
            return OsName.LINUX;
        }
        else {
            return OsName.MACOS;
        }
    }
    getDefaultFileSystem(osName) {
        if (osName === OsName.LINUX) {
            return FileSystem.LINUX_DEFAULT;
        }
        else {
            return FileSystem.MACOS_DEFAULT;
        }
    }
}
exports.ConfigService = ConfigService;
//# sourceMappingURL=ConfigService.js.map