"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const HostsCommand_1 = require("./commands/HostsCommand");
const StatusCommand_1 = require("./commands/StatusCommand");
const InstallCommand_1 = require("./commands/InstallCommand");
const ServicesPsCommand_1 = require("./commands/ServicesPsCommand");
const SystemService_1 = require("./services/SystemService");
const ConfigService_1 = require("./services/ConfigService");
const DockerService_1 = require("./services/DockerService");
const DnsCommand_1 = require("./commands/DnsCommand");
const DnsService_1 = require("./services/DnsService");
const LoggerService_1 = require("./services/LoggerService");
const ServicesUpCommand_1 = require("./commands/ServicesUpCommand");
const ServicesDownCommand_1 = require("./commands/ServicesDownCommand");
const ServicesBuildCommand_1 = require("./commands/ServicesBuildCommand");
const ServicesInitCommand_1 = require("./commands/ServicesInitCommand");
const TemplateService_1 = require("./services/TemplateService");
const FileSystemService_1 = require("./services/FileSystemService");
const ProjectsPullCommand_1 = require("./commands/ProjectsPullCommand");
const ProjectsInitCommand_1 = require("./commands/ProjectsInitCommand");
const StatusService_1 = require("./services/StatusService");
const InstallService_1 = require("./services/InstallService");
const { program } = require("commander");
const figlet = require("figlet");
const systemService = new SystemService_1.SystemService();
const fileSystemService = new FileSystemService_1.FileSystemService(systemService);
const configService = new ConfigService_1.ConfigService(fileSystemService, systemService);
const config = configService.build();
const loggerService = new LoggerService_1.LoggerService();
const installService = new InstallService_1.InstallService(config);
const dockerService = new DockerService_1.DockerService(config, fileSystemService);
const dnsService = new DnsService_1.DnsService(config, dockerService, fileSystemService, loggerService);
const templateService = new TemplateService_1.TemplateService(config, fileSystemService, dockerService, loggerService);
const statusService = new StatusService_1.StatusService(config, loggerService);
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
    .action(() => { (new HostsCommand_1.HostsCommand(dockerService, loggerService)).invoke(); });
program
    .command('status')
    .description('Display current configuration')
    .action(() => { (new StatusCommand_1.StatusCommand(statusService)).invoke(); });
program
    .command('install')
    .description('Change current configuration')
    .action(() => { (new InstallCommand_1.InstallCommand(config, configService, installService, loggerService)).invoke(); });
program
    .command('dns')
    .description('Configure nginx gateway and /etc/hosts for local domain names')
    .action(() => { (new DnsCommand_1.DnsCommand(dnsService)).invoke(); });
program
    .command('projects-init')
    .description('Clone all GIT repositories specified in projects list')
    .action(() => { (new ProjectsInitCommand_1.ProjectsInitCommand(config, systemService, fileSystemService, loggerService)).invoke(); });
program
    .command('projects-pull')
    .description('Fetch latest changes from GIT repositories specified in projects list')
    .action(() => { (new ProjectsPullCommand_1.ProjectsPullCommand(config, systemService, loggerService)).invoke(); });
program
    .command('services-init')
    .description('Rebuild docker files in services folder')
    .action(() => { (new ServicesInitCommand_1.ServicesInitCommand(templateService)).invoke(); });
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