import {HostsCommand} from './commands/HostsCommand';
import {ServicesPsCommand} from "./commands/ServicesPsCommand";
import {SystemService} from "./services/SystemService";
import {ConfigService, FileSystem, OsName} from "./services/ConfigService";
import {DockerHostService} from "./services/DockerHostService";
import {DnsCommand} from "./commands/DnsCommand";
import {DnsService} from "./services/DnsService";
import {ServicesUpCommand} from "./commands/ServicesUpCommand";
import {ServicesDownCommand} from "./commands/ServicesDownCommand";
import {ServicesBuildCommand} from "./commands/ServicesBuildCommand";

const { program } = require("commander");

const configService = new ConfigService({
    pathToGatewayProject: './projects/gateway',
    pathToDockerConfig: '/var/www/localenv/docker-compose.yml',
    osName: OsName.LINUX,
    fileSystem: FileSystem.LINUX_DEFAULT,
    servicesRestartPolicy: 'always',
    enabledServices: []
});
const systemService = new SystemService();
const dockerHostService = new DockerHostService(configService);
const dnsService = new DnsService(configService, dockerHostService);

program
    .name('nika')
    .description('Small Docker Dev Environment');
program
    .command('hosts')
    .action(() => { (new HostsCommand(dockerHostService)).invoke(); });
program
    .command('dns')
    .action(() => { (new DnsCommand(dnsService)).invoke(); });
program
    .command('services-ps')
    .action(() => { (new ServicesPsCommand(configService, systemService)).invoke(); });
program
    .command('services-up')
    .action(() => { (new ServicesUpCommand(configService, systemService)).invoke(); });
program
    .command('services-down')
    .action(() => { (new ServicesDownCommand(configService, systemService)).invoke(); });
program
    .command('services-build')
    .action(() => { (new ServicesBuildCommand(configService, systemService)).invoke(); });
program.parse();







