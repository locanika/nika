import { DockerService, DockerServiceDTO } from '../services/DockerService';

export class HostsCommand {
    dockerHostService: DockerService;

    constructor(dockerHostService: DockerService) {
        this.dockerHostService = dockerHostService;
    }

    public invoke(): void {
        let self = this;
        this.dockerHostService.listingAll().filter(x => x.enabled).forEach(function (host: DockerServiceDTO) {
            console.log(`${self.printHostDetails(host)}`);
        });

        this.dockerHostService.listingAll().filter(x => !x.enabled).forEach(function (host: DockerServiceDTO) {
            console.log(`[DISABLED] ${self.printHostDetails(host)}`);
        });
    }

    public printHostDetails(host: DockerServiceDTO): string {
        return `http://${host.externalHost}:${host.externalPort} | http://${host.domain}`;
    }
}