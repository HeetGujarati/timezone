---
title: "코드 속의 시간대 — 실무 안내"
description: "UTC로 저장하고, 시간대 식별자를 지키고, 표시할 때 변환하고, 차이 표는 절대 만들지 마십시오. 규칙과 그 각각의 근거를 정리합니다."
summary: "시간대 관련 결함은 거의 모두 네 가지 잘못 중 하나로 거슬러 올라갑니다. 대신 무엇을 해야 하는지를 자바스크립트, 파이썬, 자바, Go, SQL로, 규칙만이 아니라 근거와 함께 짚습니다."
publishedAt: '2026-01-15'
updatedAt: '2026-01-15'
order: 9
keywords: ['코드 속 시간대', '날짜 시각 모범 사례', '타임스탬프 저장', '데이터베이스 UTC']
related: ['what-utc-really-is', 'iso-8601-explained', 'the-2038-problem']
---

운영 환경에서 생기는 시간대 결함은 거의 모두 네 가지 잘못 중 하나로 거슬러 올라갑니다. 현지 시각을 저장하는 것, 시간대 대신 차이를 저장하는 것, 엉뚱한 계층에서 변환하는 것, 그리고 차이 표를 손으로 만드는 것. 아래의 모든 내용은 그것들을 피하는 데서 따라 나옵니다.

## 규칙 1 — 순간을 UTC로 저장하십시오

순간은 시간축 위의 한 점입니다. 현지 시각은 벽시계의 읽기이며, 시간대와 모호함 해소 방침이 있어야 비로소 무언가를 뜻합니다.

```sql
-- 좋음: 순간
created_at TIMESTAMPTZ NOT NULL

-- 나쁨: 시간대 없는 벽시계 읽기
created_at TIMESTAMP NOT NULL
```

PostgreSQL의 `TIMESTAMPTZ`는 시간대를 저장하지 않습니다. 쓸 때 UTC로 정규화하고 읽을 때 변환합니다. 「이 일이 언제 일어났는가」에 대해 바로 그것이 원하는 동작입니다.

## 규칙 2 — 차이가 아니라 시간대 식별자를 저장하십시오

_어디인지_ 알아야 한다면 — 되풀이되는 일정, 사용자 설정, 가게의 영업시간 — `+01:00`이 아니라 `Europe/London`을 저장하십시오.

차이는 하나의 순간에 관한 사실입니다. 시간대는 정부가 마음을 바꿔도 살아남는 규칙의 묶음입니다. 영국은 1월에 `+00:00`, 7월에 `+01:00`입니다. 둘 중 하나를 저장하고 「사용자의 시간대」라 부르면 한 해의 절반이 틀립니다.

```sql
event_start_local  TIMESTAMP   NOT NULL,  -- 사용자가 고른 벽시계 시각
event_time_zone    TEXT        NOT NULL,  -- 'Europe/London'
event_start_utc    TIMESTAMPTZ NOT NULL   -- 풀어낸 순간. 규칙이 바뀌면 다시 계산
```

되풀이되는 일정에서는 현지 시각과 시간대가 진실의 원천이고, UTC의 순간은 파생된 색인입니다. tzdata가 바뀌면 — 한 해에 여러 번 바뀝니다 — 파생 열을 다시 만들면 되고, 사용자의 09:00은 그대로 09:00입니다.

## 규칙 3 — 가장자리에서 변환하십시오

업무 논리는 순간으로 움직입니다. 사람이 읽을 현지 시각으로의 변환은 누가 읽는지 아는 계층에서, 가능한 한 마지막 순간에 이루어집니다.

따라 나오는 결론이 더 중요합니다. **서버 자신의 시간대가 동작에 새어들게 하지 마십시오.** 배포 환경에 `TZ=UTC`를 설정하고, 결과가 서버의 지역 설정에 좌우되는 코드 경로는 모두 결함으로 다루십시오. 누군가 두 번째 지역에 배포할 때에야 드러나는 부류의 고장입니다.

## 규칙 4 — 차이 표를 절대 만들지 마십시오

현대의 실행 환경은 모두 IANA 데이터베이스를 품고 있습니다. 그것을 쓰십시오.

**자바스크립트**

```js
// 시간대를 지정해 서식화하기
new Intl.DateTimeFormat('en-GB', {
  timeZone: 'Asia/Kathmandu',
  dateStyle: 'medium',
  timeStyle: 'short',
}).format(new Date());

// 라이브러리 없이 차이 구하기: 그 시간대의 벽시계를 UTC와 견주기
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

`hourCycle: 'h23'`을 분명히 지정하십시오. 어떤 ICU 판본은 `en-US` 아래에서 자정을 24시로 보고하고, 그러면 날짜가 하루 밀립니다. 찾아내기가 정말로 고약한 결함입니다.

**파이썬**

```python
from datetime import datetime, timezone
from zoneinfo import ZoneInfo  # 3.9부터 표준 라이브러리

now = datetime.now(timezone.utc)
local = now.astimezone(ZoneInfo("Asia/Kathmandu"))
```

`datetime.utcnow()`는 절대 쓰지 마십시오. UTC처럼 _보이지만_ 시간대를 지니지 않은 순진한 날짜를 돌려주고, 시간대를 아는 날짜와 섞으면 가장 나쁜 순간에 예외를 던집니다. 올바른 호출은 `datetime.now(timezone.utc)`입니다.

**자바**

```java
Instant now = Instant.now();
ZonedDateTime local = now.atZone(ZoneId.of("Asia/Kathmandu"));
```

`java.time`은 잘 설계되어 있습니다. 시간축 위의 점에는 `Instant`, 시간대 없는 벽시계 읽기에는 `LocalDateTime`, 둘을 합친 것에는 `ZonedDateTime`. 이 안내서가 거듭 강조하는 구분을 타입 체계가 강제합니다.

**Go**

```go
loc, _ := time.LoadLocation("Asia/Kathmandu")
local := time.Now().In(loc)
```

`LoadLocation`은 시스템의 tzdata를 읽습니다. 빈 컨테이너에는 그것이 없습니다. `_ "time/tzdata"`를 들여와 실행 파일에 심으십시오. 그러지 않으면 모든 시간대 조회가 소리 없이 UTC로 떨어집니다.

## 한 해의 두 날

앞으로 당기는 쪽은 한 시간을 지우고, 뒤로 미루는 쪽은 한 시간을 되풀이합니다. 방침을 고르고, 한결같이 적용하고, 무엇을 했는지 사용자에게 알리십시오.

- **존재하지 않는 현지 시각**(미국의 봄 전환일 02:30): 빈 구간의 크기만큼 앞으로 밀어 02:30을 03:30으로 만듭니다.
- **모호한 현지 시각**(미국의 가을 전환일 01:30): 첫 번째, 곧 이른 쪽 발생을 취합니다.

이 사이트가 쓰는 방침이고, ECMAScript `Temporal`의 기본값 `disambiguation: 'compatible'`과 일치합니다. 동작이 플랫폼과 어긋나지 않도록 맞춰 둘 값어치가 있습니다.

빈 구간이 언제나 한 시간인 것은 아닙니다. 로드하우섬은 30분 옮기므로, 크기를 넘겨짚지 말고 전환 자체에서 읽으십시오.

## 시험

네 가지 사례가 대부분을 잡아냅니다.

1. **삼십 분 시간대** — `Asia/Kolkata`(+05:30). 정수 시간이라는 가정을 잡습니다.
2. **사십오 분 시간대** — `Asia/Kathmandu`(+05:45). 삼십 분 단위라는 가정을 잡습니다.
3. **남반구 시간대** — `Australia/Sydney`. 「여름이면 6월」을 잡습니다.
4. **로드하우섬** — `Australia/Lord_Howe`. 코드에 박힌 60분 이동을 잡아내는 것은 이것뿐입니다.

사용자가 실제로 있는 시간대마다 앞당기는 날짜와 되돌리는 날짜를 하나씩 넣으십시오. 그리고 지속적 통합에서 tzdata 판본을 고정해, 데이터베이스 갱신이 엉뚱한 이유로 빌드를 떨어뜨리지 않게 하십시오.

## 되풀이되는 일정은 다른 문제입니다

한 번뿐인 일정은 순간입니다. 되풀이되는 일정은 규칙이고, 둘은 저장 방식이 다릅니다.

「Europe/London에서 매주 화요일 09:00」은 「이 순간부터 604800초마다」가 아닙니다. 영국이 시계를 옮기는 순간 둘은 갈라집니다. 규칙은 회의를 현지 09:00에 붙들어 두고, 간격은 그것을 08:00이나 10:00으로 흘려보냅니다.

규칙 — 현지 시각, 시간대 식별자, 되풀이 형태 — 을 저장하고, 거기서 순간을 실체화하십시오. tzdata가 바뀌면 실체화한 순간을 다시 만드십시오. 옮기지 마십시오. 사용자가 동의한 것은 규칙입니다.

껄끄러운 경우는 한 해 두 번의 불연속에서 나옵니다. 매일 02:30인 회의는 어느 봄날에는 그 시각이 없고 어느 가을날에는 두 번 일어난다는 것을 알게 됩니다. 방침을 고르고, 한결같이 적용하고, 달력 구현마다 다른 방침을 골랐다는 점을 알아 두십시오. 같은 되풀이 일정이 한 해에 딱 이틀, 두 사람의 달력에서 한 시간 어긋나 보이는 이유가 그것입니다.

## `Temporal`에 대하여

ECMAScript의 `Temporal`은 `java.time`과 같은 방식으로, 순간과 벽시계 시각과 시간대가 붙은 날짜시각을 구분하는 타입으로 `Date`를 대신합니다. `Temporal.ZonedDateTime`은 시간대 식별자를 지니고, `Temporal.Instant`는 시간축 위의 한 점이며, `Temporal.PlainDateTime`은 시간대 없는 벽시계 읽기입니다. 타입 체계가 이들을 헷갈리지 않도록 막아 줍니다.

그 `disambiguation` 설정은 이 안내서가 거듭 돌아온 한 해 두 날의 방침을 그대로 드러냅니다. `'compatible'`(기본값 — 빈 구간을 앞으로 통과, 모호한 짝에서는 이른 쪽을 선택), `'earlier'`, `'later'`, `'reject'`. 마지막 것은 소리 없이 한 시간 어긋나는 편이 오류보다 나쁜 모든 곳에서 고려할 값어치가 있습니다.
