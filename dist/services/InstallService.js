"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.InstallService = void 0;
const ConfigService_1 = require("../services/ConfigService");
const inquirer_1 = __importDefault(require("inquirer"));
class InstallService {
    constructor(defaultConfig, userConfig) {
        this.defaultConfig = defaultConfig;
        this.userConfig = userConfig;
    }
    fileSystemChoices() {
        return [
            { name: 'Linux [DEFAULT]', value: ConfigService_1.FileSystem.LINUX_DEFAULT },
            { name: 'MacOS [DEFAULT]', value: ConfigService_1.FileSystem.MACOS_DEFAULT },
            { name: 'MacOS Mutagen', value: ConfigService_1.FileSystem.MACOS_MUTAGEN }
        ];
    }
    fileSystemDefaultChoice() {
        const fileSystemChoices = this.fileSystemChoices();
        for (const i in fileSystemChoices) {
            if (this.userConfig.fileSystem === fileSystemChoices[i]['value']) {
                return parseInt(i, 10);
            }
        }
        return 0;
    }
    enabledServicesChoices() {
        let result = [];
        for (const i in this.defaultConfig.services) {
            const servicesGroup = this.defaultConfig.services[i];
            result.push(new inquirer_1.default.Separator(servicesGroup.group));
            for (const j in servicesGroup.services) {
                const service = servicesGroup.services[j];
                result.push({
                    name: service.name,
                    value: service.name,
                    checked: this.isServiceEnabled(this.userConfig, service.name)
                });
            }
        }
        return result;
    }
    isServiceEnabled(config, serviceName) {
        for (const i in config.services) {
            for (const j in config.services[i].services) {
                const service = config.services[i].services[j];
                if (service.name === serviceName && service.enabled) {
                    return true;
                }
            }
        }
        return false;
    }
}
exports.InstallService = InstallService;
//# sourceMappingURL=InstallService.js.map