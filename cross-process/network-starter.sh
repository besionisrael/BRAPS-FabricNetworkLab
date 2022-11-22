#!/bin/bash
#
# SPDX-License-Identifier: Apache-2.0

function _exit(){
    printf "Exiting:%s\n" "$1"
    exit -1
}

# Exit on first error, print all commands.
set -ev
set -o pipefail

# Where am I?
DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"

export FABRIC_CFG_PATH="${DIR}/../config"

cd "${DIR}/../cop-network/"

docker kill cliRQ cliSAAQ cliPC logspout || true
./network.sh down
./network.sh up createChannel -ca -s couchdb

# Copy the connection profiles so they are in the correct organizations.
cp "${DIR}/../cop-network/organizations/peerOrganizations/org1.example.com/connection-org1.yaml" "${DIR}/organization/rq/gateway/"
cp "${DIR}/../cop-network/organizations/peerOrganizations/org2.example.com/connection-org2.yaml" "${DIR}/organization/saaq/gateway/"
cp "${DIR}/../cop-network/organizations/peerOrganizations/org3.example.com/connection-org3.yaml" "${DIR}/organization/pc/gateway/"

cp ${DIR}/../cop-network/organizations/peerOrganizations/org1.example.com/users/User1@org1.example.com/msp/signcerts/* ${DIR}/../cop-network/organizations/peerOrganizations/org1.example.com/users/User1@org1.example.com/msp/signcerts/User1@org1.example.com-cert.pem
cp ${DIR}/../cop-network/organizations/peerOrganizations/org1.example.com/users/User1@org1.example.com/msp/keystore/* ${DIR}/../cop-network/organizations/peerOrganizations/org1.example.com/users/User1@org1.example.com/msp/keystore/priv_sk

cp ${DIR}/../cop-network/organizations/peerOrganizations/org2.example.com/users/User1@org2.example.com/msp/signcerts/* ${DIR}/../cop-network/organizations/peerOrganizations/org2.example.com/users/User1@org2.example.com/msp/signcerts/User1@org2.example.com-cert.pem
cp ${DIR}/../cop-network/organizations/peerOrganizations/org2.example.com/users/User1@org2.example.com/msp/keystore/* ${DIR}/../cop-network/organizations/peerOrganizations/org2.example.com/users/User1@org2.example.com/msp/keystore/priv_sk

cp ${DIR}/../cop-network/organizations/peerOrganizations/org3.example.com/users/User1@org3.example.com/msp/signcerts/* ${DIR}/../cop-network/organizations/peerOrganizations/org3.example.com/users/User1@org3.example.com/msp/signcerts/User1@org2.example.com-cert.pem
cp ${DIR}/../cop-network/organizations/peerOrganizations/org3.example.com/users/User1@org3.example.com/msp/keystore/* ${DIR}/../cop-network/organizations/peerOrganizations/org3.example.com/users/User1@org3.example.com/msp/keystore/priv_sk

echo Suggest that you monitor the docker containers by running
echo "./organization/rq/configuration/cli/rq.sh net_test"
