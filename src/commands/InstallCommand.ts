import inquirer from 'inquirer';
import {FileSystem, ServiceType} from "../services/ConfigService";
import {ConfigDTO, ConfigService} from "locanika/src/services/ConfigService";
import {LoggerService} from "../services/LoggerService";

export class InstallCommand {
    constructor(
        private config: ConfigDTO,
        private configService: ConfigService,
        private logger: LoggerService
    ) {
    }

    public invoke(): void {
        inquirer
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
            .then((answers: any) => {
                this.configService.save(this.config);
                this.logger.info('Local config updated');
            });
    }

    private fileSystemChoices(): any {
        return [
            { name: 'linux_default', value: FileSystem.LINUX_DEFAULT },
            { name: 'macos_default', value: FileSystem.MACOS_DEFAULT },
            { name: 'macos_mutagen', value: FileSystem.MACOS_MUTAGEN }
        ];
    }

    private enabledServicesChoices(): any {
        let result = [];

        for (const i in this.config.services) {
            const service = this.config.services[i];

            if (service.type === ServiceType.SEPARATOR) {
                result.push(new inquirer.Separator(service.name))
            } else {
                result.push(
                    {
                        name: service.name,
                        value: service.name,
                        checked: service.enabled
                    }
                )
            }
        }

        return result;
    }
}