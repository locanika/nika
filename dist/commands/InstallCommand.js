"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.InstallCommand = void 0;
const inquirer_1 = __importDefault(require("inquirer"));
const ConfigService_1 = require("../services/ConfigService");
class InstallCommand {
    constructor(config, configService, logger) {
        this.config = config;
        this.configService = configService;
        this.logger = logger;
    }
    invoke() {
        inquirer_1.default
            .prompt([
            {
                type: 'rawlist',
                message: 'File system',
                name: 'fileSystem',
                choices: this.fileSystemChoices()
            },
            {
                type: 'checkbox',
                message: 'Enabled services',
                name: 'enabledServices',
                pageSize: 20,
                choices: this.enabledServicesChoices()
            }
        ])
            .then((answers) => {
            this.configService.save(this.config);
            this.logger.info('Local config updated');
        });
    }
    fileSystemChoices() {
        return [
            { name: 'linux_default', value: ConfigService_1.FileSystem.LINUX_DEFAULT },
            { name: 'macos_default', value: ConfigService_1.FileSystem.MACOS_DEFAULT },
            { name: 'macos_mutagen', value: ConfigService_1.FileSystem.MACOS_MUTAGEN }
        ];
    }
    enabledServicesChoices() {
        let result = [];
        for (const i in this.config.services) {
            const service = this.config.services[i];
            if (service.type === ConfigService_1.ServiceType.SEPARATOR) {
                result.push(new inquirer_1.default.Separator(service.name));
            }
            else {
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
exports.InstallCommand = InstallCommand;
//# sourceMappingURL=InstallCommand.js.map