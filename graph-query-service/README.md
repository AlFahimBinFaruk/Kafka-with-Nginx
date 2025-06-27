- Build the docker image
```shell
docker build -t nest-query:0.1 .
```
- Run the image
```shell
docker run -d -p 3000:3000 --name nest-query-container nest-query:0.1
```