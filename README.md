# index2.0是主线
* storeType 0总部 1分公司 2门店

# caodong-admin

## Project setup
```
npm install
```

### Compiles and hot-reloads for development
```
npm run serve
```

### Compiles and minifies for production
```
npm run build
```

### Compiles and minifies for staging
```
npm run staging
```

### Lints and fixes files
```
npm run lint
```

15900760076    888888

http://134.175.220.145:10101/swagger-ui.html

/manager/store/get_sysuser_store 仅适用于订单列表、售后订单列表、业绩开关设置、资产、用户列表、门店列表的筛选条件

草动权限账号：
	测试环境：
		企业账户：15900769139   密码666888
		总部：15900760001
		分公司：15900760002，18917567685
		门店：15900760003

	uat环境:
	  企业账户: 17721475261
		总部：13482258492、17721475231
		分公司：13482258491
		
# 校验以瓜分券的校验为参考
* 金额(两位小数)一般用`min0`。
```
{
  validator: (rule, value, callback) => Validate.min0(rule, value, callback, { min: 0 }),
}
```
* 自然数和正整数一般用`limitNumber`。
```
{
  validator: (rule, value, callback) => Validate.limitNumber(rule, value, callback, { min: 0 }),
}
```

# 列表样式
* 参考：会员 - 积分明细页。

# 草动项目 commit 提交规范
* chore：构建过程或辅助工具的变动
* docs：文档(documentation)
* feat：新功能(feature)
* fix：修补bug
* perf：性能优化(performance)
* refactor：重构(即不是新增功能，也不是修改bug的代码变动)
* style：格式(不影响代码运行的变动)
* test：增加测试
* ci：自动化部署
# 案例
git commit -m "feat: 新增砍价功能"