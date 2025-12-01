# TaskFlow DevContainer Setup

This devcontainer provides a pre-configured development environment for the TaskFlow workshop with Node.js 20, Playwright, and all necessary build tools.

## Prerequisites

### Required on Host Machine

1. **Container Runtime** - Install and ensure it's running:
   - Docker Desktop, or
   - Rancher Desktop, or
   - Podman Desktop
2. **VS Code** with **Dev Containers extension** (`ms-vscode-remote.remote-containers`)
3. **GitHub Copilot extension** (install on host before opening container):
   - GitHub Copilot Chat (`github.copilot-chat`)

### GitHub Copilot Setup

**Important:** GitHub Copilot must be installed and authenticated on your **host machine** **before** opening the devcontainer.

#### Steps:

1. Open VS Code on your host machine (not in a container)
2. Install GitHub Copilot Chat extension from the Extensions marketplace
3. Sign in to GitHub Copilot when prompted
4. Verify Copilot is working by testing it in any file on your host
5. Now you can open this project in the devcontainer

The devcontainer will automatically use your host's GitHub authentication and Copilot will work inside the container.

## Opening the DevContainer

1. Open this folder in VS Code
2. When prompted, click **"Reopen in Container"**
   - Or use Command Palette (Ctrl+Shift+P): `Dev Containers: Reopen in Container`
3. Wait for the container to build (first time takes a few minutes)
4. Once ready, the terminal will be inside the container

## What's Included

- **Node.js 20 LTS** with npm
- **Python & build tools** for native module compilation (sqlite3)
- **Playwright** with Chromium browser
- **Zscaler certificate** configured for npm/git/Node.js
- **VS Code extensions**: Playwright Test, SQLite Viewer, ESLint

## Running the App

```bash
# Development mode with auto-reload
npm run dev

# Production mode
npm start

# Run tests
npm test
```

The app will be available at `http://localhost:3000` (automatically forwarded from the container).

## Troubleshooting

### Copilot Not Working

If GitHub Copilot isn't working inside the container:

1. Make sure Copilot is installed and authenticated on your **host machine**
2. Rebuild the container: Command Palette → `Dev Containers: Rebuild Container`
3. If using Docker Desktop on Windows, check that it's using WSL 2 backend (Settings → General)

### WSL Proxy Configuration

If you're using WSL (Windows Subsystem for Linux) with a corporate proxy like Zscaler, you must configure the proxy in WSL for containers to access remote endpoints.

See the [ZScaler Issues wiki page](https://zdi-wiki.zeiss.com/spaces/SSD/pages/277487028/ZScaler+Issues) for detailed instructions on configuring the proxy in WSL.

Without proper proxy configuration, the devcontainer will fail to access the internet and cannot install dependencies.

### Build Failures

If the container fails to build due to network issues:

- Ensure Docker Desktop has internet access
- Check that Zscaler certificate is present in `.devcontainer/zscaler.crt`
- If using WSL, verify proxy configuration (see above)
- Try rebuilding: Command Palette → `Dev Containers: Rebuild Container`

### Port Already in Use

If port 3000 is already in use:

- Stop other applications using port 3000
- Or modify `forwardPorts` in `.devcontainer/devcontainer.json`
