# 收集提交（阶段 1）

> ⚠️ 本文件是收集机制说明，不是配置区——随 skill 升级会被官方版覆盖。git 仓库等配置（REPO/SCOPE_HINT 等）只写在同目录外的 `user-config.md`（升级保护区，永不覆盖）。


## 区间口径（三档，先判断再收集）

1. **双 tag**：`git log vA..vB --oneline`——vA 为上一版本标签，vB 为本次发布标签（vB 可缺省为 HEAD）
2. **单 tag**：`git log <tag>..HEAD --oneline`——该 tag 之后的所有提交
3. **无 tag**：与用户确认口径（按日期区间 `--since/--until` 或最近 N 次提交）后收集，禁止擅自假设

## 收集规则

- 用 `git log --oneline --no-merges`（默认排除 merge 提交；如该版本含重要合并改动，`git log --merges` 单列参考）
- 附加统计（STATS: true 时）：`git log <区间> --format='%H' | wc -l`（提交数）；净增删行数用 `git log <区间> --shortstat` 累加或 `git diff --shortstat vA vB`；提交者 `git log <区间> --format='%an' | sort | uniq -c | sort -rn`
- **口述补充**：用户口头说的本期要点（改了什么大方向、解决什么问题）与 git 提交**合并去重**——口述是骨架，提交是血肉；口述提到的点提交里没有时如实保留并标注「口述补充」

## 输出

收集结果清单：按时间倒序的提交列表（hash 短码 + message 原文）+ 统计数字 + 口述要点，交给阶段 2。
