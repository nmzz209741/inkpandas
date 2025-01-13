docker build --platform linux/amd64 -t inkpandas .
docker tag inkpandas:latest 642844346770.dkr.ecr.ap-south-1.amazonaws.com/inkpandas:latest
docker push 642844346770.dkr.ecr.ap-south-1.amazonaws.com/inkpandas:latest