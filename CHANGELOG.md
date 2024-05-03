# Changelog

All changes to the local environment Nika are documented here.

## [2.0.6] - 2024-05-03

- Update nginx teplate with a new allowed HTTP header.

## [2.0.5] - 2023-01-11

- Remove option `services_restart_policy`.

## [2.0.4] - 2023-01-11

- Split default and user configs for `install` command.

## [2.0.3] - 2023-01-11

- Disable loop for `install` command.

## [2.0.2] - 2023-01-10

- Add validation for external service ports.

## [2.0.1] - 2023-01-10

- New syntax for config.yml.
- Introduce `install` command.

## [2.0.0] - 2023-01-10

- New syntax for config.yml.
- Remove config `docker_mode` and `os_name`, right now we determine it automatically. 
- Introduce `install` command.

## [1.0.15] - 2023-12-28

- Update README.md.
- Fetch CPU architecture for M1.
- Introduce `status` command.

## [1.0.14] - 2023-12-28

- Skip nginx config generation for docker gateway because it produces errors like "host not found".

## [1.0.13] - 2022-12-14

- Generate domains for all services.

## [1.0.12] - 2022-12-14

- Support partials for docker compose.

## [1.0.11] - 2022-12-13

- Add nginx restart command hint

## [1.0.10] - 2022-12-13

- Remove dependency from infrastructure methods.
- Remove default nginx config.

## [1.0.9] - 2022-12-12

- Introduce nice logger.
- Right now no need to generate /etc/hosts because we will use localenv domain instead custom one.

## [1.0.8] - 2022-12-12

- Use child_process.execSync but keep output in console.

## [1.0.7] - 2022-11-21

- Generate docker-compose.yml for only enabled services.

## [1.0.6] - 2022-11-21

- Generate docker-compose.yml for only enabled services.

## [1.0.5] - 2022-11-21

- Generate docker-compose.yml for only enabled services.

## [1.0.4] - 2022-11-21

- Update README.
- Generate docker-compose.yml for only enabled services.

## [1.0.3] - 2022-11-21

- Update getting started
- Fixes in services-init command.

## [1.0.2] - 2022-11-21

- Fixes in services-init command.

## [1.0.1] - 2022-11-21

- Fixes in services-init command.

## [1.0.0] - 2022-11-18

- The first implementation of the local environment.

