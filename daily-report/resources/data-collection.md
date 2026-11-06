# 数据收集

先检测当前系统再取对应路径列（macOS：`uname -s` 返回 Darwin；Windows：`node -e "console.log(process.platform)"` 返回 win32），按需检查以下工作区当日提交，聚合产出。只汇总有提交的仓库：

| 仓库 | macOS 路径 | Windows 路径 |
|---|---|---|
| NearCast | /Users/luzhaosheng/SmartDeveloper/DevWorkspace/Android_Studio/NearCast | - |
| nearcast-server | /Users/luzhaosheng/SmartDeveloper/DevWorkspace/IntelliJ_IDEA/nearcast-server | - |
| nearcast-go | /Users/luzhaosheng/SmartDeveloper/DevWorkspace/GoProject/nearcast-go | - |
| nearcast-admin | /Users/luzhaosheng/SmartDeveloper/DevWorkspace/WebProject/nearcast-admin | - |
| SmartCanteenConsumerMachineApp | /Users/luzhaosheng/SmartDeveloper/DevWorkspace/Android_Studio/SmartCanteenConsumerMachineApp | - |
| TrustPay | /Users/luzhaosheng/SmartDeveloper/DevWorkspace/Android_Studio/TrustPay | - |
| srf-app | - | d:\Workspace_Java\srf-app |
| srf-manage | - | d:\Workspace_Java\srf-manage |
| srf-operation | - | d:\Workspace_Java\srf-operation |
| srf-service | - | d:\Workspace_Java\srf-service |
| srf-web-user | - | d:\Web_Projects\srf-web-user |
| srf-web-operation | - | d:\Web_Projects\srf-web-operation |
| srf-web-wx | - | d:\Web_Projects\srf-web-wx |
| srf-web-h5-teacher | - | d:\Web_Projects\srf-web-h5-teacher |
| srf-web-uop | - | d:\Web_Projects\srf-web-uop |
| Spec-Core-Smart-Canteen | - | d:\Workspace_QCoder\Spec-Core-Smart-Canteen |

- 「-」= 该仓库在当前系统不存在，跳过；当前系统对应列全为「-」（陌生机器）时跳过 git 收集，只按会话/文字内容生成

命令模板：

```bash
git -C <仓库路径> log --since="YYYY-MM-DD 00:00:00" --until="YYYY-MM-DD 23:59:59" --pretty=format:"%h %s" --stat
```

- 汇总每个提交涉及的**文件数**与**增删行数**（来自 --stat），作为量化数据
- **行数统计口径（防生成物噪音）**：统计增删行数前必须先剔除生成物路径（如 `.speccore/code-graph/` 下的 graph.json：单文件可能贡献数十万行，会撑爆指标）；numstat 输出为 `add\tdel\tpath` 三列，用 `grep -vE $'\t\.speccore/code-graph/'` 按制表符+路径过滤（正则匹配行首无效）；统计后若行数仍异常巨大（>5 万行），用 `sort -rn | head -8` 定位元凶文件再排除；日报指标卡（提交次数/涉及文件数/代码行数）与 HTML 量化指标行均用过滤后口径
- 同主题多提交（含多次提交与 MR 合并记录）合并为一条任务点，量化数据累加
- git 无法给出实际耗时，用时取合理估算值，允许用户事后修正
- 无当日提交的仓库不写入日报
- 仓库路径（当前系统列）不存在/非 git 仓库时静默跳过该仓库（不报错、不写入）
- 用户说「只写 xxx 的日报 / 只聚合 xxx 仓库」时只收集指定仓库
- git 之外的默认来源：本次会话中用户已提及/口述的工作内容（任务、进度、风险等对话信息）一并聚合，与 git 记录去重合并
- 用户明确说"只整理这段文字/只按这段"时，忽略 git 与会话上下文，只用指定文字
