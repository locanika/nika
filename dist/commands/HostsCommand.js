"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HostsCommand = void 0;
class HostsCommand {
    constructor(dockerHostService) {
        this.dockerHostService = dockerHostService;
    }
    invoke() {
        this.dockerHostService.listingAll().filter(x => x.enabled).forEach((host) => {
            host.domains.forEach((domain) => {
                console.log(`${this.printHostDetails(host, domain)}`);
            });
        });
        this.dockerHostService.listingAll().filter(x => !x.enabled).forEach((host) => {
            host.domains.forEach((domain) => {
                console.log(`[DISABLED] ${this.printHostDetails(host, domain)}`);
            });
        });
    }
    printHostDetails(host, domain) {
        return `http://${host.externalHost}:${host.externalPort} | http://${domain}`;
    }
}
exports.HostsCommand = HostsCommand;
//# sourceMappingURL=HostsCommand.js.map