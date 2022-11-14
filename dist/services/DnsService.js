"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DnsService = void 0;
const fs_1 = __importDefault(require("fs"));
class DnsService {
    constructor(configService, dockerHostService) {
        this.configService = configService;
        this.dockerHostService = dockerHostService;
    }
    /**
     * Generate content for file /etc/hosts to allow use local domain names
     */
    generateEtcHosts() {
        let etcHosts = fs_1.default.readFileSync('/etc/hosts', 'utf8');
        this.dockerHostService.listingAll().forEach(function (host) {
            if (!etcHosts.includes(host.domain)) {
                etcHosts += "127.0.0.1 " + host.domain + "\n";
            }
        });
        fs_1.default.writeFileSync('/etc/hosts', etcHosts);
        console.log("Configured /etc/hosts file");
    }
    /**
     * Generate config for proxy nginx to allow use local domain names
     */
    generateGatewayConfigs() {
        console.log('Please specify nginx configs folder (0, 1 or 2)');
        console.log('0) gateway - "' + this.configService.pathToGatewayProject() + '"');
        console.log('1) mac - "/usr/local/etc/nginx/servers/"');
        console.log('2) linux - "/etc/nginx/sites-enabled/"');
        console.log('or just type custom path');
        let gatewayConfigsPath = '1';
        let useDockerGateway = false;
        // if (gatewayConfigsPath === '0') {
        //     gatewayConfigsPath = this.configService.pathToGatewayProject()
        //     useDockerGateway = true;
        //     IOService().create_directory_if_not_exists(this.configService.pathToGatewayProject())
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
    generateNginxProxyConfig(host, proxyPath, corsEnabled) {
        let proxyConfig = fs_1.default.readFileSync('./templates/nginx_proxy.conf', 'utf8');
        // return proxyConfig.template({
        //     host: host,
        //     proxy_path: proxyPath,
        //     cors_enabled: corsEnabled
        // })
    }
}
exports.DnsService = DnsService;
//# sourceMappingURL=DnsService.js.map