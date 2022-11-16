import {HostsCommand} from './commands/HostsCommand';
import {ServicesPsCommand} from "./commands/ServicesPsCommand";
import {SystemService} from "./services/SystemService";
import {ConfigService} from "./services/ConfigService";
import {DockerService} from "./services/DockerService";
import {DnsCommand} from "./commands/DnsCommand";
import {DnsService} from "./services/DnsService";
import {ServicesUpCommand} from "./commands/ServicesUpCommand";
import {ServicesDownCommand} from "./commands/ServicesDownCommand";
import {ServicesBuildCommand} from "./commands/ServicesBuildCommand";
import {ServicesInitCommand} from "./commands/ServicesInitCommand";
import {TemplateService} from "./services/TemplateService";
import {FileSystemService} from "./services/FileSystemService";
import {ProjectsPullCommand} from "./commands/ProjectsPullCommand";
import {ProjectsInitCommand} from "./commands/ProjectsInitCommand";

const { program } = require("commander");
const figlet = require("figlet");

const config = (new ConfigService()).build();
const systemService = new SystemService();
const fileSystemService = new FileSystemService(systemService);
const dockerService = new DockerService(config);
const dnsService = new DnsService(config, dockerService);
const templateService = new TemplateService(config, fileSystemService);

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
    .action(() => { (new HostsCommand(dockerService)).invoke(); });
program
    .command('dns')
    .description('Configure nginx gateway and /etc/hosts for local domain names')
    .action(() => { (new DnsCommand(dnsService)).invoke(); });
program
    .command('projects-init')
    .description('Clone all GIT repositories specified in projects list')
    .action(() => { (new ProjectsInitCommand(config, systemService, fileSystemService)).invoke(); });
program
    .command('projects-pull')
    .description('Fetch latest changes from GIT repositories specified in projects list')
    .action(() => { (new ProjectsPullCommand(config, systemService)).invoke(); });
program
    .command('services-init')
    .description('Rebuild docker files in services folder')
    .action(() => { (new ServicesInitCommand(templateService)).invoke(); });
program
    .command('services-ps')
    .description('List all running docker containers')
    .action(() => { (new ServicesPsCommand(config, systemService)).invoke(); });
program
    .command('services-up')
    .description('Create and start containers')
    .action(() => { (new ServicesUpCommand(config, systemService)).invoke(); });
program
    .command('services-down')
    .description('Stop and remove containers, networks')
    .action(() => { (new ServicesDownCommand(config, systemService)).invoke(); });
program
    .command('services-build')
    .description('Pull service images and build or rebuild services')
    .action(() => { (new ServicesBuildCommand(config, systemService)).invoke(); });
program.parse();
