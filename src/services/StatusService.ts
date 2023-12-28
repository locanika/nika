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
        this.loggerService.warning('Docker mode:');
        this.loggerService.info(this.config.dockerMode + "\n");
        this.loggerService.warning('Enabled services:');
        this.loggerService.info(this.config.enabledServices.sort().join("\n") + "\n");
    }
}