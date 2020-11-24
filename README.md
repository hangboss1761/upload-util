# hb-cli

前端脚手架

## 使用

## 功能清单

- [x] 获取物料
- [ ] 本地开发支持
- [ ] 打包支持
- [ ] 原型开发
- [ ] 初始化项目

## 命令

### hb block

功能： 获取物料、清除物料缓存

```bash
# block add <物料地址> [拷贝目标地址] -u -c -i
# options: -c 忽略冲突， -u 本次add不更新缓存仓库， -i 不安装缺失依赖
hb block add https://github.com/hangboss1761/material-store/tree/master/block/tag src/components/business/test2  -u -c -i
```

```bash
# block clear 清除本地物料缓存
hb block clear
```