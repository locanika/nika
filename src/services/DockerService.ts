import {ConfigDTO} from './ConfigService';

const yaml = require('js-yaml');
const fs = require('fs');
const nunjucks = require('nunjucks')

export interface DockerServiceDTO {
    enabled: boolean,
    domains: string[],
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
        const result = [];
        const rawServices = this.rawServicesListing();

        for (const serviceName in rawServices) {
            const serviceData = rawServices[serviceName];
            let serviceDomains = serviceData.environment?.DOMAINS;
            let servicePorts = serviceData?.ports;

            result.push({
                enabled: this.config.enabledServices.includes(serviceName),
                domains: !!serviceDomains ? serviceDomains.split(',') : [],
                dockerHost: serviceName,
                dockerPort: servicePorts ? servicePorts[0].split(':')[1] : '',
                externalHost: '127.0.0.1',
                externalPort: servicePorts ? servicePorts[0].split(':')[0] : '',
                corsEnabled: !!serviceData.environment?.BACKEND_API_CORS,
                raw: serviceData
            })
        }
        return result;
    }

    private rawServicesListing(): any {
        const dockerCompose = nunjucks.renderString(
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
