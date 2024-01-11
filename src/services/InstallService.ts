import {FileSystem,ConfigDTO} from "../services/ConfigService";
import inquirer from "inquirer";

export class InstallService {
    constructor(
        private defaultConfig: ConfigDTO,
        private userConfig: ConfigDTO
    ) {
    }

    fileSystemChoices(): any {
        return [
            { name: 'Linux [DEFAULT]', value: FileSystem.LINUX_DEFAULT },
            { name: 'MacOS [DEFAULT]', value: FileSystem.MACOS_DEFAULT },
            { name: 'MacOS Mutagen', value: FileSystem.MACOS_MUTAGEN }
        ];
    }

    fileSystemDefaultChoice(): number {
        const fileSystemChoices = this.fileSystemChoices();

        for (const i in fileSystemChoices) {
            if (this.userConfig.fileSystem === fileSystemChoices[i]['value']) {
                return parseInt(i, 10);
            }
        }

        return 0;
    }

    enabledServicesChoices(): any {
        let result = [];

        for (const i in this.defaultConfig.services) {
            const servicesGroup = this.defaultConfig.services[i];
            result.push(new inquirer.Separator(servicesGroup.group))

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

    private isServiceEnabled(config: ConfigDTO, serviceName: string): boolean {
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