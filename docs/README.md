# Developer local environment

This repository contains docker configurations for local development.

## Install locanika

```
npm install locanika
```

## Initial setup on MacOS

When you use localenv at the first time try install it without any additional file system (see "MacOS by default"). If it will be slow you can try use latest MacOS docker and mutagen.

### MacOS by default

- Install homebrew
```
/usr/bin/ruby -e "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/master/install)"
```
- Make sure that nodejs is installed (https://nodejs.org/en/)
```
node --version
```

Then install nika into your localenv folder:

```
npm i
```

### MacOS + Mutagen

- If You installed the latest version of Docker and want to use Mutagen anyway.
  Install Mutagen
```
brew install mutagen-io/mutagen/mutagen
brew install mutagen-io/mutagen/mutagen-compose
```
Some permission changes and `brew link mutagen` might be necessary if brew complains.

In Docker Dashboard go to `Preferences -> General` and enable `Use Docker Compose V2`.

Switch `file_system` parameter to `macos_mutagen` in `config.local.yml`.
Run Your containers as usual with
```
make services-init
make projects-init
make services-deploy
```
Any improvements/benchmarks are welcome.

- Enable folders synchronization: go to Docker Dashboard -> Preferences -> Resources -> File Sharing. Add to synchronization all directories inside the /projects.

## Initial setup on Ubuntu

**Please carefully check section about `Setup DNS` because for `gateway` option docker in Rootless mode will not work!**
- Install `docker` in Rootless (https://docs.docker.com/engine/security/rootless/) or default mode and `docker-compose`. Make sure the following environment variables are added int ~/.bashrc for Rootless mode (see output of install script for details):
```
export PATH=/usr/bin:$PATH
export DOCKER_HOST=unix:///run/user/1000/docker.sock
```
- Install nodejs (https://nodejs.org/en/)
- Then install nika into your localenv folder:

```
npm i
```

- Configure you projects:
```
make services-init
make projects-init
make services-deploy
```

After that your containers ready to usage.

## Setup DNS

### Install nginx outside docker

Use `nginx` outside docker this is default option and will allow run nodejs related services outside docker. Please install nginx on local pc. On MacOS normally Nginx is to be installed with the command:
```
brew install nginx
```
write down (copy) address where nginx was installed. Go to nginx folder, check if folder 'servers' exists, if not - create one.
On next setep you will need address for nginx instalation folder + servers. For example:
```
/opt/homebrew/Cellar/nginx/1.23.1/servers/
```
and then run this command (use custom path with copied address):
```
sudo make dns
```
Once done you can access services by local domain names (see command 'make hosts').

### Use gateway

Use gateway allow skip nginx installation ouside docker but this mode has some limitations:
- Will NOT work in Rootless mode. See details here: https://docs.docker.com/engine/security/rootless/#networking-errors.
- You can't run any nodejs related services outside the docker
- Please make sure that port 80 is available
  Just run command:
```
sudo make dns
```

and set path to option `0`

## Allowed commands

You can type following command and get list all allowed commands:

```
make help
```

Global Commands|Description
----|---
make projects-init|Clones all GIT repositories specified in `projects.json`
make projects-pull|Performs `git pull` for all GIT repositories specified in `projects.json`
make services-deploy|Runs `down`, `init`, `build` and `up` commands
make services-init|Rebuild docker files in `services` folder. Used when docker `templates` was updated
make services-build|Runs `docker-compose build` for all services
make services-down|Runs `docker-compose down` for all services
make services-up|Runs `docker-compose up -d` for all services
make services-ps|List all running docker containers
make services-clean|Cleans unused and old containers for all services
make hosts|List all services with URL-s
sudo make dns|Configure local nginx and /etc/hosts for human named services

Project-related Service Commands|Description
----|---
make {project}-ssh|Connect to Project's docker container
make {project}-restart|Restart Project's docker container
make {project}-logs|Show logs for Project's node container

## Repository structure

```
projects - source code of git projects (fetched from gitlab, github, etc) 
scripts - localenv system python scripts
services - auto-generated folder with docker configs for each project
templates - templates for services folder generation
```

## Updating the projects

During the early stages of development the configuration of project (and containers) is often got modified, in this case rebuild might be required.

To do that first you must make sure that all projects are up to date, to do that please run
```
make projects-pull
```
Then run
```
make services-deploy
```

## Disable/enable specific services

Sometimes you don't want to run all of the services. For example documentation, styles, etc. In this case, you can create the file `config.local.yml` in `localenv` root folder and set up what exactly you want to run. Please use `config.yml` as an example.

## Troubleshooting

### `ERR_CONTENT_LENGTH_MISMATCH` in browser console

When frontend is building correctly, login page is visible on localhost:port, but when accessing by local domain name we get
`GET http://courses.lms.lo/main.js net::ERR_CONTENT_LENGTH_MISMATCH 200 (OK)` error in browser console.

Another symptom:
When peeking at nginx errors: `tail -f /var/log/nginx-error.log`
and reloading the page in browser creates another error similar to this one:
`2021/10/29 15:35:14 [crit] 24005#0: *230 open() "/usr/local/var/run/nginx/proxy_temp/0/03/0000000030" failed (13: Permission denied) while reading upstream, client: 127.0.0.1, server: courses.lms.lo, request: "GET /vendor.js HTTP/1.1", upstream: "http://127.0.0.1:9012/vendor.js", host: "courses.lms.lo", referrer: "http://courses.lms.lo/"`

Solution for MacOS:

Make sure `/usr/local/var/run/nginx/proxy_temp` and its subdirectories have ownership `nobody:admin`.
Helpful command: `sudo chown -R nobody:admin /usr/local/var/run/nginx/proxy_temp/*` and restart nginx.

### Docker rabbitmq image fails with [error] Too short cookie string

See link for details: https://stackoverflow.com/questions/63384705/docker-rabbitmq-image-fails-with-error-too-short-cookie-string

Possible solution here clear docker data:

```
docker system prune
docker volume prune
```