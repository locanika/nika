"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HostsCommand = void 0;
class HostsCommand {
    constructor(dockerHostService) {
        this.dockerHostService = dockerHostService;
    }
    invoke() {
        let self = this;
        this.dockerHostService.listingAll().filter(x => x.enabled).forEach(function (host) {
            console.log(`${self.printHostDetails(host)}`);
        });
        this.dockerHostService.listingAll().filter(x => !x.enabled).forEach(function (host) {
            console.log(`[DISABLED] ${self.printHostDetails(host)}`);
        });
    }
    printHostDetails(host) {
        return `http://${host.externalHost}:${host.externalPort} | http://${host.domain}`;
    }
}
exports.HostsCommand = HostsCommand;
//# sourceMappingURL=HostsCommand.js.map