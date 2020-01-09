# Mattermost Slash App

Mattermost Integration App for Slash Commands

## Overview

The repository is built using `expressJS` to implment a lightweight RESTful API app for Mattermost. The following runs through how to quickly setup the App integration with a Dockerized Mattermost container. The repository is tested against the [Mattermost Docker Setup](https://github.com/mattermost/mattermost-docker).

### Network Defaults

#### Attaching to the Mattermost Docker network

The repository is initially setup to use docker and connects to the default docker network. If the default docker network for Mattermost is not used, `docker-compose.yml` will need to be changed in order to reflect that.

#### Hostname Setup

The hostname on the docker network is setup as its service-name (`mmslash`) which will be used to access `expressJS`.

## Mattermost Setup

In order for Mattermost to connect to other applications, hostnames need to be whitelisted for approval. To approve the app for this service, edit the file `volumes/app/mattermost/config/config.json` and add the hostname to the space-delimited whitelist string `AllowUntrustedInternalConnections`.

```
...
"AllowedUntrustedInternalConnections": "mmslash"
...
```

## Adding Custom Slash Integrations

The app is serviced through port `80`. To service a custom slash command, point the URL to `http://mmslash/weather` to access the `/weather` endpoint.

Currently the following endpoints are provided through this app:

| App Name | Type | Format | Description |
|:---------------|:--------|:-----------|:-------------------------------------|
| [`/weather`](#weather) | `GET` | `/weather` | Displays the weather using OpenWeatherMap for a predefined location |

### API Keys

API keys are to be kept private and secure. To that end, in a production setup, API keys are passed in and called from environment variables. Some important notes to keep in mind:

- Closing or Opening a new terminal will remove any defined environment variables and will need to be redeclared
- Using `sudo` runs with separate environment variables, use `sudo -E [command]` when executing with `sudo` (or run as root user)
- Set an environment variable by running for the current terminal session by running `export API_KEY=<API_KEY_GOES_HERE>`

## Endpoint Details

#### `/weather`

The OpenWeatherMap API requires an API_KEY which is declared by setting the `OPENWEATHERMAP_API_KEY` environment variable.


# Running the MM-Slash App

Once the app is configured, run the following commands:

```bash
docker-compose build
docker-compose up -d
```

The Mattermost docker containers must be already running for the App to attach to its network (or the network must already exist). 