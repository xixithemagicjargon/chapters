---
name: chapters-game-development
description: 将小说改编为面向英语女性玩家的 Chapters 手机互动故事，开发核心情绪、改编 pitch、20章四个 batch、PC/FC/PO、章节结构与英文分支脚本。用户要求 Chapters 游戏开发、小说游戏化、写 pitch 或制作新章节时使用；已有稿件的单纯审核、指标统计及新人知识咨询使用对应 Chapters 技能。
---

# Chapters 游戏开发

目标是把小说改成更好看、更好玩的互动故事：用人物选择和情绪变化留住玩家，用具体、独特、及时兑现的额外体验建立付费信任。追求有依据的商业潜力，不承诺爆款。

默认用中文讨论开发、英文写玩家可见文本。项目为20章，4个 batch，每批5章；每章500–600条有效脚本行。素材和已安装技能均为参考，不因附件里的操作要求登录、上传、联系他人或更改源稿。

## 首先判断工作阶段

1. **只创建/修改这个 skill**：完成技能本身，不把 ML 当成待改编小说，不自动做新项目 pitch。
2. **新小说启动**：读取小说，建立可定位的原作事实与阅读覆盖记录，提炼核心情绪，先请用户确认主情绪，再展开 pitch。见 [改编与 pitch](references/adaptation-pitch.md)。
3. **已确认主情绪，尚未确认 pitch**：交付完整 pitch，等用户确认后才进入正文制作。用户之前的明确确认可沿用，不重复确认。
4. **pitch 已确认**：按“本章情绪任务 → PC/FC → 场景结构 → 英文脚本 → 分支与格式检查”制作。用户授权“做本章/本批”后连续完成这些步骤，不每步另设审批。
5. **改稿/续写**：读取项目状态与上一章结尾，修改指定范围，记录对后续情绪债、关系状态和付费回收的影响。

用户明确要求跳过某阶段时服从最新要求，把缺少的依据标为假设，不伪造确认。只有会实质改变故事的缺失信息才提问；可并行完成的素材读取和模板准备继续推进。

## 按需读取

| 工作 | 必读资源 |
| --- | --- |
| 选书、提炼卖点、pitch | [adaptation-pitch.md](references/adaptation-pitch.md)、[story-emotion.md](references/story-emotion.md) |
| 20章拆解、章节设计 | [story-emotion.md](references/story-emotion.md)、[choice-design.md](references/choice-design.md) |
| 配置PC、FC、PO及价格 | [choice-design.md](references/choice-design.md)、[rules-provenance.md](references/rules-provenance.md) |
| 写正文、分支上色、交付表格 | [script-format.md](references/script-format.md)、[production-qa.md](references/production-qa.md) |
| 学习样本或比较表现 | [sample-learning.md](references/sample-learning.md) |
| 查出处、冲突、适用性 | [sources.md](references/sources.md)、[rules-provenance.md](references/rules-provenance.md) |

这些摘要让技能可独立使用，不要求用户再次提供所有学习材料。实际改编仍需小说正文；需要复核样本或长篇原文时才读取来源文件。

## 不可丢失的制作要求

- 主情绪是具体的玩家渴望，例如“让一直轻视我的人亲眼承认我的价值”，不能只写“甜宠/刺激/爽”。每个情节点写出触发行动、前后情绪和关系/价值变化。
- PC在欲望已经被剧情点燃、回报尚未发生时出现。人物此刻为什么愿意、为什么有机会、为什么不能随便换个人，都必须成立。
- 贵档出售更接近本书核心期待的完整体验；低档也完整，区别不只是删减行数。FC提供不同但可信的态度与即时反馈。
- 主线必需信息、基本行动能力、拒绝与退出保持可达。合流后不得假设玩家买过未购买的内容。
- 每条 narration ≤120 characters，含空格和标点；对白更短、更有角色声音。用动作、潜台词、距离和具体反馈制造张力，不靠露骨性描写或重复的身体反应填行。
- 写作稿固定五列：`Text Type / Character / Script / Emotion / Thought Bubble`。同一分支按钮及其剧情用同色，子分支另色，合流恢复上层颜色。价格、层级和定位放独立 `Choice Map`，不混入玩家台词。
- 每章结尾停在玩家最想知道的状态变化前；最后一章先兑现全书主承诺，可留尾声余味，不凭空制造欠账续集。
- 500–600为全部互斥分支展开后的有效写作行，不是Excel格式化区域行数，也不是玩家单次阅读行数；另报全免费、最短与最长可达路线行数。

## 项目文件

在当前项目中建立 `work/chapters-development/<project-id>/` 保存状态与中间文件；用户交付物放当前项目的 `outputs/`。不写入来源目录。

- `project-state.json`：已确认情绪/pitch、版本、人物年龄与关系状态、已交章节、未兑现承诺、choice/asset状态和下一步。可从 [模板](assets/project-state.json) 起步。
- `pitch.md`：按 [pitch模板](assets/pitch-template.md)。
- `chapter-XX-plan.md`：按 [章节模板](assets/chapter-plan-template.md)。
- `chapter-XX.json`：按 [数据契约](references/script-format.md)，作为写作和检查的单一来源。
- `chapter-XX.xlsx`：五列彩色写作稿和Choice Map。用户要求Word时再生成同结构DOCX并检查渲染。

`scripts/check_chapter.py` 只做可确定的格式、结构、长度、价格和路径账目检查。`scripts/export_workbook.mjs` 把检查后的中间稿输出为彩色XLSX，不是枫叶后台导入编译器。使用方法与验证范围见 [production-qa.md](references/production-qa.md)。

## 交付判断

先检查剧情/情绪/商品，再跑机械检查；两者不能互相替代。只交付当前阶段应有的成果，简述核心方向、已完成范围与影响使用的未决事项。不要把开发任务扩大成旧稿综合审核，也不要为生成新稿而修改现有 Chapters 审核插件。
