#!/bin/bash

# ImmoChat Deployment Script
# This script handles the deployment process on the VPS

set -e

echo "🚀 Starting ImmoChat deployment..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Configuration
PROJECT_DIR="/var/www/immochat"
BACKUP_DIR="/var/backups/immochat"
LOG_FILE="/var/log/immochat-deploy.log"

# Function to log messages
log() {
    echo "$(date '+%Y-%m-%d %H:%M:%S') - $1" | tee -a "$LOG_FILE"
}

# Function to handle errors
error_exit() {
    echo -e "${RED}❌ Error: $1${NC}" >&2
    log "ERROR: $1"
    exit 1
}

# Function to show success messages
success() {
    echo -e "${GREEN}✅ $1${NC}"
    log "SUCCESS: $1"
}

# Function to show info messages
info() {
    echo -e "${YELLOW}ℹ️  $1${NC}"
    log "INFO: $1"
}

# Check if running as root or with sudo
if [[ $EUID -eq 0 ]]; then
    error_exit "This script should not be run as root. Use a user with sudo privileges."
fi

# Check if Docker is installed
if ! command -v docker &> /dev/null; then
    error_exit "Docker is not installed. Please install Docker first."
fi

# Check if Docker Compose is installed
if ! command -v docker-compose &> /dev/null; then
    error_exit "Docker Compose is not installed. Please install Docker Compose first."
fi

# Create necessary directories
info "Creating necessary directories..."
sudo mkdir -p "$PROJECT_DIR"
sudo mkdir -p "$BACKUP_DIR"
sudo mkdir -p "$(dirname "$LOG_FILE")"

# Change to project directory
cd "$PROJECT_DIR" || error_exit "Cannot access project directory: $PROJECT_DIR"

# Check if .env file exists
if [[ ! -f .env ]]; then
    error_exit ".env file not found. Please create it with all required environment variables."
fi

# Create backup of current deployment
if [[ -d .git ]]; then
    info "Creating backup of current deployment..."
    BACKUP_NAME="backup-$(date +%Y%m%d-%H%M%S)"
    sudo cp -r "$PROJECT_DIR" "$BACKUP_DIR/$BACKUP_NAME" || error_exit "Failed to create backup"
    success "Backup created: $BACKUP_DIR/$BACKUP_NAME"
fi

# Pull latest changes from Git
info "Pulling latest changes from Git..."
git pull origin main || error_exit "Failed to pull latest changes"

# Stop existing containers
info "Stopping existing containers..."
docker-compose down || info "No containers were running"

# Build new images
info "Building new Docker images..."
docker-compose build --no-cache || error_exit "Failed to build Docker images"

# Start containers
info "Starting containers..."
docker-compose up -d || error_exit "Failed to start containers"

# Wait for database to be ready
info "Waiting for database to be ready..."
sleep 30

# Run database migrations
info "Running database migrations..."
docker-compose exec -T app npx prisma db push || error_exit "Failed to run database migrations"

# Health check
info "Performing health check..."
sleep 10

# Check if the application is responding
if curl -f http://localhost:3000/health > /dev/null 2>&1; then
    success "Application is responding to health checks"
else
    error_exit "Application health check failed"
fi

# Clean up unused Docker images
info "Cleaning up unused Docker images..."
docker image prune -f || info "No unused images to clean up"

# Show container status
info "Container status:"
docker-compose ps

success "Deployment completed successfully! 🎉"
log "Deployment completed successfully"

echo ""
echo "📊 Deployment Summary:"
echo "- Project Directory: $PROJECT_DIR"
echo "- Backup Location: $BACKUP_DIR/$BACKUP_NAME"
echo "- Log File: $LOG_FILE"
echo "- Application URL: https://$(hostname -f)"
echo ""
echo "🔧 Useful commands:"
echo "- View logs: docker-compose logs -f"
echo "- Restart services: docker-compose restart"
echo "- Stop services: docker-compose down"
echo "- View database: docker-compose exec db mysql -u root -p"
