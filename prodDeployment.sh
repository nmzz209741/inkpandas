aws ecr get-login-password --region ap-south-1 | docker login --username AWS --password-stdin 642844346770.dkr.ecr.ap-south-1.amazonaws.com
docker build --platform linux/amd64 -t inkpandas -f Dockerfile.prod .
docker tag inkpandas:latest 642844346770.dkr.ecr.ap-south-1.amazonaws.com/inkpandas:latest
docker push 642844346770.dkr.ecr.ap-south-1.amazonaws.com/inkpandas:latest