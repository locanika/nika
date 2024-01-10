import inquirer from 'inquirer';
import {ConfigDTO, ConfigService} from "../services/ConfigService";
import {LoggerService} from "../services/LoggerService";
import {InstallService} from "locanika/src/services/InstallService";
import {ServiceDTO, ServiceGroupDTO} from "locanika/src/services/ConfigService";

export class InstallCommand {
    constructor(
        private config: ConfigDTO,
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
                    choices: this.installService.enabledServicesChoices()
                }
            ])
            .then((answers: any) => {
                this.configService.save(this.mapAnswersToConfigDTO(answers));
                this.logger.info('Local config updated');
            });
    }

    private mapAnswersToConfigDTO(answers: any): ConfigDTO {
        let configServices = [];

        for (const i in this.config.services) {
            const serviceGroup = this.config.services[i];
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