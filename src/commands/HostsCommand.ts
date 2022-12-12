import {DockerService, DockerServiceDTO} from '../services/DockerService';
import {LoggerService} from "../services/LoggerService";

export class HostsCommand {
    dockerHostService: DockerService;

    constructor(dockerHostService: DockerService, private loggerService: LoggerService) {
        this.dockerHostService = dockerHostService;
    }

    public invoke(): void {
        this.dockerHostService.listingAll().filter(x => x.enabled).forEach((host: DockerServiceDTO) => {
            host.domains.forEach((domain: string) => {
                this.loggerService.info(`${this.printHostDetails(host, domain)}`);
            });
        });

        this.dockerHostService.listingAll().filter(x => !x.enabled).forEach((host: DockerServiceDTO) => {
            host.domains.forEach((domain: string) => {
                this.loggerService.warning(`[DISABLED] ${this.printHostDetails(host, domain)}`);
            });
        });
    }

    public printHostDetails(host: DockerServiceDTO, domain: string ): string {
        return `http://${host.externalHost}:${host.externalPort} | http://${domain}`;
    }
}