---
title: How to run a standup across many time zones
description: The daily synchronous standup does not survive four time zones. What replaces it, and how to make the replacement actually work.
summary: A daily standup works because everyone is awake at once. Past about a six-hour spread that stops being true, and the honest fix is to change the format rather than to keep shifting the time.
publishedAt: '2026-01-15'
updatedAt: '2026-01-15'
order: 8
keywords:
  ['global standup', 'async standup', 'distributed team meetings', 'remote standup time zones']
related: ['scheduling-across-twelve-hours', 'how-time-zones-work', 'why-daylight-saving-exists']
---

The daily standup is a fifteen-minute synchronous meeting that works because everyone is at their desk at the same time. Spread the team across four time zones and that premise fails. Most teams respond by moving the meeting, discover it is now bad for someone else, and move it again.

The meeting is not the point. Three things are: everyone knows what everyone else is doing, blockers surface within a day, and people feel like a team. All three can be had without the meeting, and past a certain spread they have to be.

## Work out your spread first

Take the earliest and latest zone on the team and compute the difference at the _current_ date, not from memory. The answer moves: a team spanning New York and Sydney is 16 hours apart in the northern winter and 14 in the northern summer, because both observe daylight saving in opposite seasons.

Then find the shared 09:00–18:00 window. That number decides the format:

| Shared window | What works                                                                 |
| ------------- | -------------------------------------------------------------------------- |
| 4+ hours      | A synchronous standup, if you want one                                     |
| 2–4 hours     | Synchronous, but protect that window for decisions only                    |
| Under 2 hours | Written standup, with a weekly synchronous call                            |
| None          | Fully written, plus deliberate overlap for the few things that need voices |

## The written standup

The format that survives contact with reality is a short written post per person, at the _start of their own day_, in one shared place.

Three prompts:

1. **What I finished** — not "worked on the parser", but "the parser now handles nested quotes; merged in #482"
2. **What I am doing next** — specific enough that someone can tell if it overlaps with theirs
3. **What is blocking me** — and who can unblock it, named

The third one is where the value is. In a synchronous standup, a blocker gets raised and resolved in the same fifteen minutes. In writing, it needs the name of the person who can clear it, or it sits for a full day cycle.

**Post at the start of your day, not the end.** Written at the end of your day, a post reaches colleagues who have already finished theirs — a full extra cycle of delay. Written at the start, it reaches the person going to bed while you are getting up, which is exactly the handoff you want.

## What to keep synchronous

Not everything should be written. Three things genuinely need voices:

- **Decisions with real disagreement.** A thread that has gone four rounds without converging will not converge on the fifth. Twenty minutes on a call ends it.
- **Anything with emotional weight.** Feedback, conflict, bad news. Writing strips tone, and readers supply the worst one.
- **Ambiguity you cannot yet name.** "Something feels wrong about this design but I cannot articulate what" needs a conversation.

Everything else — status, progress, most questions, most decisions — is better written, because written scales and voices do not.

## Making one weekly call work

Most teams past a six-hour spread settle on one synchronous meeting a week. To make it worth the cost to whoever takes it outside their day:

**Rotate it, and mean it.** If the same region always takes the 22:00 slot, you do not have a rotation, you have a hierarchy.

**Put it in a fixed zone and say which.** "Thursday 14:00 UTC" is unambiguous and does not drift when one region changes its clocks. "Thursday 9am Eastern" moves for everyone else twice a year, and nobody expects it.

**Have an agenda, sent a day ahead.** Someone joining at 22:00 deserves to know whether it will be worth it, and to add the thing they care about before it starts.

**Record it, and write up the decisions.** People will miss it. The write-up is the artefact; the call is the process.

## The failure modes

**The invisible drift.** A recurring meeting anchored to one region's local time moves an hour for everyone else twice a year, and can land somewhere nobody agreed to. Anchor to UTC or re-confirm after each change-over.

**The accreting attendee list.** A meeting scheduled when the team was in three zones is still running now it is in six, and for the newest three the time is much worse. Nobody proposes moving it, because moving it is somebody else's inconvenience. Review the attendee list against the current spread twice a year — the daylight saving dates are a convenient prompt.

**The written standup nobody reads.** If posts go into a channel nobody opens, you have added work and removed the meeting's only benefit. Someone has to read them and respond, at least at first, or the habit dies inside a month.

**The 07:00 that became 06:00.** Somebody agreed to an early call once, as a favour. It became permanent, then daylight saving made it an hour earlier, and nobody revisited it. Ask.

## What to measure

If you are unsure whether the change worked, three signals are worth watching, and none of them is meeting attendance.

**Time-to-unblock.** How long between someone saying they are stuck and someone else responding? In a synchronous standup this is minutes. Well-run asynchronous teams get it under half a working day. Over a full day, the format is failing.

**Decisions per week that needed a call.** If this is rising, the written channel is not carrying enough context and people are escalating to voice by default.

**Who is joining outside their working day, and how often.** Track it by name. This is the number that tells you whether "we rotate the awkward slot" is true or aspirational.

## Starting the change

Teams that switch successfully tend to do it in one step rather than by degrees, because a half-written standup is worse than either pure form — people wait for the meeting to say the thing they should have written.

Announce the last synchronous standup, agree the written format and where it lives, and run it for four weeks before judging. The first fortnight will feel like a loss of contact, because it is: the informal chatter around a daily call is real value, and it needs somewhere else to go. A dedicated social channel is a poor substitute for it, but it is a substitute, and the alternative is asking people to be awake at 22:00 to sustain it.
