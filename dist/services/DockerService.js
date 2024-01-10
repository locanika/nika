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
        for (const serviceName in rawServices) {
            const serviceData = rawServices[serviceName];
            let serviceDomains = (_a = serviceData.environment) === null || _a === void 0 ? void 0 : _a.DOMAINS;
            let servicePorts = serviceData === null || serviceData === void 0 ? void 0 : serviceData.ports;
            result.push({
                enabled: this.isServiceEnabled(this.config, serviceName),
                domains: !!serviceDomains ? serviceDomains.split(',') : [],
                dockerHost: serviceName,
                dockerPort: servicePorts ? servicePorts[0].split(':')[1] : '',
                externalHost: '127.0.0.1',
                externalPort: servicePorts ? servicePorts[0].split(':')[0] : '',
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
            file_system: this.config.fileSystem,
            docker_mode: this.config.dockerMode,
            services_restart_policy: this.config.servicesRestartPolicy
        });
        return yaml.load(dockerCompose);
    }
    isServiceEnabled(config, serviceName) {
        for (const i in config.services) {
            if (config.services[i].name === serviceName && config.services[i].enabled) {
                return true;
            }
        }
        return false;
    }
}
exports.DockerService = DockerService;
//# sourceMappingURL=DockerService.js.map