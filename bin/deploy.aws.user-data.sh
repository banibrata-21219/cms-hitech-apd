#!/bin/bash

groupadd eapd
gpasswd -a ec2-user eapd
mkdir /app

chown -R :eapd /app
chmod g+w /app

yum -y install git

su ec2-user <<E_USER

cd ~

curl -o- https://raw.githubusercontent.com/creationix/nvm/v0.33.2/install.sh | bash
source ~/.bashrc

nvm install 10
nvm alias default 10

npm i -g pm2

cd /app
git clone --depth 1 https://github.com/18F/cms-hitech-apd.git
cd cms-hitech-apd/api
npm ci --only=production 

echo "__ECOSYSTEM__" | base64 --decode > ecosystem.config.js
pm2 start ecosystem.config.js

exit
E_USER

su - ec2-user -c '~/.bash_profile; sudo env PATH=$PATH:/home/ec2-user/.nvm/versions/node/v10.15.3/bin /home/ec2-user/.nvm/versions/node/v10.15.3/lib/node_modules/pm2/bin/pm2 startup systemd -u ec2-user --hp /home/ec2-user'
su - ec2-user -c 'pm2 save'
