"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DockerService = void 0;
const yaml = require('js-yaml');
const nunjucks = require('nunjucks');
class DockerService {
    constructor(config, fileSystemService) {
        this.config = config;
        this.fileSystemService = fileSystemService;
    }
    listingAll() {
        var _a, _b;
        const result = [];
        const rawServices = this.rawData()['services'];
        let externalPorts = [];
        for (const serviceName in rawServices) {
            const serviceData = rawServices[serviceName];
            const serviceDomains = (_a = serviceData.environment) === null || _a === void 0 ? void 0 : _a.DOMAINS;
            const servicePorts = serviceData === null || serviceData === void 0 ? void 0 : serviceData.ports;
            const externalPort = servicePorts ? servicePorts[0].split(':')[0] : '';
            if (externalPort !== '') {
                if (externalPorts.includes(externalPort)) {
                    throw new Error('Port ' + externalPort + ' used by multiple services');
                }
                externalPorts.push(externalPort);
            }
            result.push({
                enabled: this.isServiceEnabled(this.config, serviceName),
                domains: !!serviceDomains ? serviceDomains.split(',') : [],
                dockerHost: serviceName,
                dockerPort: servicePorts ? servicePorts[0].split(':')[1] : '',
                externalHost: '127.0.0.1',
                externalPort: externalPort,
                corsEnabled: !!((_b = serviceData.environment) === null || _b === void 0 ? void 0 : _b.BACKEND_API_CORS),
                raw: serviceData
            });
        }
        return result;
    }
    rawData() {
        nunjucks.configure('./templates/');
        const dockerCompose = nunjucks.renderString(this.fileSystemService.readFileSync('./templates/docker-compose.j2'), {
            os_name: this.config.osName,
            file_system: this.config.fileSystem
        });
        return yaml.load(dockerCompose);
    }
    isServiceEnabled(config, serviceName) {
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
exports.DockerService = DockerService;
//# sourceMappingURL=DockerService.js.map