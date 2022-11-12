"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HostsCommand = void 0;
class HostsCommand {
    constructor(dockerHostService) {
        this.dockerHostService = dockerHostService;
    }
    invoke() {
        this.dockerHostService.listingAll().forEach(function (host) {
            console.log(`http://${host.externalHost}:${host.externalPort} | http://${host.domain}`);
        });
    }
}
exports.HostsCommand = HostsCommand;
//# sourceMappingURL=HostsCommand.js.map