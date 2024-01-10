import {FileSystem} from "../services/ConfigService";
import inquirer from "inquirer";
import {ConfigDTO} from "locanika/src/services/ConfigService";

export class InstallService {
    constructor(
        private config: ConfigDTO
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
            if (this.config.fileSystem === fileSystemChoices[i]['value']) {
                return parseInt(i, 10);
            }
        }

        return 0;
    }

    enabledServicesChoices(): any {
        let result = [];

        for (const i in this.config.services) {
            const servicesGroup = this.config.services[i];
            result.push(new inquirer.Separator(servicesGroup.group))

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