"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ConfigService = exports.DockerMode = exports.FileSystem = exports.OsName = void 0;
const yaml = require('js-yaml');
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
})(FileSystem = exports.FileSystem || (exports.FileSystem = {}));
var DockerMode;
(function (DockerMode) {
    DockerMode["ROOT_LESS"] = "root_less";
    DockerMode["ROOT"] = "root";
})(DockerMode = exports.DockerMode || (exports.DockerMode = {}));
class ConfigService {
    constructor(fileSystemService, systemService) {
        this.fileSystemService = fileSystemService;
        this.systemService = systemService;
    }
    build() {
        let config = {
            os_name: null,
            file_system: null,
            docker_mode: DockerMode.ROOT,
            services_restart_policy: 'always',
            projects: [],
            enabled_services: []
        };
        if (this.fileSystemService.existsSync('./config.yml')) {
            config = Object.assign(Object.assign({}, config), yaml.load(this.fileSystemService.readFileSync('./config.yml')));
        }
        if (this.fileSystemService.existsSync('./config.local.yml')) {
            config = Object.assign(Object.assign({}, config), yaml.load(this.fileSystemService.readFileSync('./config.local.yml')));
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
            projects: config['projects'],
            enabledServices: config['enabled_services']
        };
    }
    getDefaultOsName() {
        if (this.systemService.getPlatform() === 'linux') {
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