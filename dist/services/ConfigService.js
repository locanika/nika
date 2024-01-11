"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ConfigService = exports.FileSystem = exports.OsName = void 0;
const yaml = require('js-yaml');
var OsName;
(function (OsName) {
    OsName["LINUX"] = "linux";
    OsName["MACOS"] = "macos";
    OsName["MACOS_M1"] = "macos_m1";
})(OsName = exports.OsName || (exports.OsName = {}));
var FileSystem;
(function (FileSystem) {
    FileSystem["LINUX_DEFAULT"] = "linux_default";
    FileSystem["MACOS_DEFAULT"] = "macos_default";
    FileSystem["MACOS_MUTAGEN"] = "macos_mutagen";
})(FileSystem = exports.FileSystem || (exports.FileSystem = {}));
class ConfigService {
    constructor(fileSystemService, systemService) {
        this.fileSystemService = fileSystemService;
        this.systemService = systemService;
    }
    buildUserConfig() {
        return this.build(true);
    }
    buildDefaultConfig() {
        return this.build(false);
    }
    build(fetchLocalConfig) {
        let config = {
            os_name: null,
            file_system: null,
            projects: [],
            services: []
        };
        if (this.fileSystemService.existsSync('./config.yml')) {
            config = Object.assign(Object.assign({}, config), yaml.load(this.fileSystemService.readFileSync('./config.yml')));
        }
        if (fetchLocalConfig && this.fileSystemService.existsSync('./config.local.yml')) {
            config = Object.assign(Object.assign({}, config), yaml.load(this.fileSystemService.readFileSync('./config.local.yml')));
        }
        const osName = this.getOsName();
        const fileSystem = config['file_system'] || this.getDefaultFileSystem(osName);
        return {
            pathToGatewayProject: './projects/gateway/',
            pathToDockerConfig: './docker-compose.yml',
            osName: osName,
            fileSystem: fileSystem,
            projects: config['projects'],
            services: this.mapServices(config['services'])
        };
    }
    save(newConfig) {
        this.fileSystemService.writeFileSync('./config.local.yml', yaml.dump({
            file_system: newConfig.fileSystem,
            services: newConfig.services
        }));
    }
    getOsName() {
        if (this.systemService.getPlatform() === 'darwin') {
            if (this.systemService.getCPUArchitecture() === 'arm64') {
                return OsName.MACOS_M1;
            }
            return OsName.MACOS;
        }
        return OsName.LINUX;
    }
    getDefaultFileSystem(osName) {
        if (osName === OsName.LINUX) {
            return FileSystem.LINUX_DEFAULT;
        }
        else {
            return FileSystem.MACOS_DEFAULT;
        }
    }
    mapServices(rawServices) {
        let result = [];
        for (const i in rawServices) {
            const rawServiceGroup = rawServices[i];
            let serviceGroupItems = [];
            for (const j in rawServiceGroup['services']) {
                const rawService = rawServiceGroup['services'][j];
                serviceGroupItems.push({
                    name: rawService['name'],
                    enabled: typeof rawService['enabled'] === "boolean" ? rawService['enabled'] : true
                });
            }
            result.push({
                group: rawServiceGroup['group'],
                services: serviceGroupItems
            });
        }
        return result;
    }
}
exports.ConfigService = ConfigService;
//# sourceMappingURL=ConfigService.js.map