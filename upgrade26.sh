#!/bin/bash

pm2 delete all

sudo sed -i s/node_10/node_12/ /etc/apt/sources.list.d/nodesource.list
sudo sed -i s/node_11/node_12/ /etc/apt/sources.list.d/nodesource.list
sudo apt-get update
sudo apt-get upgrade -y
sudo apt-get install -y libjemalloc-dev

yarn global upgrade

sed -i '/core-database-postgres/i "@blockpool-io/core-magistrate-transactions": {},' ~/.config/bpl-core/mainnet/plugins.js

cd ~/bpl-core
git reset --hard
git pull
git checkout master
yarn run bootstrap
yarn run upgrade