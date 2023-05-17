## README
### Version
- ```Nodejs: 18.16.0```
### Tailwindcss
- 在`VSCode`上使用`postcss language support`插件来支持编译器识别tailwindcss语法
- ```Nodejs: 18.16.0``` 


### Mysql
- 后端使用了 sequelize 库进行数据库操作，sequelize在进行初始化时会通过 sync 方法进行数据库表内容覆盖，因此无需手动建表

### start
1. 开启myslq ```net start mysql```
2. 开启后端服务 ```cd back-end && npm i && npm run start```
3. 开启前端服务 `cd .. && cd font-end && npm i && npm run dev`
