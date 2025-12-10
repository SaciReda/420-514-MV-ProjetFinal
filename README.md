# 420-514-MV-ProjetFinal - Spotifew Backend

Projet final du cours de collecte et interprétation de données

## Déploiement

### Step 1: Clone the Repository

```bash
git clone https://github.com/SaciReda/420-514-MV-ProjetFinal.git
cd 420-514-MV-ProjetFinal
```

### Step 2: Deploy Infrastructure

```bash
cd IaC/terraform-config
terraform init
terraform plan
terraform apply
```

> **Note**: This will create an EC2 instance and may take 2-3 minutes

### Step 3: Configure Environment Variables

After EC2 instance is created, SSH into it:

```bash
# Windows - Set key permissions (adjust path to your key file)
icacls "path\to\your-keypair.pem" /inheritance:r
icacls "path\to\your-keypair.pem" /remove "Administrators" "SYSTEM" "Users" "Authenticated Users" "Everyone"
icacls "path\to\your-keypair.pem" /grant:r "yourUser:R"

# SSH into EC2 (get IP from Terraform output)
ssh -i "your-keypair.pem" ubuntu@<EC2-IP-ADDRESS>
```

### Step 4: Deploy Application

Once on the EC2 instance:

```bash
# Clone the repository
git clone https://github.com/SaciReda/420-514-MV-ProjetFinal.git
cd 420-514-MV-ProjetFinal

# Configure environment variables
cp prod.json.example prod.json
nano prod.json
```

**Required Environment Variables in `prod.json`:**

```json
{
  "NODE_ENV": "production",
  "SPOTIFY_CLIENT_ID": "your-spotify-client-id",
  "SPOTIFY_CLIENT_SECRET": "your-spotify-client-secret",
  "LASTFM_API_KEY": "your-lastfm-api-key",
  "MONGO_URI": "your-mongodb-connection-string",
  "API_PORT": "5000",
  "DUCKDNS_TOKEN": "your-duckdns-token",
  "DOMAIN": "your-domain.duckdns.org",
  "BACKEND_DOMAIN": "spotifew.your-domain.duckdns.org",
  "TRAEFIK_DOMAIN": "traefik.your-domain.duckdns.org",
  "API_HOST": "https://spotifew.your-domain.duckdns.org",
  "TRAEFIK_CONTAINER": "traefik",
  "BACKEND_CONTAINER": "backend",
  "ACME_EMAIL": "your-email@example.com"
}
```

### Step 5: Deploy and Start Services

```bash
# Make deploy script executable
chmod +x deploy.sh

# Deploy the application
./deploy.sh
```

**Wait approximately 5 minutes for full deployment.**

The deploy script will:
- Load environment variables from `prod.json`
- Get EC2 public IP
- Update DuckDNS with the new IP
- Build and start Docker containers
- Generate SSL certificates automatically

## Access Your Application

Once deployed, access your application at:

- **Backend API**: `https://spotifew.your-domain.duckdns.org`
- **Traefik Dashboard**: `https://traefik.your-domain.duckdns.org`

### API Endpoints

- **Health Check**: `GET https://spotifew.your-domain.duckdns.org/`
- **Spotify Songs**: `GET https://spotifew.your-domain.duckdns.org/spotify/songs/:artistName`
- **Search Song**: `GET https://spotifew.your-domain.duckdns.org/spotify/search-song`
- **Auth**: `POST https://spotifew.your-domain.duckdns.org/auth/*`
- **Playlists**: `https://spotifew.your-domain.duckdns.org/playlists/*`
- **Auto Playlist**: `https://spotifew.your-domain.duckdns.org/autoplaylist/*`
- **Top Stats**: `https://spotifew.your-domain.duckdns.org/topstats/*`

## Prerequisites

- AWS CLI configured with credentials
- Terraform installed
- Docker and Docker Compose installed on EC2 instance
- DuckDNS account and domain configured
- MongoDB Atlas cluster (or MongoDB instance)
- Spotify API credentials
- Last.fm API key

### Rebuild Services

```bash
docker compose down
docker compose up -d --build
```
