"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const HostsCommand_1 = require("./commands/HostsCommand");
const ServicesPsCommand_1 = require("./commands/ServicesPsCommand");
const SystemService_1 = require("./services/SystemService");
const ConfigService_1 = require("./services/ConfigService");
const DockerService_1 = require("./services/DockerService");
const DnsCommand_1 = require("./commands/DnsCommand");
const DnsService_1 = require("./services/DnsService");
const ServicesUpCommand_1 = require("./commands/ServicesUpCommand");
const ServicesDownCommand_1 = require("./commands/ServicesDownCommand");
const ServicesBuildCommand_1 = require("./commands/ServicesBuildCommand");
const ServicesInitCommand_1 = require("./commands/ServicesInitCommand");
const { program } = require("commander");
const figlet = require("figlet");
const config = (new ConfigService_1.ConfigService()).build();
const systemService = new SystemService_1.SystemService();
const dockerService = new DockerService_1.DockerService(config);
const dnsService = new DnsService_1.DnsService(config, dockerService);
program
    .name('nika')
    .addHelpText('beforeAll', figlet.textSync("Localenv Nika"))
    .addHelpText('afterAll', `
Service Commands:
  PROJECT-ssh      Connect to PROJECT container
  PROJECT-restart  Restart PROJECT container
  PROJECT-logs     View PROJECT container logs
  PROJECT-build    Build PROJECT container
    `)
    .description('Small Docker Dev Environment');
program
    .command('hosts')
    .description('List all services with URL-s')
    .action(() => { (new HostsCommand_1.HostsCommand(dockerService)).invoke(); });
program
    .command('dns')
    .description('Configure nginx gateway and /etc/hosts for local domain names')
    .action(() => { (new DnsCommand_1.DnsCommand(dnsService)).invoke(); });
program
    .command('services-init')
    .description('Rebuild docker files in services folder')
    .action(() => { (new ServicesInitCommand_1.ServicesInitCommand(config, systemService)).invoke(); });
program
    .command('services-ps')
    .description('List all running docker containers')
    .action(() => { (new ServicesPsCommand_1.ServicesPsCommand(config, systemService)).invoke(); });
program
    .command('services-up')
    .description('Create and start containers')
    .action(() => { (new ServicesUpCommand_1.ServicesUpCommand(config, systemService)).invoke(); });
program
    .command('services-down')
    .description('Stop and remove containers, networks')
    .action(() => { (new ServicesDownCommand_1.ServicesDownCommand(config, systemService)).invoke(); });
program
    .command('services-build')
    .description('Pull service images and build or rebuild services')
    .action(() => { (new ServicesBuildCommand_1.ServicesBuildCommand(config, systemService)).invoke(); });
program.parse();
//# sourceMappingURL=nika.js.map