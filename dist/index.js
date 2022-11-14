"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const HostsCommand_1 = require("./commands/HostsCommand");
const ServicesPsCommand_1 = require("./commands/ServicesPsCommand");
const SystemService_1 = require("./services/SystemService");
const ConfigService_1 = require("./services/ConfigService");
const DockerHostService_1 = require("./services/DockerHostService");
const DnsCommand_1 = require("./commands/DnsCommand");
const DnsService_1 = require("./services/DnsService");
const ServicesUpCommand_1 = require("./commands/ServicesUpCommand");
const ServicesDownCommand_1 = require("./commands/ServicesDownCommand");
const { program } = require("commander");
const configService = new ConfigService_1.ConfigService({
    pathToGatewayProject: './projects/gateway',
    pathToDockerConfig: '/var/www/localenv/docker-compose.yml',
    osName: 'linux',
    fileSystem: 'linux_default',
    servicesRestartPolicy: 'always',
    enabledServices: []
});
const systemService = new SystemService_1.SystemService();
const dockerHostService = new DockerHostService_1.DockerHostService(configService);
const dnsService = new DnsService_1.DnsService(configService, dockerHostService);
program
    .name('nika')
    .description('Small Docker Dev Environment');
program
    .command('hosts')
    .action(() => { (new HostsCommand_1.HostsCommand(dockerHostService)).invoke(); });
program
    .command('dns')
    .action(() => { (new DnsCommand_1.DnsCommand(dnsService)).invoke(); });
program
    .command('services-ps')
    .action(() => { (new ServicesPsCommand_1.ServicesPsCommand(configService, systemService)).invoke(); });
program
    .command('services-up')
    .action(() => { (new ServicesUpCommand_1.ServicesUpCommand(configService, systemService)).invoke(); });
program
    .command('services-down')
    .action(() => { (new ServicesDownCommand_1.ServicesDownCommand(configService, systemService)).invoke(); });
program.parse();
//# sourceMappingURL=index.js.map