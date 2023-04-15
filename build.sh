echo "nihaoma-api version (tag): "
read next

ecr_name=149087623997.dkr.ecr.ap-southeast-1.amazonaws.com
aws ecr get-login-password --profile easygop --region ap-southeast-1 | docker login --username AWS --password-stdin $ecr_name

npm run build

echo "$ecr_name/nihaoma-api:$next"
docker build -t  $ecr_name/nihaoma-api:$next .
docker push $ecr_name/nihaoma-api:$next
