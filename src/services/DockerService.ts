import {ConfigDTO} from './ConfigService';
import {FileSystemService} from "./FileSystemService";

const yaml = require('js-yaml');
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
    constructor(private config: ConfigDTO, private fileSystemService: FileSystemService) {
    }

    listingAll(): DockerServiceDTO[] {
        const result = [];
        const rawServices = this.rawData()['services'];

        for (const serviceName in rawServices) {
            const serviceData = rawServices[serviceName];
            let serviceDomains = serviceData.environment?.DOMAINS;
            let servicePorts = serviceData?.ports;

            result.push({
                enabled: this.isServiceEnabled(this.config, serviceName),
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

    rawData(): any {
        nunjucks.configure('./templates/');
        const dockerCompose = nunjucks.renderString(
            this.fileSystemService.readFileSync('./templates/docker-compose.j2'), {
                os_name: this.config.osName,
                file_system: this.config.fileSystem,
                services_restart_policy: this.config.servicesRestartPolicy
            }
        );
        return yaml.load(dockerCompose);
    }

    private isServiceEnabled(config: ConfigDTO, serviceName: string): boolean {
        for (const i in config.services) {
            for (const j in config.services[i].services) {
                const service = config.services[i].services[j];

                if (service.name === serviceName && service.enabled) {
                    return true;
                }
            }
        }

        return false;
    }
}
