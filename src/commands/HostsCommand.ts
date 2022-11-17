import {DockerService, DockerServiceDTO} from '../services/DockerService';

export class HostsCommand {
    dockerHostService: DockerService;

    constructor(dockerHostService: DockerService) {
        this.dockerHostService = dockerHostService;
    }

    public invoke(): void {
        this.dockerHostService.listingAll().filter(x => x.enabled).forEach((host: DockerServiceDTO) => {
            host.domains.forEach((domain: string) => {
                console.log(`${this.printHostDetails(host, domain)}`);
            });
        });

        this.dockerHostService.listingAll().filter(x => !x.enabled).forEach((host: DockerServiceDTO) => {
            host.domains.forEach((domain: string) => {
                console.log(`[DISABLED] ${this.printHostDetails(host, domain)}`);
            });
        });
    }

    public printHostDetails(host: DockerServiceDTO, domain: string ): string {
        return `http://${host.externalHost}:${host.externalPort} | http://${domain}`;
    }
}