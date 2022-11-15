import fs from "fs";
import {ConfigDTO} from './ConfigService';
import {DockerHostDTO, DockerHostService} from "./DockerHostService";

export class DnsService {
    constructor(private config: ConfigDTO, private dockerHostService: DockerHostService) {
    }

    /**
     * Generate content for file /etc/hosts to allow use local domain names
     */
    generateEtcHosts(): void {
        let etcHosts = fs.readFileSync('/etc/hosts', 'utf8');

        this.dockerHostService.listingAll().forEach(function (host: DockerHostDTO) {
            if (!etcHosts.includes(host.domain)) {
                etcHosts += "127.0.0.1 " + host.domain + "\n"
            }
        });

        fs.writeFileSync('/etc/hosts', etcHosts);
        console.log("Configured /etc/hosts file")
    }

    /**
     * Generate config for proxy nginx to allow use local domain names
     */
    generateGatewayConfigs(): void {
        console.log('Please specify nginx configs folder (0, 1 or 2)')
        console.log('0) gateway - "' + this.config.pathToGatewayProject + '"')
        console.log('1) mac - "/usr/local/etc/nginx/servers/"')
        console.log('2) linux - "/etc/nginx/sites-enabled/"')
        console.log('or just type custom path')

        let gatewayConfigsPath = '1';
        let useDockerGateway = false;

        // if (gatewayConfigsPath === '0') {
        //     gatewayConfigsPath = this.config.pathToGatewayProject
        //     useDockerGateway = true;
        //     IOService().create_directory_if_not_exists(this.config.pathToGatewayProject)
        // }
        //
        // if (gatewayConfigsPath === '1') {
        //     gatewayConfigsPath = '/usr/local/etc/nginx/servers/';
        // }
        //
        //
        // if (gatewayConfigsPath === '2') {
        //     gatewayConfigsPath = '/etc/nginx/sites-enabled/';
        // }
        //
        // this.dockerHostService.listingAll().forEach(function (host: DockerHostDTO) {
        //     let proxyPath = host.externalHost + ':' + host.externalPort;
        //     if (useDockerGateway) {
        //         proxyPath = host.dockerHost + ':' + host.dockerPort;
        //     }
        //
        //     let gatewayConfigPath = gatewayConfigsPath + host.domain + '.conf';
        //     let gatewayConfig = this.generateNginxProxyConfig(host.dockerHost, proxyPath, host.corsEnabled);
        //     fs.writeFileSync(gatewayConfigPath, gatewayConfig);
        //     console.log("Created file: " + gatewayConfigPath)
        // });
    }

    generateNginxProxyConfig(host: string, proxyPath: string, corsEnabled: boolean) {
        let proxyConfig = fs.readFileSync('./templates/nginx_proxy.conf', 'utf8');
        // return proxyConfig.template({
        //     host: host,
        //     proxy_path: proxyPath,
        //     cors_enabled: corsEnabled
        // })
    }
}
