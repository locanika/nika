import { DockerHostService, DockerHostDTO } from '../services/DockerHostService';

export class HostsCommand {
    dockerHostService: DockerHostService;

    constructor(dockerHostService: DockerHostService) {
        this.dockerHostService = dockerHostService;
    }

    invoke(): void {
        this.dockerHostService.listingAll().forEach(function (host: DockerHostDTO) {
            console.log(`http://${host.externalHost}:${host.externalPort} | http://${host.domain}`);
        });
    }
}