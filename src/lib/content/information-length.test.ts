import { describe, expect, it } from 'vitest';
import { CJK_WEIGHT, atLeast, informationLength } from './information-length.ts';

describe('informationLength', () => {
  it('counts Latin script as plain characters', () => {
    expect(informationLength('How to report an error.')).toBe('How to report an error.'.length);
  });

  it('weights Han ideographs above Latin letters', () => {
    // Four ideographs plus a full stop.
    expect(informationLength('时区转换。')).toBe(4 * CJK_WEIGHT + 1);
  });

  it('weights kana and Hangul the same as Han', () => {
    expect(informationLength('ひらがな')).toBe(4 * CJK_WEIGHT);
    expect(informationLength('カタカナ')).toBe(4 * CJK_WEIGHT);
    expect(informationLength('한글입니다')).toBe(5 * CJK_WEIGHT);
  });

  it('handles a mixed string one character at a time', () => {
    // "UTC" stays Latin; the three ideographs are weighted.
    expect(informationLength('UTC 時間帯')).toBe(4 + 3 * CJK_WEIGHT);
  });

  it('is zero for an empty string', () => {
    expect(informationLength('')).toBe(0);
  });
});

describe('atLeast', () => {
  const forty = atLeast(40);

  it('passes a real CJK description that raw character counting would reject', () => {
    const chinese = '如何报告错误、提出问题，或反映安全问题。';
    expect(chinese.length).toBeLessThan(40);
    expect(forty.check(chinese)).toBe(true);
  });

  it('passes a real Japanese and Korean description too', () => {
    expect(forty.check('誤りの報告、質問、セキュリティ上の問題の連絡方法について。')).toBe(true);
    expect(forty.check('오류를 알리거나 질문을 하거나 보안 문제를 제보하는 방법.')).toBe(true);
  });

  it('still rejects a CJK fragment that is genuinely too thin', () => {
    expect(forty.check('時間帯')).toBe(false);
    expect(forty.check('联系')).toBe(false);
  });

  it('still rejects a short English description', () => {
    expect(forty.check('Contact us.')).toBe(false);
  });

  it('passes a full English description', () => {
    expect(forty.check('How to report an error, ask a question, or raise a security issue.')).toBe(
      true,
    );
  });
});
