# Vehicle Registration Process on Hyperledger Fabric Network

This guide demonstrates how to set up and use a vehicle registration process example application with smart contracts on a Hyperledger Fabric network.

## Prerequisites

- Hyperledger Fabric and its dependencies must be installed. Follow the official documentation at [Hyperledger Fabric Installation Guide](https://hyperledger-fabric.readthedocs.io/en/release-2.2/install.html)
- Docker and Docker Compose
- Node.js and npm
- Git

## Repository Structure

The repository can be found at [https://github.com/besionisrael/vde23-lab](https://github.com/besionisrael/vde23-lab) and contains three main directories:

- `../cop-network/`: Network configuration files for 4 organizations
- `../cross-process/`: Organization-specific configuration files (smart contracts, API services)
- `../calliper/`: Performance monitoring configuration scripts

## Network Architecture

The CopNet network consists of:
- Three peer organizations (Org1, Org2, Org3)
- One Orderer organization running a single-node Raft Orderer
- Single channel named "mychannel" with all three peer organizations as members
![image](https://github.com/user-attachments/assets/7a186482-599d-4ee2-9b57-0d9453bebf04)


### Component Distribution

| Component | Container Name | Ports |
|-----------|---------------|-------|
| Org1 Peer | peer0.org1.example.com | 7051, 9444 |
| Org2 Peer | peer0.org2.example.com | 7051, 9445 |
| Org3 Peer | peer0.org3.example.com | 7051, 11051 |
| Org1 CouchDB | couchdb0 | - |
| Org2 CouchDB | couchdb1 | - |
| Org3 CouchDB | couchdb4 | - |
| Ordering Node | orderer.example.com | - |
| Org1 CA | ca_org1 | - |
| Org2 CA | ca_org2 | - |
| Org3 CA | ca_org3 | - |
| Orderer CA | ca_org4 | - |

## Network Setup and Configuration

### 1. Network Initialization
```bash
cd fabric-samples/cross-process
./network-starter.sh
```
![image](https://github.com/user-attachments/assets/c7aa113f-172c-4e31-8db1-084a91abff16)


### 2. Verify Network Setup
Check the Docker network configuration:
```bash
docker network inspect fabric_test
```

![image](https://github.com/user-attachments/assets/abff71f9-51e1-4558-93e5-96fface12331)

All containers will be running on different IP addresses within the same Docker network.



### 3. Organization Mapping
- peer0.org1.example.com - Revenue Quebec (RQ)
- peer0.org2.example.com - SAAQ
- peer0.org3.example.com - Public Organization (PC)

## Network Monitoring

### Setting up Monitoring as RQ
1. Navigate to the RQ organization directory:
```bash
cd organization/rq
```

2. Start the monitoring tool:
```bash
./configuration/cli/monitordocker.sh fabric_test
```

![image](https://github.com/user-attachments/assets/118c0dd1-587a-482f-91b8-8a8f1c3f8d10)


Alternative with custom port:
```bash
./monitordocker.sh fabric_test <port_number>
```

The logspout tool aggregates output streams from all containers, providing a unified view for administrators and developers.

## API Server Setup and Configuration

### Hyperledger Fabric SDK Integration
The API server is built using:
- Hyperledger Fabric SDK for external network access
- ExpressJS for API implementation
- fabric-ca-client for identity management

![image](https://github.com/user-attachments/assets/8e78284f-10f1-4ea1-be8c-e1c6a994169d)


### User Enrollment Process

1. **Identity Generation**
   - Execute the EnrollUser.sh script for each organization
   - The enrollUser.js program uses fabric-ca-client to:
     - Generate public/private key pairs
     - Submit certificate signing requests to CA
     - Store credentials in user wallet

2. **Required User Accounts**
   Create the following accounts for each organization:
   - PC Organization: appUser
   - RQ Organization: adminRQ
   - SAAQ Organization: adminSAAQ
These accesses must be created as shown in the figure below.

![image](https://github.com/user-attachments/assets/953f5072-a663-4637-b354-921f7e34b124)




### API Server Deployment

1. **Dependencies Installation**
Navigate to each organization's apiService.js directory and run:
```bash
npm install
```

2. **Server Launch**
Start the API servers for each organization according to their specific configurations.

![image](https://github.com/user-attachments/assets/fee22011-d7e0-4b4c-99e9-6b982a0f7de4)

![image](https://github.com/user-attachments/assets/6fd9a0e4-84c4-4620-aab4-8921541ce710)

![image](https://github.com/user-attachments/assets/2c09caed-ef10-4375-9eae-2ab2fcc5bfff)



## Troubleshooting

Common issues and solutions:
- If user enrollment fails, verify CA server availability
- For API server connection issues, check network configuration
- If monitoring doesn't start, verify port availability

## Additional Resources

- [Hyperledger Fabric Documentation](https://hyperledger-fabric.readthedocs.io/)
- [ExpressJS Documentation](https://expressjs.com/)
- [Docker Documentation](https://docs.docker.com/)

## License

Distributed under the MIT License. 
