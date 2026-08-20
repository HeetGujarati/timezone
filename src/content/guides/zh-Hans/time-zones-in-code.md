---
title: "代码里的时区：一份实用指南"
description: "存 UTC，保留时区标识符，在展示时换算，永远不要自建偏移表。规则，以及每条规则背后的道理。"
summary: "几乎所有时区缺陷都能追溯到四个错误之一。这里给出该怎么做，涵盖 JavaScript、Python、Java、Go 和 SQL，讲的是道理而不只是规则。"
publishedAt: '2026-01-15'
updatedAt: '2026-01-15'
order: 9
keywords: ['代码里的时区', '日期时间最佳实践', '存储时间戳', '数据库 UTC']
related: ['what-utc-really-is', 'iso-8601-explained', 'the-2038-problem']
---

生产环境里几乎所有时区缺陷都能追溯到四个错误之一：存了当地时间、存了偏移而不是时区、在错误的层次做换算，或者手工搭了一张偏移表。下面的一切，都是从避开这四件事推出来的。

## 规则一：以 UTC 存储时刻

时刻是时间轴上的一个点。当地时间是一次钟面读数，它需要一个时区和一套消歧策略，才谈得上有意义。

```sql
-- 好：一个时刻
created_at TIMESTAMPTZ NOT NULL

-- 坏：没有时区的钟面读数
created_at TIMESTAMP NOT NULL
```

PostgreSQL 的 `TIMESTAMPTZ` 并不存储时区——它在写入时归一到 UTC，在读取时换算。对于「这件事什么时候发生的」，这正是你想要的。

## 规则二：存时区标识符，不要存偏移

如果你需要知道_在哪里_——为了一个周期性事件、一项用户偏好、一家店的营业时间——那就存 `Europe/London`，不要存 `+01:00`。

偏移是关于某一个时刻的事实。时区是一套规则，它能熬过政府改主意。英国在一月是 `+00:00`，在七月是 `+01:00`；存下其中任何一个并称之为「用户的时区」，一年里有半年是错的。

```sql
event_start_local  TIMESTAMP   NOT NULL,  -- 他们选定的钟面时间
event_time_zone    TEXT        NOT NULL,  -- 'Europe/London'
event_start_utc    TIMESTAMPTZ NOT NULL   -- 解析出的时刻，规则变动时重算
```

对周期性事件而言，当地时间与时区才是事实来源；UTC 时刻只是派生索引。若 tzdata 变了——它一年要变好几次——重新生成派生列即可，用户的 09:00 依旧是 09:00。

## 规则三：在边缘做换算

业务逻辑按时刻工作。换算成人可读的当地时间，发生在尽可能晚的时刻，发生在那个知道读者是谁的层次里。

推论更要紧：**绝不要让服务器自身的时区渗进行为里。** 在部署环境中设置 `TZ=UTC`，并把任何结果取决于服务器本地设置的代码路径视为缺陷。这类故障只有在有人部署到第二个地区时才会冒头。

## 规则四：永远不要自建偏移表

每个现代运行环境都自带 IANA 数据库。用它。

**JavaScript**

```js
// 按某个时区格式化
new Intl.DateTimeFormat('en-GB', {
  timeZone: 'Asia/Kathmandu',
  dateStyle: 'medium',
  timeStyle: 'short',
}).format(new Date());

// 不依赖库拿到偏移：把该时区的钟面读数与 UTC 相比
function offsetMinutes(timeZone, instant) {
  const parts = new Intl.DateTimeFormat('en-US', {
    timeZone,
    hourCycle: 'h23',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  }).formatToParts(new Date(instant));
  const get = (type) => Number(parts.find((p) => p.type === type).value);
  const asUtc = Date.UTC(
    get('year'),
    get('month') - 1,
    get('day'),
    get('hour'),
    get('minute'),
    get('second'),
  );
  return (asUtc - Math.floor(instant / 1000) * 1000) / 60000;
}
```

务必显式设置 `hourCycle: 'h23'`。某些 ICU 版本在 `en-US` 下把午夜报成 24 时，这会让日期整整偏一天，而且是一个查起来真正折磨人的缺陷。

**Python**

```python
from datetime import datetime, timezone
from zoneinfo import ZoneInfo  # 自 3.9 起进入标准库

now = datetime.now(timezone.utc)
local = now.astimezone(ZoneInfo("Asia/Kathmandu"))
```

永远不要用 `datetime.utcnow()`。它返回一个_看起来_像 UTC 却不带时区的朴素日期，而把它与带时区的日期混用，会在最糟的时刻抛出异常。正确的调用是 `datetime.now(timezone.utc)`。

**Java**

```java
Instant now = Instant.now();
ZonedDateTime local = now.atZone(ZoneId.of("Asia/Kathmandu"));
```

`java.time` 设计得很好：`Instant` 表示时间轴上的点，`LocalDateTime` 表示没有时区的钟面读数，`ZonedDateTime` 表示两者合一。类型系统会强制执行本文一再坚持的那个区分。

**Go**

```go
loc, _ := time.LoadLocation("Asia/Kathmandu")
local := time.Now().In(loc)
```

`LoadLocation` 读取系统的 tzdata。在一个空白容器里根本没有这份数据——请导入 `_ "time/tzdata"` 把它嵌进可执行文件，否则每次时区查找都会悄无声息地退回 UTC。

## 一年里的那两天

拨快抹掉一小时；拨慢重复一小时。选一套策略，一以贯之地执行，并把你的处置告诉用户：

- **不存在的当地时间**（美国春季切换日的 02:30）：按缺口的大小往前推，于是 02:30 变成 03:30。
- **有歧义的当地时间**（美国秋季切换日的 01:30）：取第一次、也就是较早的那一次。

这正是本站采用的策略，它们与 ECMAScript `Temporal` 的默认值 `disambiguation: 'compatible'` 一致——值得对齐，好让你的行为与平台保持一致。

缺口未必总是一小时。豪勋爵岛拨动 30 分钟，所以请从那次转换本身读出大小，而不要想当然。

## 测试

四个用例能兜住大部分：

1. **半小时时区** —— `Asia/Kolkata`（+05:30）。兜住「整点小时」的假设。
2. **45 分钟时区** —— `Asia/Kathmandu`（+05:45）。兜住「半小时为界」的假设。
3. **南半球时区** —— `Australia/Sydney`。兜住「夏天就是六月」。
4. **豪勋爵岛** —— `Australia/Lord_Howe`。兜住写死的 60 分钟跳变，而且只有它能兜住。

为你的用户实际所在的每一个时区，各加一个拨快日期和一个拨慢日期；同时在持续集成里锁定 tzdata 版本，免得一次数据库更新因为不相干的原因弄挂构建。

## 周期性事件是另一个问题

一次性事件是一个时刻。周期性事件是一条规则，两者需要不同的存储方式。

「每周二 09:00，Europe/London」并不等于「从这一时刻起每 604800 秒」。英国一拨钟，两者就分岔：规则把会议钉在当地 09:00，而固定间隔会把它漂到 08:00 或 10:00。

存下规则——当地时间、时区标识符、重复模式——再由它物化出时刻。当 tzdata 变动时，重新生成那些物化的时刻；不要去迁移它们。用户同意的是规则。

那些别扭的情形，正是从一年两次的间断中来的。每天 02:30 的会议会发现：在春天的某一天，这个时间并不存在；而在秋天的某一天，它会发生两次。选一套策略，一以贯之地执行，并且知道不同日历系统选了不同的策略——这就是为什么同一个周期性事件，在一年中恰好两天，会在两个人的日历里差出一小时。

## 关于 `Temporal` 的一点说明

ECMAScript 的 `Temporal` 用一组类型取代了 `Date`，像 `java.time` 那样区分时刻、钟面时间和带时区的日期时间。`Temporal.ZonedDateTime` 携带时区标识符；`Temporal.Instant` 是时间轴上的一个点；`Temporal.PlainDateTime` 是没有时区的钟面读数，而类型系统会阻止你把它们弄混。

它的 `disambiguation` 选项，恰好把本文一再回到的那套「一年两天」的策略暴露了出来：`'compatible'`（默认——向前跨过缺口，在有歧义的一对里取较早者）、`'earlier'`、`'later'` 和 `'reject'`。最后一个值得在任何「悄悄差一小时比报错更糟」的场合认真考虑。
