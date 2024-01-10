import {ConfigDTO} from "./ConfigService";
import {LoggerService} from "./LoggerService";

export class StatusService {
    constructor(
        private config: ConfigDTO,
        private loggerService: LoggerService
    ) {
    }

    displayStatus(): void {
        this.loggerService.warning('Operation system:');
        this.loggerService.info(this.config.osName + "\n");

        this.loggerService.warning('File system:');
        this.loggerService.info(this.config.fileSystem + "\n");

        this.loggerService.warning('Services:');
        for (const i in this.config.services) {
            const servicesGroup = this.config.services[i];

            this.loggerService.warning("  " + servicesGroup.group);
            
            for (const j in servicesGroup.services) {
                const service = servicesGroup.services[j];

                if (service.enabled) {
                    this.loggerService.info("    " + service.name);
                } else {
                    this.loggerService.warning("    [DISABLED] " + service.name);
                }
            }            
        }
    }
}