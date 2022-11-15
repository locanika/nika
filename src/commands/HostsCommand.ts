import { DockerService, DockerServiceDTO } from '../services/DockerService';

export class HostsCommand {
    dockerHostService: DockerService;

    constructor(dockerHostService: DockerService) {
        this.dockerHostService = dockerHostService;
    }

    public invoke(): void {
        this.dockerHostService.listingAll().filter(x => x.enabled).forEach((host: DockerServiceDTO) => {
            console.log(`${this.printHostDetails(host)}`);
        });

        this.dockerHostService.listingAll().filter(x => !x.enabled).forEach((host: DockerServiceDTO) => {
            console.log(`[DISABLED] ${this.printHostDetails(host)}`);
        });
    }

    public printHostDetails(host: DockerServiceDTO): string {
        return `http://${host.externalHost}:${host.externalPort} | http://${host.domain}`;
    }
}