ECOSYSTEM=`echo "module.exports = {
  apps : [{
    name: 'eAPD API',
    script: 'main.js',

    instances: 1,
    autorestart: true,
    env: {
      NODE_ENV: 'production',
      PORT: '$AWS_PROD_API_PORT',
      DATABASE_URL: '$AWS_PROD_API_DATABASE_URL',
      SESSION_SECRET: '$AWS_PROD_API_SESSION_SECRET'
    },
  }]
};" | base64`

sed -i'.backup' -e "s/__ECOSYSTEM__/`echo $ECOSYSTEM`/g" deploy.aws.user-data.sh

 aws ec2 \
  --profile mfa \
  run-instances \
  --region us-east-1 \
  --instance-type c4.large \
  --image-id $AWS_PROD_API_AMI \
  --security-group-ids $AWS_PROD_API_SECURITY_GROUP \
  --subnet-id $AWS_PROD_API_SUBNET \
  --ebs-optimized \
  --tag-specification "ResourceType=instance,Tags=[{Key=Name,Value=eapd-staging-auto}]" \
  --user-data file://deploy.aws.user-data.sh