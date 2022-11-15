import fs from "fs";
import {ConfigDTO} from './ConfigService';
import {DockerService, DockerServiceDTO} from "./DockerService";

const nunjucks = require('nunjucks')
const readline = require('readline');

export enum GatewayConfigsPath {
    DOCKER_GATEWAY = '0',
    EXTERNAL_GATEWAY_FOR_MACOS = '1',
    EXTERNAL_GATEWAY_FOR_LINUX = '2'
}

export class DnsService {
    constructor(private config: ConfigDTO, private dockerService: DockerService) {
    }

    /**
     * Generate content for file /etc/hosts to allow use local domain names
     */
    generateEtcHosts(): void {
        let etcHosts = fs.readFileSync('/etc/hosts', 'utf8');

        this.dockerService.listingAll().forEach(function (host: DockerServiceDTO) {
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
        const rl = readline.createInterface({
            input: process.stdin, //or fileStream
            output: process.stdout
        });

        console.log('Please specify nginx configs folder')
        console.log(GatewayConfigsPath.DOCKER_GATEWAY + ') gateway - "' + this.config.pathToGatewayProject + '"')
        console.log(GatewayConfigsPath.EXTERNAL_GATEWAY_FOR_MACOS + ') macos - "/usr/local/etc/nginx/servers/"')
        console.log(GatewayConfigsPath.EXTERNAL_GATEWAY_FOR_LINUX + ') linux - "/etc/nginx/sites-enabled/"')

        let self = this;

        rl.question("or just type custom path\n", function(gatewayConfigsPath: string) {
            rl.close();

            let useDockerGateway = false;

            if (gatewayConfigsPath === GatewayConfigsPath.DOCKER_GATEWAY) {
                gatewayConfigsPath = self.config.pathToGatewayProject
                useDockerGateway = true;
                if (!fs.existsSync(self.config.pathToGatewayProject)) {
                    fs.mkdirSync(self.config.pathToGatewayProject);
                }
            }

            if (gatewayConfigsPath === GatewayConfigsPath.EXTERNAL_GATEWAY_FOR_MACOS) {
                gatewayConfigsPath = '/usr/local/etc/nginx/servers/';
            }

            if (gatewayConfigsPath === GatewayConfigsPath.EXTERNAL_GATEWAY_FOR_LINUX) {
                gatewayConfigsPath = '/etc/nginx/sites-enabled/';
            }

            self.dockerService.listingAll().filter(x => x.enabled).forEach((host: DockerServiceDTO) => {
                let proxyPath = host.externalHost + ':' + host.externalPort;
                if (useDockerGateway) {
                    proxyPath = host.dockerHost + ':' + host.dockerPort;
                }

                const gatewayConfigPath = gatewayConfigsPath + host.domain + '.conf';
                const gatewayConfig = self.generateNginxProxyConfig(host.domain, proxyPath, host.corsEnabled);
                fs.writeFileSync(gatewayConfigPath, gatewayConfig);
                console.log("Created file: " + gatewayConfigPath)
            });
        });
    }

    private generateNginxProxyConfig(host: string, proxyPath: string, corsEnabled: boolean): string {
        return nunjucks.renderString(
            fs.readFileSync('./templates/nginx_proxy.conf', 'utf8'), {
                host: host,
                proxy_path: proxyPath,
                cors_enabled: corsEnabled
            }
        );
    }
}
