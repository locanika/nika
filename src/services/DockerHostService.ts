import { ConfigService } from './ConfigService';

export interface DockerHostDTO {
    domain: string,
    dockerHost: string,
    dockerPort: string
    externalHost: string,
    externalPort: string,
    corsEnabled: boolean
}

export class DockerHostService {
    constructor(private configService: ConfigService) {
    }

    listingAll(): DockerHostDTO[] {
        let result = [];

        for (let serviceName in this.configService.dockerServices()) {
            const serviceData = this.configService.dockerServices()[serviceName];
            let serviceDomains = serviceData.environment?.DOMAINS;

            if (!serviceDomains) {
                continue;
            }

            serviceDomains = serviceDomains.split(',');

            for (let key in serviceDomains) {
                const serviceDomain = serviceDomains[key];
                result.push({
                    domain: serviceDomain,
                    dockerHost: serviceName,
                    dockerPort: serviceData.ports[0].split(':')[1],
                    externalHost: '127.0.0.1',
                    externalPort: serviceData.ports[0].split(':')[0],
                    corsEnabled: !!serviceData.environment?.BACKEND_API_CORS
                })
            }
        }
        return result;
    }
}
