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

export interface ProjectDTO {
    name: string,
    src: string
}

export interface ServiceDTO {    
    name: string,
    enabled: boolean
}

export interface ServiceGroupDTO {
    group: string,
    services: ServiceDTO[]
}

export interface ConfigDTO {
    pathToDockerConfig: string,
    pathToGatewayProject: string,
    osName: OsName,
    fileSystem: FileSystem,
    projects: ProjectDTO[],
    services: ServiceGroupDTO[]
}

export class ConfigService {
    constructor(private fileSystemService: FileSystemService, private systemService: SystemService) {
    }

    public buildUserConfig(): ConfigDTO {
        return this.build(true);
    }

    public buildDefaultConfig(): ConfigDTO {
        return this.build(false);
    }

    private build(fetchLocalConfig: boolean): ConfigDTO {
        let config = {
            os_name: null,
            file_system: null,
            projects: [],
            services: []
        };

        if (this.fileSystemService.existsSync('./config.yml')) {
            config = { ...config, ...yaml.load(this.fileSystemService.readFileSync('./config.yml')) };
        }
        if (fetchLocalConfig && this.fileSystemService.existsSync('./config.local.yml')) {
            config = { ...config, ...yaml.load(this.fileSystemService.readFileSync('./config.local.yml')) };
        }

        const osName = this.getOsName();
        const fileSystem = config['file_system'] || this.getDefaultFileSystem(osName);

        return {
            pathToGatewayProject: './projects/gateway/',
            pathToDockerConfig: './docker-compose.yml',
            osName: osName,
            fileSystem: fileSystem,
            projects: config['projects'],
            services: this.mapServices(config['services'])
        };
    }

    public save(newConfig: ConfigDTO): void {
        this.fileSystemService.writeFileSync('./config.local.yml', yaml.dump({
            file_system: newConfig.fileSystem,
            services: newConfig.services
        }));
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

    private mapServices(rawServices: any[]): ServiceGroupDTO[] {
        let result = [];

        for (const i in rawServices) {
            const rawServiceGroup = rawServices[i];
            let serviceGroupItems = [];

            for (const j in rawServiceGroup['services']) {
                const rawService = rawServiceGroup['services'][j];

                serviceGroupItems.push({
                    name: rawService['name'],
                    enabled: typeof rawService['enabled'] === "boolean" ? rawService['enabled'] : true
                } as ServiceDTO);
            }

            result.push({
                group: rawServiceGroup['group'],
                services: serviceGroupItems
            } as ServiceGroupDTO);
        }

        return result;
    }
}