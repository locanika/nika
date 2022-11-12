import {DnsService} from "../services/DnsService";

export class DnsCommand {
    constructor(private dnsService: DnsService) {
    }

    invoke(): void {
        this.dnsService.generateEtcHosts();
        this.dnsService.generateGatewayConfigs();
    }
}