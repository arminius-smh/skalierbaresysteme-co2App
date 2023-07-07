# skalierbare-systeme
Our CO2 APP lets you create and compare different datacenter configurations in the UK regarding their CO2 emission.

Live-Demo: https://co2appuk.duckdns.org

## Installation

### requirements

- accessible MongoDB database

### config

Edit the config.mjs file:
- Choose whether to use HTTPS or not (requires keychain and private key).
- Update the server URL (use 127.0.0.1 for local deployment).
- Modify the MongoDB connection URL.

### Docker
If you prefer to use Docker:
- **see example docker-compose.yml**
- if you want to use HTTPS, bind your keychain and private key to the Docker container.

```sh
docker compose build
docker compose up -d
```

### Docker-less
If you do not want to use Docker:
- https requires editing server/server.mjs to set your keychain and private key location

production:
```sh
npm install
npm run build
node server/server.js
```
devolopement:
- SERVER_URL in config.js has to be 'localhost'
```sh
npm install
npm run dev
node server/server.js
```
