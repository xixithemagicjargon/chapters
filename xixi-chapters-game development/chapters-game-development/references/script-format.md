# 五列脚本与ML映射

## 玩家可见的语言

默认英语第二人称现在时叙述，角色内心第一人称；若项目另有约定保持一致。每条叙述只承载一个主要动作/感知/判断，用具体动词、未说完的意思和对方反应推动。对白要有策略：试探、躲避、挑战、让步、揭穿、邀请；不是轮流解释背景。

“带感”落实为欲望、阻力和反应之间的摩擦。写克制的眼神、改变的距离、被打断的辩解、主动交出的筹码。少用泛化的心跳、发热、倒吸气、调侃段子轮播。亲密场景以成年角色的自愿选择、情绪与关系变化为中心；可以使用含蓄张力及淡出，不写露骨性行为细节。AO3/PO18只作宽泛风格特征参考，不复制指定作者表达。

## 五列契约

| 列 | 写法 |
| --- | --- |
| Text Type | `text`、`Choice1`、`Choice2`、`Choice3`、`Premium Choice`、`Premium choice2`、`Premium_Sub_Choice`、`Sub_Choice 1`、`Sub_Choice2`、`Sub_Sub_Choice 1`、`Sub_Sub_Choice2` |
| Character | 明确角色名；叙述`Narration`，弹窗`Narration_PopUp`，选择按钮`Choice` |
| Script | 英文实际显示文本；不塞中文设计解释、价格或行号 |
| Emotion | `neutral`、`smile`、`laughing`、`shy`、`angry`、`shocked`、`sad`、`flirty` |
| Thought Bubble | `yes`或`no`；只有内心独白使用yes |

旁白和按钮的Emotion默认neutral、Thought Bubble默认no。用户只提供8个表情，即使ML有confused、Hidden Character等，也不擅自扩展。需要特殊表演时改写动作或记录制作需求。

分支正文保留所属分支的Text Type，而不是全部改text；共享主线用text。同一分支按钮与正文用同色；内嵌子分支用其他颜色，结束后回到父分支颜色。颜色是导航，真正分支归属由稳定ID与Choice Map确认。

### ML的实际列位置

ML第1行展示标题、第3行是集成键：

| 五列稿字段 | ML对应位置 | 注意 |
| --- | --- | --- |
| Text Type（用户指分支类型） | A列Dialogue Type / `id` | ML的C列Text Type / `special_type`是另一字段，不能按同名误写 |
| Character | D列 / `role_id` | 保持MC/LI与别名映射一致 |
| Script | E列 / `content` | 玩家文本 |
| Emotion | F列Emotions / `face_id` | 写作稿限定用户8项；资源ID转换另做 |
| Thought Bubble | H列 / `thought_bubble` | 五列yes/no映射为ML Yes/No |

ML的B列Line保存`a-17`、`b-12`、`c-0`等分支和价格，嵌套使用`aa`等；正文B列可能a1/a2。G、I、K等另存背景、服装、音乐。五列稿没有这些字段，因此另交Choice Map与制作状态。正式后台导入必须在用户指定的完整模板副本中映射并经过集成QA；本工具不伪造后台ID，不承诺直接导入。

## 中间稿数据契约

`chapter-XX.json`为UTF-8 JSON。使用树结构让互斥分支与合流位置明确：choice的各branch.nodes互斥，choice后面的同层node就是合流。可参考 [mini-scene.json](../assets/mini-scene.json)，它只是非正式短示例，不是完整500行章节。

顶层必需：`chapter`(1–20)、`title`、`core_emotion`、`nodes`。可选`extra_text_types`只在用户/项目已经明确扩展枚举时填写，并在项目状态记录依据。

行节点：

```json
{"id":"ch01_l001","kind":"line","character":"Narration","script":"The room goes quiet when you set the evidence on the table.","emotion":"neutral","thought_bubble":"no"}
```

选择节点：

```json
{"id":"ch01_pc01","kind":"choice","category":"PC","motivation":"让质疑者公开承认我的能力","branches":[
  {"id":"ch01_pc01_a","price":17,"button":"Present the evidence and make him correct the record.","nodes":[]},
  {"id":"ch01_pc01_b","price":12,"button":"Secure his private backing before the next board vote.","nodes":[]},
  {"id":"ch01_pc01_c","price":0,"button":"Keep my evidence for the formal hearing.","nodes":[]}
]}
```

上例空nodes仅说明字段，不是可交付分支。category只允许FC/PC/PO/customization。FC全0；PC/PO至少一付费且恰好一0钻。价格按高到低排列，不从按钮形容词猜价格。每个line、choice、branch的id全章唯一；跨章建议加章前缀。

分支层级：根级paid第1/2项自动映射为Premium Choice/Premium choice2，免费第1/2/3项为Choice1/2/3；第二层paid映射Premium_Sub_Choice，免费第1/2项映射Sub_Choice 1/Sub_Choice2；第三层只支持用户给定的两个免费Sub_Sub_Choice项。超出用户枚举会报错，需真实扩展协议，不能偷用错误类型。一个嵌套收费组即使没有付费祖先也不自动算L2，本工具标unsupported并要求重构/人工确认。

工具把所有分支展开成五列，同时生成每行的Node ID、Group ID、Branch ID、Parent Branch、Kind、Price、Excel Row、Color、Depth供Choice Map定位。Choice Map属于作者侧，不进入玩家脚本。

## 行数口径

有效写作行 = 所有有效玩家叙述/对白/内心/弹窗 + 每个按钮，各互斥分支分别计；不包括表头、元数据、说明、空行、格式化空尾、Choice Map。字符按Unicode码点计数，保留空格、标点；占位符按字面计并提醒替换后复核，富文本标签不自动剥除。

单次路线行数 = 路线上实际正文 + 被选按钮1条；屏幕会同时显示多个按钮，故这不是界面点击数/屏幕数。免费路线在每个菜单只选0钻，报告最短/最长免费路线区间；最短/最长全路线按每个互斥分支取min/max，不相加。最大钻耗同理，只累加同一可达路径的购买。

跨章条件回调、权益去重、运行时变量尚不由树工具执行。写入项目状态与章节计划，实际实施后用引擎测试；有这些机制时本工具路径数字只能称“当前树结构估计”。
