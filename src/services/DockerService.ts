import {ConfigDTO} from './ConfigService';
const yaml = require('js-yaml');
const fs = require('fs');
const nunjucks = require('nunjucks')

export interface DockerServiceDTO {
    enabled: boolean,
    domain: string,
    dockerHost: string,
    dockerPort: string
    externalHost: string,
    externalPort: string,
    corsEnabled: boolean,
    raw: any
}

export class DockerService {
    constructor(private config: ConfigDTO) {
    }

    listingAll(): DockerServiceDTO[] {
        let result = [];
        let rawServices = this.rawServicesListing();

        for (let serviceName in rawServices) {
            const serviceData = rawServices[serviceName];
            let serviceDomains = serviceData.environment?.DOMAINS;

            if (!serviceDomains) {
                continue;
            }

            serviceDomains = serviceDomains.split(',');

            for (let key in serviceDomains) {
                const serviceDomain = serviceDomains[key];
                result.push({
                    enabled: this.config.enabledServices.includes(serviceName),
                    domain: serviceDomain,
                    dockerHost: serviceName,
                    dockerPort: serviceData.ports[0].split(':')[1],
                    externalHost: '127.0.0.1',
                    externalPort: serviceData.ports[0].split(':')[0],
                    corsEnabled: !!serviceData.environment?.BACKEND_API_CORS,
                    raw: serviceData
                })
            }
        }
        return result;
    }

    private rawServicesListing(): any {
        let dockerCompose = nunjucks.renderString(
            fs.readFileSync('./templates/docker-compose.j2', 'utf8'), {
                os_name: this.config.osName,
                file_system: this.config.fileSystem,
                docker_mode: this.config.dockerMode,
                services_restart_policy: this.config.servicesRestartPolicy
            }
        );
        return yaml.load(dockerCompose)['services'];
    }
}
