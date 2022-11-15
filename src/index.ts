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

const { program } = require("commander");

const config = (new ConfigService()).build();
const systemService = new SystemService();
const dockerService = new DockerService(config);
const dnsService = new DnsService(config, dockerService);

program
    .name('nika')
    .description('Small Docker Dev Environment');
program
    .command('hosts')
    .action(() => { (new HostsCommand(dockerService)).invoke(); });
program
    .command('dns')
    .action(() => { (new DnsCommand(dnsService)).invoke(); });
program
    .command('services-ps')
    .action(() => { (new ServicesPsCommand(config, systemService)).invoke(); });
program
    .command('services-up')
    .action(() => { (new ServicesUpCommand(config, systemService)).invoke(); });
program
    .command('services-down')
    .action(() => { (new ServicesDownCommand(config, systemService)).invoke(); });
program
    .command('services-build')
    .action(() => { (new ServicesBuildCommand(config, systemService)).invoke(); });
program.parse();







