# Introduction

This part of the project aims to deploy a secure, highly available, multi-services cloud infrastructure on **AWS** using **Terraform** to simplify and automate the process

---

# AWS Network Infrastructure Diagram

![image](https://raw.githubusercontent.com/manacGrace/REAL-ESTATE-AWS/refs/heads/main/REAL-ESTATE-AWS-INFRASTRUCTURE-AS-CODE/wiki/pictures/infrastructure.png)

---

# Network Components

### `VPC Details`

| VPC Name                    | Region     | IPv4 CIDR Block  | Connectivity Configuration    |
|-----------------------------|------------|------------------|-------------------------------|
| SPOTIFEW-VPC             | us-east-1  | 10.0.0.0/16      | Internet Gateway              |

---

### `Route Tables Details`

#### Route Table: SPOTIFEW-PRIVATE-RT

| Destination  | Target |
|--------------|--------|
| 10.0.0.0/16  | Local  |

#### Route Table: SPOTIFEW-PUBLIC-RT

| Destination  | Target                               |
|--------------|--------------------------------------|
| 10.0.0.0/16  | Local                                |
| 0.0.0.0/0    | SPOTIFEW-INTERNET-GW              |

---

### `Subnets Details`

#### Subnet: SPOTIFEW-PRIVATE-1

| Availability Zone | IPv4 CIDR Block  | Public/Private | Associated Route Table             |
|-------------------|------------------|----------------|------------------------------------|
| us-east-1a        | 10.0.1.0/24      | Private        | SPOTIFEW-PRIVATE-RT             |

#### Subnet: SPOTIFEW-PUBLIC-1

| Availability Zone | IPv4 CIDR Block  | Public/Private | Associated Route Table             |
|-------------------|------------------|----------------|------------------------------------|
| us-east-1a        | 10.0.0.0/24      | Public         | SPOTIFEW-PUBLIC-RT              |

---


### `Security Group`

- **name**: TRAEFIK-PROTOCOL-ACCESS
- **Description**: Allow HTTP, HTTPS traffic

#### Inbound Rules

| Type        | Protocol | Port Range     | Source       |
|-------------|----------|----------------|--------------|
| HTTP        | TCP      | 80             | 0.0.0.0/0    |
| HTTPS       | TCP      | 443            | 0.0.0.0/0    |

#### Outbound Rules

| Type          | Protocol | Port Range     | Destination  |
|---------------|----------|----------------|--------------|
| All Traffic   | All      | All            | All          |

#### Reasons for Rule Choices

- **HTTP (Port 80)**: Allows standard web requests.
- **HTTPS (Port 443)**: Allows access to web requests via Traefik domain names.

---

## EC2 Instance Configuration

### `Instance Configuration Summary`

| Instance Name                    | Type       | AMI              | VPC                          | Subnet                    | Security Group(s)       |
|----------------------------------|------------|------------------|------------------------------|---------------------------|-------------------------|
| SPOTIFEW-SERVICE              | t2.large   | Ubuntu 24.04 LTS | SPOTIFEW-VPC              | SPOTIFEW-PUBLIC-1      | TRAEFIK-PROTOCOL-ACCESS |

### `Additional Information`

- **t2.large**: Offers 8 GB RAM and 2 CPU cores, enough to host all required services.  
- **64 GB Storage**: To store images and other essential deployment data.  
- **Ubuntu 24.04 LTS AMI**: Chosen for its Linux environment and familiarity.
