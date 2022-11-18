const ExampleConfigTemplate = `
# In all environments, the following files are loaded if they exist, the latter taking precedence over the former:
#  * config.yml                contains default values for the local environment variables needed by the app
#  * config.local.yml          uncommitted file with local overrides

# Allowed values:
# - linux (please use ~ for auto detection)
# - macos (please use ~ for auto detection)
os_name: ~

# Allowed values:
# - linux_default (please use ~ for auto detection)
# - macos_default (please use ~ for auto detection)
# - macos_mutagen
file_system: ~

# Allowed values:
# - root_less
# - root
docker_mode: root

# Allowed values (see for more info https://docs.docker.com/config/containers/start-containers-automatically):
# - always
# - on-failure
services_restart_policy: always

projects:
#  - name: some-name
#    src: path to your GIT repo, for example git@github.com:locanika/nika.git

# List services that enabled in current local environment
enabled_services:
  # storages
  - nika-pg
  - nika-redis

  # projects
  # TODO: add your projects here

  # tools
  - nika-logs
  - nika-adminer
`;

export default ExampleConfigTemplate;