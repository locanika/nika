import {ConfigDTO, ServiceType} from "./ConfigService";
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

        this.loggerService.warning('Docker mode:');
        this.loggerService.info(this.config.dockerMode + "\n");

        this.loggerService.warning('Services:');
        for (const i in this.config.services) {
            const service = this.config.services[i];

            if (service.type === ServiceType.SEPARATOR) {
                this.loggerService.warning("  " + service.name);
            } else {
                if (service.enabled) {
                    this.loggerService.info("    " + service.name);
                } else {
                    this.loggerService.warning("    " + service.name + " [DISABLED]");
                }
            }
        }
    }
}