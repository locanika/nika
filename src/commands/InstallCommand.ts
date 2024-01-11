import inquirer from 'inquirer';
import {ConfigDTO, ConfigService} from "../services/ConfigService";
import {LoggerService} from "../services/LoggerService";
import {InstallService} from "../services/InstallService";
import {ServiceDTO, ServiceGroupDTO} from "../services/ConfigService";

export class InstallCommand {
    constructor(
        private defaultConfig: ConfigDTO,
        private configService: ConfigService,
        private installService: InstallService,
        private logger: LoggerService
    ) {
    }

    public invoke(): void {
        inquirer
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
            .then((answers: any) => {
                this.configService.save(this.mapAnswersToConfigDTO(answers));
                this.logger.info('Local config updated');
            });
    }

    private mapAnswersToConfigDTO(answers: any): ConfigDTO {
        let configServices = [];

        for (const i in this.defaultConfig.services) {
            const serviceGroup = this.defaultConfig.services[i];
            let serviceGroupItems = [];

            for (const j in serviceGroup.services) {
                const service = serviceGroup.services[j];

                serviceGroupItems.push({
                    name: service.name,
                    enabled: answers.enabledServices.includes(service.name)
                } as ServiceDTO);
            }

            configServices.push({
                group: serviceGroup.group,
                services: serviceGroupItems
            } as ServiceGroupDTO);
        }

        return {
            pathToGatewayProject: this.defaultConfig.pathToGatewayProject,
            pathToDockerConfig: this.defaultConfig.pathToDockerConfig,
            osName: this.defaultConfig.osName,
            fileSystem: answers.fileSystem,
            servicesRestartPolicy: this.defaultConfig.servicesRestartPolicy,
            projects: this.defaultConfig.projects,
            services: configServices
        };
    }
}