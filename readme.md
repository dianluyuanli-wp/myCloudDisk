# 白嫖小程序云存储的自建网盘前端服务
1 、安装 npm i  
2、在根目录下创建文件`sensitiveInfo.tsx`，内容为：  
```js
export const remoteIP = '你的后端服务的远端ip';
```
仅在本地调试时可忽略此步骤  
npm run start dev 启动服务，链接本地开启的服务  

在浏览器输入：  
http://localhost:3002/cloudDisk/login.html  
进入页面  

打包：
npm run build


