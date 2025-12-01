FROM mcr.microsoft.com/devcontainers/javascript-node:1-20-bookworm

# Install Python, build tools, and sqlite3 CLI + headers
RUN apt-get update && export DEBIAN_FRONTEND=noninteractive \
    && apt-get -y install --no-install-recommends python3 python3-pip build-essential sqlite3 libsqlite3-dev \
    && apt-get clean -y && rm -rf /var/lib/apt/lists/*

# Copy and trust Zscaler certificate
COPY zscaler.crt /usr/local/share/ca-certificates/zscaler.crt
RUN chmod 644 /usr/local/share/ca-certificates/zscaler.crt \
    && update-ca-certificates

# Append certificate to system CA bundle for full compatibility
RUN cat /usr/local/share/ca-certificates/zscaler.crt >> /etc/ssl/certs/ca-certificates.crt

# Configure Node.js and system to use the certificate
ENV NODE_EXTRA_CA_CERTS=/etc/ssl/certs/ca-certificates.crt \
    REQUESTS_CA_BUNDLE=/etc/ssl/certs/ca-certificates.crt \
    SSL_CERT_FILE=/etc/ssl/certs/ca-certificates.crt

# Configure npm and git to use system certificates
RUN npm config set cafile /etc/ssl/certs/ca-certificates.crt -g \
    && git config --global http.sslCAInfo /etc/ssl/certs/ca-certificates.crt