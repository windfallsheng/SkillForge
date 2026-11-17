# ⚙️ 谋定用户配置（升级技能时本文件不会被覆盖，你的修改永久保留）

> 官方随升级发布的新配置会另存为 `user-config.upstream.md` 供对照，不会动你的这份。
> 本文件头部 yaml 块为机器读取字段（CONFIG_VERSION 是配置版本钥匙，请勿删除）；
> 下方「📝 自定义说明」节是**升级保护区**——迁移只动 yaml 块字段，此节原样保留一字不碰。

```yaml
CONFIG_VERSION: 1
DIR: ~/mentor                 # 看板落盘根目录（mentor.html + data/ + outputs/ + assets/ 都在这里）
PYXIS_HOME: ~/Pyxis           # 计算核心仓库路径（refresh 链挂载）——改成你本机 Pyxis 仓库实际路径
THEME: night-gold           # 默认主题（night-gold / tech-blue / warm-gold / mint / paper / bull-red / terminal）
PORT: 8933                   # 本地服务端口（占用自动顺延）
```

## 📝 自定义说明

（此节留给你写任何备注——标的池心法、参数调整记录、刷新习惯等；升级技能时此节原样保留。）
