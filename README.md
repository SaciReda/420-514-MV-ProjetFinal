# 420-514-MV-ProjetFinal - Spotifew Backend

Spotifew is a web application that collects, analyzes, and stores music data from the Spotify API. The system processes this data to provide personalized statistics about users' listening habits. This project was developed by a team of 4 students as part of a course.

### Our project is available here: 

- **Frontend Website**: `https://spotifew.4pp.duckdns.org`
- **Frontend Traefik Dashboard**: `https://traefik.4pp.duckdns.org`
- **Frontend Repo**: `https://github.com/yanis26x/frontend-Sp0ti5.git`

- **Backend API**: `https://spotifew.b4ckend.duckdns.org`
- **Backend Traefik Dashboard**: `https://traefik.b4ckend.duckdns.org`
- **Swagger Documentation**: `https://spotifew.b4ckend.duckdns.org/api-docs/`
- **Backend Repo**: `https://github.com/SaciReda/420-514-MV-ProjetFinal.git`

### Important files:

- **PowerPoint**: [here](https://github.com/yanis26x/frontend-Sp0ti5/blob/main/src/assets/PrésentationCollecte.pptx)
- **Postman Collection**: [here](https://github.com/SaciReda/420-514-MV-ProjetFinal/blob/main/ProjetFinalCollecte.postman_collection.json)
- **Frontend Dev Config File**: [here](https://github.com/yanis26x/frontend-Sp0ti5/blob/main/dev.json.example)
- **Frontend Prod Config File**: [here](https://github.com/yanis26x/frontend-Sp0ti5/blob/main/prod.json.example)
- **Backend Dev Config File**: [here](https://github.com/SaciReda/420-514-MV-ProjetFinal/blob/main/dev.json.example)
- **Backend Prod Config File**: [here](https://github.com/SaciReda/420-514-MV-ProjetFinal/blob/main/prod.json.example)

### Important Videos:

- **Client Demo**: [here](https://www.youtube.com/watch?v=qkdga0qvQiA)
- **Technical Demo**: [here](https://www.youtube.com/watch?v=h5Vz9cf4BsY)

### Others:

- **Wiki**: [here](https://github.com/SaciReda/420-514-MV-ProjetFinal/wiki/1.-Infrastructure)

## Technology Stack

### Core Platform
- **Backend**: Node.js with TypeScript, Express.js, and MongoDB with Mongoose ODM (Object Data Modeling)
- **Authentication**: JWT-Token authentication with bcrypt password hashing
- **APIs**: Spotify Web API integration for music data, Last.fm for metadata
- **Database**: MongoDB cloud cluster

### Development Tooling
- **Testing**: Jest test framework with 72% test covergae
- **API Documentation**: Swagger/OpenAPI with Swagger UI
- **Environment Management**: Environment-specific configuration with env-cmd

### Infrastructure & DevOps
- **AWS EC2** (t3.micro) since this is a small project
- **Docker** containerization for consistent environments
- **Terraform** for infrastructure as code (IaC) on AWS, provisioning resources (VPC, security groups, and networking)
- **Git** Version control
- **Traefik** Reverse proxy and SSL certificate management
- **DuckDNS** Domain name management
- **CI/CD**: Automated deployment with Bash scripts and environment configurations

---

## Prerequisites

Before deploying, ensure you have:

- **AWS CLI** - [Prerequisites](https://docs.aws.amazon.com/cli/latest/userguide/getting-started-prereqs.html) | [Installation](https://docs.aws.amazon.com/cli/latest/userguide/getting-started-install.html)
- **Terraform** - [Installation Guide](https://developer.hashicorp.com/terraform/tutorials/aws-get-started/install-cli)
- **Git** - For cloning the repository
- **AWS Account** - With EC2 permissions
- **DuckDNS** - Domain and account token

---

## Quick Start

### Step 0: AWS CLI Configuration

> **Important**: Configure your AWS credentials before proceeding

- [Set up your AWS CLI credentials](https://docs.aws.amazon.com/cli/latest/userguide/cli-chap-configure.html)
- **Windows**: `C:/Users/yourUser/.aws/credentials`
- **Linux/Mac**: `~/.aws/credentials`

## Backend Deployment

### Step 1: Clone the Repository

```bash
git clone https://github.com/SaciReda/420-514-MV-ProjetFinal.git
cd 420-514-MV-ProjetFinal
```

### Step 2: Create Network Infrastructure using AWS

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

# SSH into EC2 (get IP from Terraform output in terminal after using terraform apply)
ssh -i "B4CKEND-keypair.pem" ubuntu@<EC2-IP-ADDRESS>
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
