"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.InstallCommand = void 0;
const inquirer_1 = __importDefault(require("inquirer"));
class InstallCommand {
    constructor(config, configService, installService, logger) {
        this.config = config;
        this.configService = configService;
        this.installService = installService;
        this.logger = logger;
    }
    invoke() {
        inquirer_1.default
            .prompt([
            {
                type: 'rawlist',
                message: 'Select file system or press ENTER for select default option',
                name: 'fileSystem',
                choices: this.installService.fileSystemChoices(),
                default: this.installService.fileSystemDefaultChoice(),
            },
            {
                type: 'checkbox',
                message: 'Enabled services',
                name: 'enabledServices',
                pageSize: 20,
                choices: this.installService.enabledServicesChoices(),
                loop: false
            }
        ])
            .then((answers) => {
            this.configService.save(this.mapAnswersToConfigDTO(answers));
            this.logger.info('Local config updated');
        });
    }
    mapAnswersToConfigDTO(answers) {
        let configServices = [];
        for (const i in this.config.services) {
            const serviceGroup = this.config.services[i];
            let serviceGroupItems = [];
            for (const j in serviceGroup.services) {
                const service = serviceGroup.services[j];
                serviceGroupItems.push({
                    name: service.name,
                    enabled: answers.enabledServices.includes(service.name)
                });
            }
            configServices.push({
                group: serviceGroup.group,
                services: serviceGroupItems
            });
        }
        return {
            pathToGatewayProject: this.config.pathToGatewayProject,
            pathToDockerConfig: this.config.pathToDockerConfig,
            osName: this.config.osName,
            fileSystem: answers.fileSystem,
            servicesRestartPolicy: this.config.servicesRestartPolicy,
            projects: this.config.projects,
            services: configServices
        };
    }
}
exports.InstallCommand = InstallCommand;
//# sourceMappingURL=InstallCommand.js.map