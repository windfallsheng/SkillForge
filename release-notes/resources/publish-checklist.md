# 发布自检清单（阶段 4）

生成发版说明后、发布动作前，逐项过：

1. **版本号三处一致**：package.json 的 version / README 中的版本徽章或说明 / 源码内嵌版本（CLI 内 `--version` 输出来源），三处必须与本次 tag 一致
2. **包内容验证**：`npm pack --dry-run` 确认新文件（新增技能目录 / 文档）都在包内容清单中，无遗漏
3. **CHANGELOG 链接可达**：CHANGELOG 中的目录 / 文件引用路径真实存在
4. **tag 命名**：与 package.json version 一致（v 前缀统一与否按项目惯例），tag 推送到远端（如 `git push origin <tag>`）
5. **未过项禁止发布**：任何一项不通过，修复后重跑清单，禁止跳过直接发布

输出：清单逐项 ✅/❌ 结果 + 未过项修复建议。
