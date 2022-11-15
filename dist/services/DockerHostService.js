"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DockerHostService = void 0;
const yaml = require('js-yaml');
const fs = require('fs');
const nunjucks = require('nunjucks');
class DockerHostService {
    constructor(config) {
        this.config = config;
    }
    listingAll() {
        var _a, _b;
        let result = [];
        let rawServices = this.rawServicesListing();
        for (let serviceName in rawServices) {
            const serviceData = rawServices[serviceName];
            let serviceDomains = (_a = serviceData.environment) === null || _a === void 0 ? void 0 : _a.DOMAINS;
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
                    corsEnabled: !!((_b = serviceData.environment) === null || _b === void 0 ? void 0 : _b.BACKEND_API_CORS)
                });
            }
        }
        return result;
    }
    rawServicesListing() {
        let dockerCompose = nunjucks.renderString(fs.readFileSync('./templates/docker-compose.j2', 'utf8'), {
            os_name: this.config.osName,
            file_system: this.config.fileSystem,
            docker_mode: this.config.dockerMode,
            services_restart_policy: this.config.servicesRestartPolicy
        });
        return yaml.load(dockerCompose)['services'];
    }
}
exports.DockerHostService = DockerHostService;
//# sourceMappingURL=DockerHostService.js.map