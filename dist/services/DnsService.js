"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DnsService = exports.GatewayConfigsPath = void 0;
const fs_1 = __importDefault(require("fs"));
const nunjucks = require('nunjucks');
const readline = require('readline');
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
            host.domains.forEach((domain) => {
                if (!etcHosts.includes(domain)) {
                    etcHosts += "127.0.0.1 " + domain + "\n";
                }
            });
        });
        fs_1.default.writeFileSync('/etc/hosts', etcHosts);
        console.log("Configured /etc/hosts file");
    }
    /**
     * Generate config for proxy nginx to allow use local domain names
     */
    generateGatewayConfigs() {
        const rl = readline.createInterface({
            input: process.stdin,
            output: process.stdout
        });
        console.log('Please specify nginx configs folder');
        console.log(GatewayConfigsPath.DOCKER_GATEWAY + ') gateway - "' + this.config.pathToGatewayProject + '"');
        console.log(GatewayConfigsPath.EXTERNAL_GATEWAY_FOR_MACOS + ') macos - "/usr/local/etc/nginx/servers/"');
        console.log(GatewayConfigsPath.EXTERNAL_GATEWAY_FOR_LINUX + ') linux - "/etc/nginx/sites-enabled/"');
        let self = this;
        rl.question("or just type custom path\n", function (gatewayConfigsPath) {
            rl.close();
            gatewayConfigsPath = self.getGatewayConfigsPath(gatewayConfigsPath);
            self.dockerService.listingAll().filter(x => x.enabled).forEach((host) => {
                self.generateNginxProxyConfig(gatewayConfigsPath, host);
            });
        });
    }
    getGatewayConfigsPath(gatewayConfigsPath) {
        if (gatewayConfigsPath === GatewayConfigsPath.DOCKER_GATEWAY) {
            gatewayConfigsPath = this.config.pathToGatewayProject;
        }
        if (gatewayConfigsPath === GatewayConfigsPath.EXTERNAL_GATEWAY_FOR_MACOS) {
            gatewayConfigsPath = '/usr/local/etc/nginx/servers/';
        }
        if (gatewayConfigsPath === GatewayConfigsPath.EXTERNAL_GATEWAY_FOR_LINUX) {
            gatewayConfigsPath = '/etc/nginx/sites-enabled/';
        }
        if (!fs_1.default.existsSync(gatewayConfigsPath)) {
            fs_1.default.mkdirSync(gatewayConfigsPath);
        }
        return gatewayConfigsPath;
    }
    generateNginxProxyConfig(gatewayConfigsPath, host) {
        let proxyPath = host.externalHost + ':' + host.externalPort;
        if (gatewayConfigsPath === GatewayConfigsPath.DOCKER_GATEWAY) {
            proxyPath = host.dockerHost + ':' + host.dockerPort;
        }
        host.domains.forEach((domain) => {
            const gatewayConfigPath = gatewayConfigsPath + domain + '.conf';
            const gatewayConfig = nunjucks.renderString(fs_1.default.readFileSync('./templates/nginx_proxy.conf', 'utf8'), {
                host: host,
                proxy_path: proxyPath,
                cors_enabled: host.corsEnabled
            });
            fs_1.default.writeFileSync(gatewayConfigPath, gatewayConfig);
            console.log("Created file: " + gatewayConfigPath);
        });
    }
}
exports.DnsService = DnsService;
//# sourceMappingURL=DnsService.js.map