import fs from "fs";
import { ConfigService } from './ConfigService';
import { DockerHostService } from "./DockerHostService";

export class DnsService {
    constructor(private configService: ConfigService, private dockerHostService: DockerHostService) {
    }

    generateEtcHosts(): void {
        let etcHosts = fs.readFileSync('/etc/hosts', 'utf8');

        this.dockerHostService.listingAll().forEach(function (host) {
            if (!etcHosts.includes(host.domain)) {
                etcHosts += "127.0.0.1 " + host.domain + "\n"
            }
        });

        fs.writeFileSync('/etc/hosts', etcHosts);
        console.log("Configured /etc/hosts file")
    }

    generateGatewayConfigs(): void {

    }

    generateNginxProxyConfig(self, host, proxy_path, backend_api_cors) {

    }
}
