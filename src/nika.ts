import {HostsCommand} from './commands/HostsCommand';
import {StatusCommand} from './commands/StatusCommand';
import {InstallCommand} from './commands/InstallCommand';
import {ServicesPsCommand} from "./commands/ServicesPsCommand";
import {SystemService} from "./services/SystemService";
import {ConfigService} from "./services/ConfigService";
import {DockerService} from "./services/DockerService";
import {DnsCommand} from "./commands/DnsCommand";
import {DnsService} from "./services/DnsService";
import {LoggerService} from "./services/LoggerService";
import {ServicesUpCommand} from "./commands/ServicesUpCommand";
import {ServicesDownCommand} from "./commands/ServicesDownCommand";
import {ServicesBuildCommand} from "./commands/ServicesBuildCommand";
import {ServicesInitCommand} from "./commands/ServicesInitCommand";
import {TemplateService} from "./services/TemplateService";
import {FileSystemService} from "./services/FileSystemService";
import {ProjectsPullCommand} from "./commands/ProjectsPullCommand";
import {ProjectsInitCommand} from "./commands/ProjectsInitCommand";
import {StatusService} from "./services/StatusService";
import {InstallService} from "./services/InstallService";

const { program } = require("commander");
const figlet = require("figlet");

const systemService = new SystemService();
const fileSystemService = new FileSystemService(systemService);
const configService = new ConfigService(fileSystemService, systemService);
const userConfig = configService.buildUserConfig();
const defaultConfig = configService.buildDefaultConfig();
const loggerService = new LoggerService();
const installService = new InstallService(defaultConfig, userConfig);
const dockerService = new DockerService(userConfig, fileSystemService);
const dnsService = new DnsService(userConfig, dockerService, fileSystemService, loggerService);
const templateService = new TemplateService(userConfig, fileSystemService, dockerService, loggerService);
const statusService = new StatusService(userConfig, loggerService);

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
    .action(() => { (new HostsCommand(dockerService, loggerService)).invoke(); });
program
    .command('status')
    .description('Display current configuration')
    .action(() => { (new StatusCommand(statusService)).invoke(); });
program
    .command('install')
    .description('Change current configuration')
    .action(() => { (new InstallCommand(defaultConfig, configService, installService, loggerService)).invoke(); });
program
    .command('dns')
    .description('Configure nginx gateway and /etc/hosts for local domain names')
    .action(() => { (new DnsCommand(dnsService)).invoke(); });
program
    .command('projects-init')
    .description('Clone all GIT repositories specified in projects list')
    .action(() => { (new ProjectsInitCommand(userConfig, systemService, fileSystemService, loggerService)).invoke(); });
program
    .command('projects-pull')
    .description('Fetch latest changes from GIT repositories specified in projects list')
    .action(() => { (new ProjectsPullCommand(userConfig, systemService, loggerService)).invoke(); });
program
    .command('services-init')
    .description('Rebuild docker files in services folder')
    .action(() => { (new ServicesInitCommand(templateService)).invoke(); });
program
    .command('services-ps')
    .description('List all running docker containers')
    .action(() => { (new ServicesPsCommand(userConfig, systemService)).invoke(); });
program
    .command('services-up')
    .description('Create and start containers')
    .action(() => { (new ServicesUpCommand(userConfig, systemService)).invoke(); });
program
    .command('services-down')
    .description('Stop and remove containers, networks')
    .action(() => { (new ServicesDownCommand(userConfig, systemService)).invoke(); });
program
    .command('services-build')
    .description('Pull service images and build or rebuild services')
    .action(() => { (new ServicesBuildCommand(userConfig, systemService)).invoke(); });
program.parse();
