"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DnsService = exports.GatewayConfigsPath = void 0;
const fs_1 = __importDefault(require("fs"));
const nunjucks = require('nunjucks');
var GatewayConfigsPath;
(function (GatewayConfigsPath) {
    GatewayConfigsPath["DOCKER_GATEWAY"] = "0";
    GatewayConfigsPath["EXTERNAL_GATEWAY_FOR_MACOS"] = "1";
    GatewayConfigsPath["EXTERNAL_GATEWAY_FOR_LINUX"] = "2";
})(GatewayConfigsPath = exports.GatewayConfigsPath || (exports.GatewayConfigsPath = {}));
class DnsService {
    constructor(config, dockerService) {
        this.config = config;
        this.dockerService = dockerService;
    }
    /**
     * Generate content for file /etc/hosts to allow use local domain names
     */
    generateEtcHosts() {
        let etcHosts = fs_1.default.readFileSync('/etc/hosts', 'utf8');
        this.dockerService.listingAll().forEach(function (host) {
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
        console.log('0) gateway - "' + this.config.pathToGatewayProject + '"');
        console.log('1) mac - "/usr/local/etc/nginx/servers/"');
        console.log('2) linux - "/etc/nginx/sites-enabled/"');
        console.log('or just type custom path');
        let gatewayConfigsPath = '0';
        let useDockerGateway = false;
        let self = this;
        if (gatewayConfigsPath === GatewayConfigsPath.DOCKER_GATEWAY) {
            gatewayConfigsPath = this.config.pathToGatewayProject;
            useDockerGateway = true;
            // IOService().create_directory_if_not_exists(this.config.pathToGatewayProject)
        }
        if (gatewayConfigsPath === GatewayConfigsPath.EXTERNAL_GATEWAY_FOR_MACOS) {
            gatewayConfigsPath = '/usr/local/etc/nginx/servers/';
        }
        if (gatewayConfigsPath === GatewayConfigsPath.EXTERNAL_GATEWAY_FOR_LINUX) {
            gatewayConfigsPath = '/etc/nginx/sites-enabled/';
        }
        this.dockerService.listingAll().filter(x => x.enabled).forEach(function (host) {
            let proxyPath = host.externalHost + ':' + host.externalPort;
            if (useDockerGateway) {
                proxyPath = host.dockerHost + ':' + host.dockerPort;
            }
            let gatewayConfigPath = gatewayConfigsPath + host.domain + '.conf';
            let gatewayConfig = self.generateNginxProxyConfig(host.domain, proxyPath, host.corsEnabled);
            fs_1.default.writeFileSync(gatewayConfigPath, gatewayConfig);
            console.log("Created file: " + gatewayConfigPath);
        });
    }
    generateNginxProxyConfig(host, proxyPath, corsEnabled) {
        return nunjucks.renderString(fs_1.default.readFileSync('./templates/nginx_proxy.conf', 'utf8'), {
            host: host,
            proxy_path: proxyPath,
            cors_enabled: corsEnabled
        });
    }
}
exports.DnsService = DnsService;
//# sourceMappingURL=DnsService.js.map