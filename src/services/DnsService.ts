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
            host.domains.forEach((domain: string) => {
                if (!etcHosts.includes(domain)) {
                    etcHosts += "127.0.0.1 " + domain + "\n"
                }
            });
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
            gatewayConfigsPath = self.getGatewayConfigsPath(gatewayConfigsPath);
            self.dockerService.listingAll().filter(x => x.enabled).forEach((host: DockerServiceDTO) => {
                self.generateNginxProxyConfig(gatewayConfigsPath, host);
            });
        });
    }

    private getGatewayConfigsPath(gatewayConfigsPath: string): string {
        if (gatewayConfigsPath === GatewayConfigsPath.DOCKER_GATEWAY) {
            gatewayConfigsPath = this.config.pathToGatewayProject

        }

        if (gatewayConfigsPath === GatewayConfigsPath.EXTERNAL_GATEWAY_FOR_MACOS) {
            gatewayConfigsPath = '/usr/local/etc/nginx/servers/';
        }

        if (gatewayConfigsPath === GatewayConfigsPath.EXTERNAL_GATEWAY_FOR_LINUX) {
            gatewayConfigsPath = '/etc/nginx/sites-enabled/';
        }

        if (!fs.existsSync(gatewayConfigsPath)) {
            fs.mkdirSync(gatewayConfigsPath);
        }

        return gatewayConfigsPath;
    }

    private generateNginxProxyConfig(gatewayConfigsPath: string, host: DockerServiceDTO): void {
        let proxyPath = host.externalHost + ':' + host.externalPort;
        if (gatewayConfigsPath === GatewayConfigsPath.DOCKER_GATEWAY) {
            proxyPath = host.dockerHost + ':' + host.dockerPort;
        }

        host.domains.forEach((domain: string) => {
            const gatewayConfigPath = gatewayConfigsPath + domain + '.conf';
            const gatewayConfig =  nunjucks.renderString(
                fs.readFileSync('./templates/nginx_proxy.conf', 'utf8'), {
                    host: host,
                    proxy_path: proxyPath,
                    cors_enabled: host.corsEnabled
                }
            );

            fs.writeFileSync(gatewayConfigPath, gatewayConfig);
            console.log("Created file: " + gatewayConfigPath)
        });
    }
}
