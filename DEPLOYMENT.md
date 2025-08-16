# ImmoChat Deployment Guide

This guide covers the complete deployment process for ImmoChat on a VPS with auto-deployment via GitHub Actions.

## 📋 Prerequisites

- VPS with Ubuntu 20.04+ (2GB RAM minimum, 4GB recommended)
- Domain name pointing to your VPS
- GitHub repository with the ImmoChat code
- Google Cloud Console project (for OAuth and Maps API)
- Gmail account with App Password (for SMTP)

## 🚀 Quick Start

### 1. VPS Initial Setup

Run the VPS setup script on your fresh Ubuntu server:

```bash
# Download and run the setup script
curl -fsSL https://raw.githubusercontent.com/yourusername/immochat/main/scripts/vps-setup.sh | sudo bash
```

Or manually:

```bash
wget https://raw.githubusercontent.com/yourusername/immochat/main/scripts/vps-setup.sh
chmod +x vps-setup.sh
sudo ./vps-setup.sh
```

### 2. Clone Repository

```bash
sudo su - immochat
cd /var/www/immochat
git clone https://github.com/yourusername/immochat.git .
```

### 3. Configure Environment

```bash
cp .env.example .env
nano .env
```

Fill in all the required environment variables (see Configuration section below).

### 4. SSL Certificate Setup

```bash
# Generate SSL certificate with Certbot
sudo certbot certonly --standalone -d yourdomain.com

# Copy certificates to project directory
sudo cp /etc/letsencrypt/live/yourdomain.com/fullchain.pem /var/www/immochat/ssl/cert.pem
sudo cp /etc/letsencrypt/live/yourdomain.com/privkey.pem /var/www/immochat/ssl/key.pem
sudo chown immochat:immochat /var/www/immochat/ssl/*
```

### 5. Initial Deployment

```bash
chmod +x scripts/deploy.sh
./scripts/deploy.sh
```

## ⚙️ Configuration

### Environment Variables

Create a `.env` file with the following variables:

#### Database Configuration
```env
DATABASE_URL="mysql://immochat_user:your_password@db:3306/immochat"
```

#### NextAuth Configuration
```env
NEXTAUTH_URL="https://yourdomain.com"
NEXTAUTH_SECRET="your-super-secret-key-here"
```

#### Google OAuth Setup
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing one
3. Enable Google+ API
4. Create OAuth 2.0 credentials
5. Add your domain to authorized origins
6. Add `https://yourdomain.com/api/auth/callback/google` to authorized redirect URIs

```env
GOOGLE_CLIENT_ID="your-google-client-id.googleusercontent.com"
GOOGLE_CLIENT_SECRET="your-google-client-secret"
```

#### SMTP Configuration (Gmail)
1. Enable 2-Factor Authentication on your Gmail account
2. Generate an App Password: Account Settings → Security → App passwords
3. Use the generated password (not your regular password)

```env
SMTP_HOST="smtp.gmail.com"
SMTP_PORT="587"
SMTP_USER="your-email@gmail.com"
SMTP_PASS="your-16-character-app-password"
SMTP_FROM="ImmoChat <noreply@yourdomain.com>"
```

#### Google Maps API
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Enable Maps JavaScript API and Places API
3. Create an API key
4. Restrict the key to your domain

```env
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY="your-google-maps-api-key"
```

#### MySQL Configuration
```env
MYSQL_ROOT_PASSWORD="secure-root-password"
MYSQL_DATABASE="immochat"
MYSQL_USER="immochat_user"
MYSQL_PASSWORD="secure-user-password"
```

## 🔄 Auto-Deployment Setup

### GitHub Secrets Configuration

Add the following secrets to your GitHub repository (Settings → Secrets and variables → Actions):

#### VPS Connection
- `VPS_HOST`: Your VPS IP address or domain
- `VPS_USER`: SSH username (usually `immochat`)
- `VPS_SSH_KEY`: Private SSH key for VPS access

#### Application Configuration
- `DATABASE_URL`: Full database connection string
- `NEXTAUTH_URL`: Your application URL
- `NEXTAUTH_SECRET`: Secret key for NextAuth
- `GOOGLE_CLIENT_ID`: Google OAuth client ID
- `GOOGLE_CLIENT_SECRET`: Google OAuth client secret
- `SMTP_HOST`: SMTP server host
- `SMTP_PORT`: SMTP server port
- `SMTP_USER`: SMTP username
- `SMTP_PASS`: SMTP password
- `SMTP_FROM`: From email address
- `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY`: Google Maps API key
- `MYSQL_ROOT_PASSWORD`: MySQL root password
- `MYSQL_DATABASE`: MySQL database name
- `MYSQL_USER`: MySQL username
- `MYSQL_PASSWORD`: MySQL user password

### SSH Key Setup

1. Generate SSH key pair on your local machine:
```bash
ssh-keygen -t rsa -b 4096 -C "github-actions"
```

2. Copy public key to VPS:
```bash
ssh-copy-id -i ~/.ssh/id_rsa.pub immochat@your-vps-ip
```

3. Add private key to GitHub secrets as `VPS_SSH_KEY`

## 🐳 Docker Commands

### Basic Operations
```bash
# View running containers
docker-compose ps

# View logs
docker-compose logs -f

# Restart services
docker-compose restart

# Stop all services
docker-compose down

# Rebuild and restart
docker-compose down && docker-compose build --no-cache && docker-compose up -d
```

### Database Operations
```bash
# Access MySQL shell
docker-compose exec db mysql -u root -p

# Run Prisma migrations
docker-compose exec app npx prisma db push

# Generate Prisma client
docker-compose exec app npx prisma generate

# View database schema
docker-compose exec app npx prisma studio
```

### Maintenance
```bash
# Clean up unused Docker images
docker image prune -f

# Clean up unused volumes
docker volume prune -f

# View disk usage
docker system df

# Complete cleanup (careful!)
docker system prune -af
```

## 📊 Monitoring and Logs

### Application Logs
```bash
# View application logs
docker-compose logs -f app

# View nginx logs
docker-compose logs -f nginx

# View database logs
docker-compose logs -f db
```

### System Monitoring
```bash
# System resources
htop

# Network connections
nethogs

# Disk I/O
iotop

# Docker stats
docker stats
```

### Log Files
- Application logs: `/var/log/immochat/`
- Nginx logs: `/var/log/nginx/`
- System logs: `/var/log/syslog`
- Deployment logs: `/var/log/immochat-deploy.log`

## 🔒 Security

### SSL Certificate Renewal
```bash
# Test renewal
sudo certbot renew --dry-run

# Renew certificates
sudo certbot renew

# Copy renewed certificates
sudo cp /etc/letsencrypt/live/yourdomain.com/fullchain.pem /var/www/immochat/ssl/cert.pem
sudo cp /etc/letsencrypt/live/yourdomain.com/privkey.pem /var/www/immochat/ssl/key.pem
sudo chown immochat:immochat /var/www/immochat/ssl/*
docker-compose restart nginx
```

### Firewall Status
```bash
# Check firewall status
sudo ufw status

# Check fail2ban status
sudo fail2ban-client status
```

### Security Updates
```bash
# Update system packages
sudo apt update && sudo apt upgrade -y

# Update Docker images
docker-compose pull
docker-compose up -d
```

## 🚨 Troubleshooting

### Common Issues

#### Application won't start
1. Check logs: `docker-compose logs -f app`
2. Verify environment variables in `.env`
3. Check database connection
4. Ensure all required secrets are set

#### Database connection issues
1. Check if database container is running: `docker-compose ps`
2. Verify DATABASE_URL format
3. Check MySQL credentials
4. Test connection: `docker-compose exec app npx prisma db push`

#### SSL/HTTPS issues
1. Verify SSL certificates exist and are readable
2. Check nginx configuration
3. Ensure domain DNS is pointing to VPS
4. Test with: `curl -I https://yourdomain.com`

#### Email/OTP not working
1. Verify SMTP credentials
2. Check Gmail App Password setup
3. Test SMTP connection
4. Check application logs for email errors

### Health Checks
```bash
# Application health
curl -f http://localhost:3000/health

# Database connection test
curl -f http://localhost:3000/api/test-database-connection

# Full application test
curl -f https://yourdomain.com
```

## 📈 Performance Optimization

### Database Optimization
- Regular backups
- Index optimization
- Query performance monitoring

### Application Optimization
- Enable gzip compression (already configured in nginx)
- Optimize images and static assets
- Monitor memory usage
- Use Redis for session storage (optional)

### Server Optimization
- Monitor disk space
- Regular log rotation
- Keep system updated
- Monitor resource usage

## 🔄 Backup and Recovery

### Database Backup
```bash
# Create backup
docker-compose exec db mysqldump -u root -p immochat > backup-$(date +%Y%m%d).sql

# Restore backup
docker-compose exec -T db mysql -u root -p immochat < backup-20231201.sql
```

### Full Application Backup
```bash
# Backup entire application
tar -czf immochat-backup-$(date +%Y%m%d).tar.gz /var/www/immochat
```

## 📞 Support

For issues and questions:
1. Check the troubleshooting section above
2. Review application logs
3. Check GitHub Issues
4. Contact the development team

## 🔗 Useful Links

- [Next.js Deployment Documentation](https://nextjs.org/docs/deployment)
- [Docker Compose Documentation](https://docs.docker.com/compose/)
- [Nginx Configuration Guide](https://nginx.org/en/docs/)
- [Let's Encrypt Documentation](https://letsencrypt.org/docs/)
- [Prisma Documentation](https://www.prisma.io/docs/)
