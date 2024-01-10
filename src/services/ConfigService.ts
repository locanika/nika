import {SystemService} from "./SystemService";
import {FileSystemService} from "./FileSystemService";

const yaml = require('js-yaml');

export enum OsName {
    LINUX = 'linux',
    MACOS = 'macos',
    MACOS_M1 = 'macos_m1'
}

export enum FileSystem {
    LINUX_DEFAULT = 'linux_default',
    MACOS_DEFAULT = 'macos_default',
    MACOS_MUTAGEN = 'macos_mutagen'
}

export enum DockerMode {
    ROOT_LESS = 'root_less',
    ROOT = 'root'
}

export enum ServiceType {
    SEPARATOR = 'separator',
    SERVICE = 'service'
}

export interface ProjectDTO {
    name: string,
    src: string
}

export interface ServiceDTO {
    type: ServiceType,
    name: string,
    enabled: boolean
}

export interface ConfigDTO {
    pathToDockerConfig: string,
    pathToGatewayProject: string,
    osName: OsName,
    fileSystem: FileSystem,
    dockerMode: DockerMode,
    servicesRestartPolicy: string,
    projects: ProjectDTO[],
    services: ServiceDTO[]
}

export class ConfigService {
    constructor(private fileSystemService: FileSystemService, private systemService: SystemService) {
    }

    public build(): ConfigDTO {
        let config = {
            os_name: null,
            file_system: null,
            docker_mode: DockerMode.ROOT,
            services_restart_policy: 'always',
            projects: [],
            services: []
        };

        if (this.fileSystemService.existsSync('./config.yml')) {
            config = { ...config, ...yaml.load(this.fileSystemService.readFileSync('./config.yml')) };
        }
        if (this.fileSystemService.existsSync('./config.local.yml')) {
            config = { ...config, ...yaml.load(this.fileSystemService.readFileSync('./config.local.yml')) };
        }

        const osName = this.getOsName();
        const fileSystem = config['file_system'] || this.getDefaultFileSystem(osName);

        return {
            pathToGatewayProject: './projects/gateway/',
            pathToDockerConfig: './docker-compose.yml',
            osName: osName,
            fileSystem: fileSystem,
            dockerMode: config['docker_mode'],
            servicesRestartPolicy: config['services_restart_policy'],
            projects: config['projects'],
            services: this.mapServices(config['services'])
        };
    }

    public save(newConfig: ConfigDTO): void {
        this.fileSystemService.writeFileSync('./config.local.yml', yaml.dump(newConfig));
    }

    private getOsName(): OsName {
        if (this.systemService.getPlatform() === 'darwin') {
            if (this.systemService.getCPUArchitecture() === 'arm64') {
                return OsName.MACOS_M1;
            }

            return OsName.MACOS;
        }

        return OsName.LINUX;
    }

    private getDefaultFileSystem(osName: OsName): FileSystem {
        if (osName === OsName.LINUX) {
            return FileSystem.LINUX_DEFAULT;
        } else {
            return FileSystem.MACOS_DEFAULT;
        }
    }

    private mapServices(rawServices: any[]): ServiceDTO[] {
        let result = [];

        for (const i in rawServices) {
            const rawService = rawServices[i];

            result.push({
                type: typeof rawService['type'] === "string" ? rawService['type'] : ServiceType.SERVICE,
                name: rawService['name'],
                enabled: typeof rawService['enabled'] === "boolean" ? rawService['enabled'] : true
            } as ServiceDTO);
        }

        return result;
    }
}