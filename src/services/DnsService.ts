import fs from "fs";
import {ConfigDTO} from './ConfigService';
import {DockerServiceDTO, DockerService} from "./DockerService";

import * as readline from 'node:readline/promises';
import { stdin as input, stdout as output } from 'node:process';
const nunjucks = require('nunjucks')

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
        console.log('Please specify nginx configs folder (0, 1 or 2)')
        console.log('0) gateway - "' + this.config.pathToGatewayProject + '"')
        console.log('1) mac - "/usr/local/etc/nginx/servers/"')
        console.log('2) linux - "/etc/nginx/sites-enabled/"')
        console.log('or just type custom path')

        const rl = readline.createInterface({ input, output });
        rl.close();

        let gatewayConfigsPath = '0';
        let useDockerGateway = false;
        let self = this;

        if (gatewayConfigsPath === GatewayConfigsPath.DOCKER_GATEWAY) {
            gatewayConfigsPath = this.config.pathToGatewayProject
            useDockerGateway = true;
            // IOService().create_directory_if_not_exists(this.config.pathToGatewayProject)
        }

        if (gatewayConfigsPath === GatewayConfigsPath.EXTERNAL_GATEWAY_FOR_MACOS) {
            gatewayConfigsPath = '/usr/local/etc/nginx/servers/';
        }


        if (gatewayConfigsPath === GatewayConfigsPath.EXTERNAL_GATEWAY_FOR_LINUX) {
            gatewayConfigsPath = '/etc/nginx/sites-enabled/';
        }

        this.dockerService.listingAll().filter(x => x.enabled).forEach(function (host: DockerServiceDTO) {
            let proxyPath = host.externalHost + ':' + host.externalPort;
            if (useDockerGateway) {
                proxyPath = host.dockerHost + ':' + host.dockerPort;
            }

            let gatewayConfigPath = gatewayConfigsPath + host.domain + '.conf';
            let gatewayConfig = self.generateNginxProxyConfig(host.dockerHost, proxyPath, host.corsEnabled);
            fs.writeFileSync(gatewayConfigPath, gatewayConfig);
            console.log("Created file: " + gatewayConfigPath)
        });
    }

    generateNginxProxyConfig(host: string, proxyPath: string, corsEnabled: boolean): string {
        let proxyConfig = fs.readFileSync('./templates/nginx_proxy.conf', 'utf8');
        return nunjucks.renderString(
            fs.readFileSync('./templates/docker-compose.j2', 'utf8'), {
                host: host,
                proxy_path: proxyPath,
                cors_enabled: corsEnabled
            }
        );
    }
}
