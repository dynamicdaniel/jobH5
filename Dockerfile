#制定node镜像的版本
FROM node:8.11.3
#声明作者
MAINTAINER ebay
#移动当前目录下面的文件到app目录下
ADD . /h5/
#进入到app目录下面，类似cd
WORKDIR /h5
#安装依赖
RUN npm install --production
#对外暴露的端口
EXPOSE 7021
#程序启动脚本
CMD ["npm", "run", "docker_start"]