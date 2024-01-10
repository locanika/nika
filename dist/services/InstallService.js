"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.InstallService = void 0;
const ConfigService_1 = require("../services/ConfigService");
const inquirer_1 = __importDefault(require("inquirer"));
class InstallService {
    constructor(config) {
        this.config = config;
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
            if (this.config.fileSystem === fileSystemChoices[i]['value']) {
                return parseInt(i, 10);
            }
        }
        return 0;
    }
    enabledServicesChoices() {
        let result = [];
        for (const i in this.config.services) {
            const servicesGroup = this.config.services[i];
            result.push(new inquirer_1.default.Separator(servicesGroup.group));
            for (const j in servicesGroup.services) {
                const service = servicesGroup.services[j];
                result.push({
                    name: service.name,
                    value: service.name,
                    checked: service.enabled
                });
            }
        }
        return result;
    }
}
exports.InstallService = InstallService;
//# sourceMappingURL=InstallService.js.map