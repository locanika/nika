"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HostsCommand = void 0;
class HostsCommand {
    constructor(dockerHostService, loggerService) {
        this.loggerService = loggerService;
        this.dockerHostService = dockerHostService;
    }
    invoke() {
        this.dockerHostService.listingAll().filter(x => x.enabled).forEach((host) => {
            host.domains.forEach((domain) => {
                this.loggerService.info(`${this.printHostDetails(host, domain)}`);
            });
        });
        this.dockerHostService.listingAll().filter(x => !x.enabled).forEach((host) => {
            host.domains.forEach((domain) => {
                this.loggerService.warning(`[DISABLED] ${this.printHostDetails(host, domain)}`);
            });
        });
    }
    printHostDetails(host, domain) {
        return `http://${host.externalHost}:${host.externalPort} | http://${domain}`;
    }
}
exports.HostsCommand = HostsCommand;
//# sourceMappingURL=HostsCommand.js.map