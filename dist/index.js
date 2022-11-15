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
const ServicesBuildCommand_1 = require("./commands/ServicesBuildCommand");
const { program } = require("commander");
const config = (new ConfigService_1.ConfigService()).build();
const systemService = new SystemService_1.SystemService();
const dockerHostService = new DockerHostService_1.DockerHostService(config);
const dnsService = new DnsService_1.DnsService(config, dockerHostService);
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
    .action(() => { (new ServicesPsCommand_1.ServicesPsCommand(config, systemService)).invoke(); });
program
    .command('services-up')
    .action(() => { (new ServicesUpCommand_1.ServicesUpCommand(config, systemService)).invoke(); });
program
    .command('services-down')
    .action(() => { (new ServicesDownCommand_1.ServicesDownCommand(config, systemService)).invoke(); });
program
    .command('services-build')
    .action(() => { (new ServicesBuildCommand_1.ServicesBuildCommand(config, systemService)).invoke(); });
program.parse();
//# sourceMappingURL=index.js.map