---
title: "コードの中の時間帯 — 実践の手引き"
description: "UTC で保存し、時間帯の識別子を保ち、表示時に変換し、ずれの表を決して作らない。規則と、それぞれの理由をまとめます。"
summary: "時間帯にまつわる不具合のほとんどは、四つの誤りのいずれかに行き着きます。代わりに何をすべきかを、JavaScript、Python、Java、Go、SQL で、規則だけでなく理由とともに示します。"
publishedAt: '2026-01-15'
updatedAt: '2026-01-15'
order: 9
keywords: ['コード 時間帯', '日時 設計指針', 'タイムスタンプ 保存', 'データベース UTC']
related: ['what-utc-really-is', 'iso-8601-explained', 'the-2038-problem']
---

本番で起きる時間帯の不具合のほとんどは、四つの誤りのいずれかに行き着きます。現地時刻を保存する、時間帯ではなくずれを保存する、誤った層で変換する、ずれの表を手で作る。以下はすべて、それらを避けることから導かれます。

## 規則1 — 瞬間を UTC で保存する

瞬間とは時間軸上の一点です。現地時刻は壁時計の読みであり、時間帯と曖昧さの解決方針がなければ何も意味しません。

```sql
-- 良い例: 瞬間
created_at TIMESTAMPTZ NOT NULL

-- 悪い例: 時間帯のない壁時計の読み
created_at TIMESTAMP NOT NULL
```

PostgreSQL の `TIMESTAMPTZ` は時間帯を保存しません。書き込み時に UTC へ正規化し、読み出し時に変換します。「これはいつ起きたか」に対して、それこそが望ましい振る舞いです。

## 規則2 — ずれではなく時間帯の識別子を保存する

_どこか_を知る必要があるなら — 繰り返しの予定、利用者の設定、店舗の営業時間 — `+01:00` ではなく `Europe/London` を保存してください。

ずれはひとつの瞬間についての事実です。時間帯は、政府が考えを変えても生き延びる規則の集まりです。英国は1月に `+00:00`、7月に `+01:00` です。どちらかを保存して「利用者の時間帯」と呼べば、一年の半分は誤りになります。

```sql
event_start_local  TIMESTAMP   NOT NULL,  -- 利用者が選んだ壁時計の時刻
event_time_zone    TEXT        NOT NULL,  -- 'Europe/London'
event_start_utc    TIMESTAMPTZ NOT NULL   -- 解決済みの瞬間。規則が変われば再計算する
```

繰り返しの予定では、現地時刻と時間帯が真実の源であり、UTC の瞬間は派生した索引にすぎません。tzdata が変われば — 年に数回変わります — 派生列を作り直せば、利用者の09:00 は09:00 のままです。

## 規則3 — 端で変換する

業務の論理は瞬間で動きます。読める現地時刻への変換は、誰が読むのかを知っている層で、可能なかぎり最後に行います。

より重いのはその帰結です。**サーバー自身の時間帯を、けっして振る舞いに漏らさないこと。** 配備環境で `TZ=UTC` を設定し、結果がサーバーの地域設定に依存する経路はすべて不具合として扱ってください。これは、誰かが二つめの地域へ配備したときにだけ表に出る種類の障害です。

## 規則4 — ずれの表をけっして作らない

どの実行環境も IANA のデータベースを備えています。それを使ってください。

**JavaScript**

```js
// 時間帯を指定して整形する
new Intl.DateTimeFormat('en-GB', {
  timeZone: 'Asia/Kathmandu',
  dateStyle: 'medium',
  timeStyle: 'short',
}).format(new Date());

// ライブラリなしでずれを得る: その時間帯の壁時計を UTC と比べる
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

`hourCycle: 'h23'` は明示してください。ICU の版によっては `en-US` のもとで真夜中を24時と報告し、日付が丸一日ずれます。見つけるのが本当に憂鬱な不具合です。

**Python**

```python
from datetime import datetime, timezone
from zoneinfo import ZoneInfo  # 3.9 以降は標準ライブラリ

now = datetime.now(timezone.utc)
local = now.astimezone(ZoneInfo("Asia/Kathmandu"))
```

`datetime.utcnow()` は使ってはいけません。UTC の_ように見える_のに時間帯を持たない素朴な日時を返し、時間帯つきの日時と混ぜると最悪の場面で例外を投げます。正しい呼び出しは `datetime.now(timezone.utc)` です。

**Java**

```java
Instant now = Instant.now();
ZonedDateTime local = now.atZone(ZoneId.of("Asia/Kathmandu"));
```

`java.time` はよく設計されています。時間軸上の点には `Instant`、時間帯を持たない壁時計の読みには `LocalDateTime`、その両方には `ZonedDateTime`。この手引きが繰り返し強調してきた区別を、型が強制してくれます。

**Go**

```go
loc, _ := time.LoadLocation("Asia/Kathmandu")
local := time.Now().In(loc)
```

`LoadLocation` は環境の tzdata を読みます。素のコンテナには存在しません。`_ "time/tzdata"` を取り込んで実行ファイルへ埋め込んでください。さもないと、時間帯の参照はすべて黙って UTC に落ちます。

## 年に二日

進める側は一時間を消し、戻す側は一時間を繰り返します。方針を決め、一貫して適用し、何をしたのかを利用者に伝えてください。

- **存在しない現地時刻**（米国の春の切り替え日の02:30）— 欠けた幅だけ前へ送り、02:30 を03:30 とする。
- **曖昧な現地時刻**（米国の秋の切り替え日の01:30）— 最初の、つまり早いほうの出現を採る。

本サイトが用いている方針であり、ECMAScript の `Temporal` の既定値 `disambiguation: 'compatible'` と一致します。振る舞いを実行環境と揃えるうえで、合わせる価値があります。

欠けた幅はつねに一時間とはかぎりません。ロード・ハウ島は30分ずれるので、幅は決め打ちせず切り替えそのものから読み取ってください。

## 試験

四つの場合でおおむね捕まえられます。

1. **三十分の時間帯** — `Asia/Kolkata`（+05:30）。整数時間という前提を捕まえます。
2. **四十五分の時間帯** — `Asia/Kathmandu`（+05:45）。三十分刻みという前提を捕まえます。
3. **南半球の時間帯** — `Australia/Sydney`。「夏といえば6月」を捕まえます。
4. **ロード・ハウ島** — `Australia/Lord_Howe`。決め打ちの60分の切り替えを捕まえるのは、これだけです。

利用者が実際にいる時間帯ごとに、進める日と戻す日をひとつずつ加えてください。あわせて、継続的統合で tzdata の版を固定し、データベースの更新が誤った理由でビルドを落とさないようにします。

## 繰り返しの予定は別の問題です

一度きりの予定は瞬間です。繰り返しの予定は規則であり、両者は別の保存を必要とします。

「Europe/London で毎週火曜日の09:00」は「この瞬間から604800秒ごと」ではありません。英国が時計を動かした瞬間に両者は離れます。規則は会議を現地の09:00 に保ち、間隔のほうは08:00 や10:00 へ流されます。

規則 — 現地時刻、時間帯の識別子、繰り返しの型 — を保存し、そこから瞬間を実体化してください。tzdata が変わったら実体化した瞬間を作り直します。移行させてはいけません。利用者が同意したのは規則のほうです。

厄介な場合は、年に二度の不連続から出てきます。毎日02:30 の会議は、春のある日にその時刻が存在せず、秋のある日には二度起きることに気づきます。方針を決め、一貫して適用し、そして暦の実装ごとに違う方針が選ばれていることを知っておいてください。同じ繰り返しの予定が、年にちょうど二日だけ、二人の予定表で一時間ずれて見えるのはそのためです。

## `Temporal` について

ECMAScript の `Temporal` は、`java.time` のやり方で、瞬間、壁時計の時刻、時間帯つきの日時を区別する型によって `Date` を置き換えます。`Temporal.ZonedDateTime` は時間帯の識別子を持ち、`Temporal.Instant` は時間軸上の点であり、`Temporal.PlainDateTime` は時間帯のない壁時計の読みです。型がそれらの取り違えを止めてくれます。

その `disambiguation` の設定は、この手引きが立ち返り続けてきた年に二日の方針をそのまま露出させます。`'compatible'`（既定 — 欠けた区間を前へ送り、曖昧な組では早いほうを採る）、`'earlier'`、`'later'`、`'reject'`。最後のものは、黙って一時間ずれるほうが失敗より悪い場面すべてで検討に値します。
