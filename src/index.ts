import { HostsCommand } from './commands/HostsCommand';
import { ServicesPsCommand } from "./commands/ServicesPsCommand";
import { SystemService } from "./services/SystemService";
import { ConfigService } from "./services/ConfigService";
import { DockerHostService } from "./services/DockerHostService";
import { DnsCommand } from "./commands/DnsCommand";
import { DnsService } from "./services/DnsService";
const { program } = require("commander");

const configService = new ConfigService({
    pathToDockerConfig: '/var/www/localenv/docker-compose.yml',
    osName: 'linux',
    fileSystem: 'linux_default',
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
program.parse();







