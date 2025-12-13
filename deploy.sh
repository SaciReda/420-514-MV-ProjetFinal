#!/bin/bash


echo "=========================================="
echo "SPOTIFEW BACKEND DEPLOYMENT"
echo "=========================================="

# Load environment variables from prod.json file
echo "Loading environment variables from prod.json..."
if [ ! -f prod.json ]; then
    echo "Error: prod.json file not found!"
    echo "Please create prod.json file from prod.json.example first:"
    echo "cp prod.json.example prod.json"
    echo "Then edit prod.json with your real values"
    exit 1
fi

# Check if jq is installed
if ! command -v jq &> /dev/null; then
    echo "Installing jq for JSON parsing..."
    sudo apt-get update && sudo apt-get install -y jq
fi

# Export variables from prod.json file
while IFS='=' read -r key value; do
    # Remove quotes from value if present
    value=$(echo "$value" | sed 's/^"//;s/"$//')
    export "$key=$value"
done < <(jq -r 'to_entries[] | "\(.key)=\(.value)"' prod.json)
echo "Environment variables loaded successfully"

# Validate required environment variables
echo "Validating environment variables..."
required_vars=(
    "NODE_ENV"
    "SPOTIFY_CLIENT_ID"
    "SPOTIFY_CLIENT_SECRET"
    "LASTFM_API_KEY"
    "MONGO_URI"
    "API_PORT"
    "API_HOST"
    "DUCKDNS_TOKEN"
    "DOMAIN"
    "BACKEND_DOMAIN"
    "TRAEFIK_DOMAIN"
    "BACKEND_CONTAINER"
    "TRAEFIK_CONTAINER"
    "ACME_EMAIL"
)
missing_vars=()

for var in "${required_vars[@]}"; do
    value="${!var}"
    # Check if variable is empty, unset, or starts with "your-"
    if [[ -z "$value" ]] || [[ "$value" == your-* ]]; then
        missing_vars+=("$var")
    fi
done

if [ ${#missing_vars[@]} -ne 0 ]; then
    echo "Error: The following environment variables are missing from prod.json:"
    for var in "${missing_vars[@]}"; do
        echo "   - $var"
    done
    echo ""
    echo "These variables are required for:"
    echo "  - Docker Compose configuration (compose.yml)"
    echo "  - Container runtime (loaded via env-cmd from prod.json)"
    echo ""
    echo "Please edit your prod.json file with real values:"
    echo "nano prod.json"
    exit 1
fi

echo "All required environment variables are set"

# Get EC2 public IP
echo "Getting EC2 public IP..."
TOKEN=$(curl -X PUT "http://169.254.169.254/latest/api/token" -H "X-aws-ec2-metadata-token-ttl-seconds: 21600")
MY_PUBLIC_IP=$(curl -H "X-aws-ec2-metadata-token: $TOKEN" http://169.254.169.254/latest/meta-data/public-ipv4)
echo "EC2 Public IP: $MY_PUBLIC_IP"

# Extract base domain from DOMAIN
DOMAIN_BASE=$(echo "$DOMAIN" | cut -d'.' -f1)
echo "DuckDNS base domain: $DOMAIN_BASE"

# Update DuckDNS domain
echo "Updating DuckDNS domain: $DOMAIN_BASE"
echo url="https://www.duckdns.org/update?domains=$DOMAIN_BASE&token=$DUCKDNS_TOKEN&ip=$MY_PUBLIC_IP" | curl -k -K -
if [ $? -eq 0 ]; then
    echo "DuckDNS updated successfully"
else
    echo "Warning: DuckDNS update failed. Check your token and domain."
fi
sleep 3

# Clean up any existing containers and volumes
echo "Cleaning up existing containers and volumes..."
sudo -E docker compose down -v || true
sleep 5
sudo docker volume prune -f || true
sudo docker system prune -a --volumes -f || true
sleep 15

# ACME certificate : read/write for only for owner of ./data/traefik/letsencryp 
echo "Setting up ACME certificate storage..."
sudomkdir -p ./data/traefik/letsencrypt
if [ -f ./data/traefik/letsencrypt/acme.json ]; then
    sudo chmod 600 ./data/traefik/letsencrypt/acme.json
else
    sudo touch ./data/traefik/letsencrypt/acme.json
    sudo chmod 600 ./data/traefik/letsencrypt/acme.json
fi

# Use sudo -E to preserve environment variables
echo "Starting Docker services..."
sudo -E docker compose up -d --build

echo "Waiting for services to start..."
sleep 30

echo "=========================================="
echo "SERVICE LOGS"
echo "=========================================="
echo "Traefik logs:"
sudo docker logs traefik --tail 20 || echo "Traefik not running yet"

echo ""
echo "Backend logs:"
sudo docker logs ${BACKEND_CONTAINER} --tail 10 || echo "Backend not running yet"

echo "=========================================="
echo "DEPLOYMENT COMPLETE"
echo "=========================================="
echo "All services started"
echo "DuckDNS domain updated"
echo "SSL certificates will be generated automatically"
echo ""
echo "Your application should be available at:"
echo "API URL:      https://${BACKEND_DOMAIN}"
echo "Traefik:      https://${TRAEFIK_DOMAIN}"
echo ""
echo "Note: SSL certificates may take a few minutes to generate"
echo "=========================================="
