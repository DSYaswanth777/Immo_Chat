#!/bin/bash

# VPS Setup Script for ImmoChat
# This script prepares a fresh VPS for ImmoChat deployment

set -e

echo "🚀 Setting up VPS for ImmoChat deployment..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to show success messages
success() {
    echo -e "${GREEN}✅ $1${NC}"
}

# Function to show info messages
info() {
    echo -e "${YELLOW}ℹ️  $1${NC}"
}

# Function to show step messages
step() {
    echo -e "${BLUE}🔧 $1${NC}"
}

# Function to handle errors
error_exit() {
    echo -e "${RED}❌ Error: $1${NC}" >&2
    exit 1
}

# Check if running as root
if [[ $EUID -ne 0 ]]; then
    error_exit "This script must be run as root (use sudo)"
fi

step "Updating system packages..."
apt update && apt upgrade -y
success "System packages updated"

step "Installing essential packages..."
apt install -y curl wget git unzip software-properties-common apt-transport-https ca-certificates gnupg lsb-release ufw fail2ban
success "Essential packages installed"

step "Installing Docker..."
# Remove old Docker versions
apt remove -y docker docker-engine docker.io containerd runc 2>/dev/null || true

# Add Docker's official GPG key
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | gpg --dearmor -o /usr/share/keyrings/docker-archive-keyring.gpg

# Add Docker repository
echo "deb [arch=$(dpkg --print-architecture) signed-by=/usr/share/keyrings/docker-archive-keyring.gpg] https://download.docker.com/linux/ubuntu $(lsb_release -cs) stable" | tee /etc/apt/sources.list.d/docker.list > /dev/null

# Install Docker
apt update
apt install -y docker-ce docker-ce-cli containerd.io docker-compose-plugin
success "Docker installed"

step "Installing Docker Compose..."
curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
chmod +x /usr/local/bin/docker-compose
success "Docker Compose installed"

step "Installing Node.js..."
curl -fsSL https://deb.nodesource.com/setup_18.x | bash -
apt install -y nodejs
success "Node.js installed"

step "Configuring firewall..."
ufw --force reset
ufw default deny incoming
ufw default allow outgoing
ufw allow ssh
ufw allow 80/tcp
ufw allow 443/tcp
ufw --force enable
success "Firewall configured"

step "Configuring fail2ban..."
cat > /etc/fail2ban/jail.local << 'EOF'
[DEFAULT]
bantime = 3600
findtime = 600
maxretry = 5

[sshd]
enabled = true
port = ssh
logpath = /var/log/auth.log
maxretry = 3

[nginx-http-auth]
enabled = true
filter = nginx-http-auth
port = http,https
logpath = /var/log/nginx/error.log

[nginx-limit-req]
enabled = true
filter = nginx-limit-req
port = http,https
logpath = /var/log/nginx/error.log
maxretry = 10
EOF

systemctl enable fail2ban
systemctl start fail2ban
success "Fail2ban configured"

step "Creating application user..."
if ! id "immochat" &>/dev/null; then
    useradd -m -s /bin/bash immochat
    usermod -aG docker immochat
    success "User 'immochat' created"
else
    info "User 'immochat' already exists"
fi

step "Setting up project directory..."
mkdir -p /var/www/immochat
chown immochat:immochat /var/www/immochat
mkdir -p /var/log/immochat
chown immochat:immochat /var/log/immochat
mkdir -p /var/backups/immochat
chown immochat:immochat /var/backups/immochat
success "Project directories created"

step "Setting up SSL directory..."
mkdir -p /var/www/immochat/ssl
chown immochat:immochat /var/www/immochat/ssl
success "SSL directory created"

step "Installing Certbot for SSL certificates..."
apt install -y certbot
success "Certbot installed"

step "Configuring log rotation..."
cat > /etc/logrotate.d/immochat << 'EOF'
/var/log/immochat/*.log {
    daily
    missingok
    rotate 52
    compress
    delaycompress
    notifempty
    create 644 immochat immochat
    postrotate
        systemctl reload docker || true
    endscript
}
EOF
success "Log rotation configured"

step "Setting up system monitoring..."
apt install -y htop iotop nethogs
success "Monitoring tools installed"

step "Optimizing system for production..."
# Increase file limits
cat >> /etc/security/limits.conf << 'EOF'
immochat soft nofile 65536
immochat hard nofile 65536
EOF

# Optimize kernel parameters
cat >> /etc/sysctl.conf << 'EOF'
# Network optimizations
net.core.somaxconn = 65536
net.core.netdev_max_backlog = 5000
net.ipv4.tcp_max_syn_backlog = 65536
net.ipv4.tcp_keepalive_time = 600
net.ipv4.tcp_keepalive_intvl = 60
net.ipv4.tcp_keepalive_probes = 10
EOF

sysctl -p
success "System optimized for production"

echo ""
echo -e "${GREEN}🎉 VPS setup completed successfully!${NC}"
echo ""
echo -e "${BLUE}📋 Next steps:${NC}"
echo "1. Switch to immochat user: sudo su - immochat"
echo "2. Clone your repository: git clone <your-repo-url> /var/www/immochat"
echo "3. Copy .env.example to .env and configure: cp .env.example .env"
echo "4. Generate SSL certificates: sudo certbot certonly --standalone -d yourdomain.com"
echo "5. Copy SSL certificates to /var/www/immochat/ssl/"
echo "6. Run deployment: ./scripts/deploy.sh"
echo ""
echo -e "${BLUE}🔧 Useful commands:${NC}"
echo "- Check Docker status: systemctl status docker"
echo "- View fail2ban status: fail2ban-client status"
echo "- Check firewall status: ufw status"
echo "- Monitor system: htop"
echo ""
echo -e "${YELLOW}⚠️  Important:${NC}"
echo "- Configure your domain's DNS to point to this server"
echo "- Set up GitHub secrets for CI/CD deployment"
echo "- Configure SMTP settings in .env file"
echo "- Test the deployment thoroughly before going live"
