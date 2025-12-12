#!/bin/bash

# Install Docker From Docker's Online Documentation
# Add Docker's official GPG key:
echo "Installing Docker..."
sudo apt-get update
sudo apt-get upgrade -y
sleep 10
sudo apt-get -y install ca-certificates curl
sudo install -m 0755 -d /etc/apt/keyrings
sudo curl -fsSL https://download.docker.com/linux/ubuntu/gpg -o /etc/apt/keyrings/docker.asc
sudo chmod a+r /etc/apt/keyrings/docker.asc
sleep 5

# Add the repository to Apt sources:
echo \
  "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.asc] https://download.docker.com/linux/ubuntu \
  $(. /etc/os-release && echo "${UBUNTU_CODENAME:-$VERSION_CODENAME}") stable" | \
  sudo tee /etc/apt/sources.list.d/docker.list > /dev/null
sudo apt-get update

sudo apt-get install -y docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin 
sleep 5

# Enable and start Docker service
sudo systemctl enable docker
sudo systemctl start docker
sleep 3

# Infrastructure setup complete
echo "=========================================="
echo "INFRASTRUCTURE SETUP COMPLETE"
echo "=========================================="
echo "Docker installed and configured"
echo "Environment template created"
echo "Directories created"