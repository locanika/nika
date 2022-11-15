import { DockerHostService, DockerHostDTO } from '../services/DockerHostService';

export class HostsCommand {
    dockerHostService: DockerHostService;

    constructor(dockerHostService: DockerHostService) {
        this.dockerHostService = dockerHostService;
    }

    public invoke(): void {
        let self = this;
        this.dockerHostService.listingAll().filter(x => x.enabled).forEach(function (host: DockerHostDTO) {
            console.log(`${self.printHostDetails(host)}`);
        });

        this.dockerHostService.listingAll().filter(x => !x.enabled).forEach(function (host: DockerHostDTO) {
            console.log(`[DISABLED] ${self.printHostDetails(host)}`);
        });
    }

    public printHostDetails(host: DockerHostDTO): string {
        return `http://${host.externalHost}:${host.externalPort} | http://${host.domain}`;
    }
}