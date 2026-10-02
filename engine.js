/* ============================================================
   镜面塔罗 · Mirror Tarot
   engine.js —— 智能分析引擎
   ============================================================ */

(function (window) {
  'use strict';

  // ============================================================
  //  22 张大阿卡纳（每张牌带 color 主题色）
  // ============================================================
  var DECK = [
    { id: 0,  n: '愚者',    e: 'The Fool',            s: '○', color: '#D0D0D0', k: '开始·未知',
      body: '还没有答案的时候，就敢往前走。',
      past: '你曾经在没什么把握的时候，迈出了一步。',
      present: '你现在站在一个还没有答案的起点。',
      future: '接下来会出现一个新的开始，方向未必清晰。' },

    { id: 1,  n: '魔术师',  e: 'The Magician',        s: '∞', color: '#FF8C2A', k: '创造·行动',
      body: '你手上的工具，比你意识到的多。',
      past: '你曾经用过一些自己都没完全意识到的能力。',
      present: '你现在拥有的条件，已经够开始了。',
      future: '接下来你会更主动地使用你手上的东西。' },

    { id: 2,  n: '女祭司',  e: 'The High Priestess',  s: '☽', color: '#5B8DEF', k: '直觉·内在',
      body: '有些答案不需要说出来，你已经在听。',
      past: '你心里早就有一个答案，只是没有说出口。',
      present: '你现在在听一个还没有成形的信号。',
      future: '接下来你会更靠近内在的判断，而不是外面的声音。' },

    { id: 3,  n: '皇后',    e: 'The Empress',         s: '♀', color: '#7FB56C', k: '滋养·丰盛',
      body: '对自己好一点，也是一种能力。',
      past: '你曾经被什么东西滋养过，或者滋养过别人。',
      present: '你现在需要一点照顾，也许是别人给你的，也许是你给自己的。',
      future: '接下来会有一段相对柔软、丰盛的时期。' },

    { id: 4,  n: '皇帝',    e: 'The Emperor',         s: '♛', color: '#C44545', k: '秩序·边界',
      body: '边界不是墙，是你允许什么进入。',
      past: '你曾经在某件事上立过一条线。',
      present: '你现在正在思考，什么可以进来，什么不行。',
      future: '接下来你需要建立更清楚的边界。' },

    { id: 5,  n: '教皇',    e: 'The Hierophant',      s: '✝', color: '#C9A960', k: '传统·信念',
      body: '你遵循的规则，是你自己选的吗？',
      past: '你曾经在一个既有的框架里待过一段时间。',
      present: '你现在在和某种规则或者信念打交道。',
      future: '接下来会涉及一个关于「要不要遵循」的选择。' },

    { id: 6,  n: '恋人',    e: 'The Lovers',          s: '♡', color: '#FF8FA3', k: '选择·结合',
      body: '每一个选择，都在替你说一句话。',
      past: '你曾经做过一个把某个人或者某件事放进生命里的选择。',
      present: '你现在正面对一个分岔口。',
      future: '接下来会出现一个需要你选边的时刻。' },

    { id: 7,  n: '战车',    e: 'The Chariot',         s: '⚔', color: '#6B8FC8', k: '意志·前进',
      body: '不用想太远，先推进一寸。',
      past: '你曾经靠一股劲头推着某件事往前走。',
      present: '你现在有一股推动力，但方向需要确认。',
      future: '接下来你需要靠意志力往前推一段。' },

    { id: 8,  n: '力量',    e: 'Strength',            s: '⧖', color: '#A8B56C', k: '勇气·耐心',
      body: '慢一点，比用力更有力量。',
      past: '你曾经用耐心处理过一件本来会炸的事。',
      present: '你现在需要用柔的方式，而不是硬碰硬。',
      future: '接下来会考验你的耐性，而不是你的爆发力。' },

    { id: 9,  n: '隐者',    e: 'The Hermit',          s: '✧', color: '#8B7FD0', k: '独处·探索',
      body: '今天可以少说一点。',
      past: '你曾经一个人扛过一段路。',
      present: '你现在需要一段独处，把事情想清楚。',
      future: '接下来会有一段时间，你更愿意一个人待着。' },

    { id: 10, n: '命运之轮', e: 'Wheel of Fortune',   s: '☸', color: '#B388FF', k: '变化·周期',
      body: '有些事情正在转到它的另一面。',
      past: '有一件事曾经悄悄转了一个方向。',
      present: '你现在正站在一个周期转换的点上。',
      future: '接下来会发生一个不由你控制的变化。' },

    { id: 11, n: '正义',    e: 'Justice',             s: '⚖', color: '#5BB3C8', k: '平衡·因果',
      body: '你心里其实已经有一杆秤。',
      past: '你曾经做过一个和公平有关的判断。',
      present: '你现在需要在两件事之间找一个平衡。',
      future: '接下来会有一个讲道理的阶段。' },

    { id: 12, n: '倒吊人',  e: 'The Hanged Man',      s: '▽', color: '#D08A40', k: '暂停·视角',
      body: '停一下，不是退，是换个角度。',
      past: '你曾经主动停下来，换了一个角度。',
      present: '你现在需要的是停一停，而不是继续推。',
      future: '接下来会有一段看似停滞、其实在转视角的时间。' },

    { id: 13, n: '死神',    e: 'Death',               s: '☠', color: '#7A7A7A', k: '结束·转化',
      body: '有什么正在结束，你感觉到了。',
      past: '有一件事已经结束了，只是你当时没有立刻承认。',
      present: '你现在正在面对一个已经结束、但还没放下的东西。',
      future: '接下来会有一个自然的结束，然后是一个新的开始。' },

    { id: 14, n: '节制',    e: 'Temperance',          s: '△', color: '#7FD0B5', k: '平衡·融合',
      body: '两个极端之间，有一个你能站稳的点。',
      past: '你曾经在两个极端之间找过一个中间值。',
      present: '你现在正在调和两种不太一样的东西。',
      future: '接下来会有一个慢慢融合的过程。' },

    { id: 15, n: '恶魔',    e: 'The Devil',           s: '⛧', color: '#A04040', k: '束缚·欲望',
      body: '注意你想抓住什么。',
      past: '你曾经被某个东西抓住过——也许是一段关系、一个习惯、一种执念。',
      present: '你现在在抓着什么东西，不太想放手。',
      future: '接下来会有一个关于「放手」的功课。' },

    { id: 16, n: '塔',      e: 'The Tower',           s: '⚡', color: '#E04040', k: '崩塌·觉醒',
      body: '让该塌的塌，之后才看得清。',
      past: '你曾经经历过一次突然的动摇或者垮塌。',
      present: '你现在正处在某个东西快要撑不住的时刻。',
      future: '接下来可能会有一个突然的转变，不一定是坏事。' },

    { id: 17, n: '星星',    e: 'The Star',            s: '★', color: '#FFE080', k: '希望·指引',
      body: '不需要看清全部，只需要看清下一步。',
      past: '你曾经在一个很暗的时刻，看到过一点光。',
      present: '你现在心里有一个还没熄灭的小小希望。',
      future: '接下来会有一件小事，帮你确认方向。' },

    { id: 18, n: '月亮',    e: 'The Moon',            s: '☾', color: '#A8B0D0', k: '幻象·潜意识',
      body: '今天不必看清全部。允许自己看不清。',
      past: '你曾经在一团模糊里做过一个判断。',
      present: '你现在看到的东西，可能不是全部。',
      future: '接下来会有一段情绪和事实分不清的时间。' },

    { id: 19, n: '太阳',    e: 'The Sun',             s: '☀', color: '#FFD740', k: '光明·清晰',
      body: '今天可以简单一点，明亮一点。',
      past: '你曾经经历过一段比较明亮、清爽的时间。',
      present: '你现在有一些东西是清晰的，可以信赖的。',
      future: '接下来会有一件让你踏实的事发生。' },

    { id: 20, n: '审判',    e: 'Judgement',           s: '✦', color: '#C06090', k: '觉醒·召唤',
      body: '有一件事，你已经准备好面对了。',
      past: '你曾经被某件事叫醒过。',
      present: '你现在被什么东西轻轻叫醒，只是你还没起身。',
      future: '接下来会有一个需要你回应的时刻。' },

    { id: 21, n: '世界',    e: 'The World',           s: '◉', color: '#5BC0DE', k: '完成·圆满',
      body: '你正在靠近一个循环的终点。',
      past: '你曾经完整地走完过一件事。',
      present: '你现在正站在一件事的最后一里路上。',
      future: '接下来会有一个自然的收尾。' }
  ];

  // ============================================================
  //  每日观察语（按牌 id 索引）
  // ============================================================
  var DAILY_OBS = {
    0:  '今天允许自己还没想清楚。',
    1:  '你已有的工具，比你以为的多。',
    2:  '有些答案不需要说出来。',
    3:  '今天可以对自己好一点。',
    4:  '边界不是墙，是你允许什么进入。',
    5:  '你遵循的规则，是你选的吗？',
    6:  '今天的选择，都在替你说一句话。',
    7:  '不用想太远，先推进一寸。',
    8:  '慢一点，比用力更有力量。',
    9:  '今天可以少说一点。',
    10: '有些事情正在转到另一面。',
    11: '你心里其实已经有一杆秤。',
    12: '停一下，不是退，是换个角度。',
    13: '有什么正在结束，你感觉到了。',
    14: '两个极端之间，有一个能站稳的点。',
    15: '注意你想抓住什么。',
    16: '让该塌的塌，之后才看得清。',
    17: '不需要看清全部，只需看清下一步。',
    18: '今天不必看清全部。',
    19: '今天可以简单一点，明亮一点。',
    20: '有一件事，你已经准备好面对了。',
    21: '你正在靠近一个循环的终点。'
  };

  // ============================================================
  //  阶段划分（愚者之旅的三段）
  // ============================================================
  function stageOf(id) {
    if (id <= 6)  return 0;
    if (id <= 14) return 1;
    return 2;
  }

  function stageName(s) {
    return ['开端', '试炼', '转化'][s];
  }

  // 相邻两牌的运动方向
  function motion(a, b) {
    var d = b.id - a.id;
    if (Math.abs(d) <= 3) return 'near';
    return d > 0 ? 'forward' : 'backward';
  }

  function motionPhrase(m) {
    if (m === 'near')    return '主题没有大改，只是换了一个角度';
    if (m === 'forward') return '是从更前面的状态，走到了更后面的位置';
    return '是从更后面的状态，走回到了更前面的位置';
  }

  // ============================================================
  //  L2 分析引擎
  // ============================================================
  function analyze(question, cards) {
    var a = cards[0];
    var b = cards[1];
    var c = cards[2];

    // ---------- 第一层 · 单张解读 ----------
    var single =
      '【过去 · ' + a.n + '】\n' + a.past + '\n\n' +
      '【现在 · ' + b.n + '】\n' + b.present + '\n\n' +
      '【未来 · ' + c.n + '】\n' + c.future;

    // ---------- 第二层 · 牌与牌的关联 ----------
    var m1 = motion(a, b);
    var m2 = motion(b, c);
    var sA = stageOf(a.id);
    var sB = stageOf(b.id);
    var sC = stageOf(c.id);

    var lines = [];

    lines.push('从「' + a.n + '」到「' + b.n + '」，' + motionPhrase(m1) + '。');
    lines.push('从「' + b.n + '」到「' + c.n + '」，' + motionPhrase(m2) + '。');

    if (sA === sB && sB === sC) {
      lines.push(
        '三张牌都落在「' + stageName(sA) + '」阶段——' +
        '你在这段时间里，一直在同一个课题里打转，只是换了不同的面孔。'
      );
    } else if (sA < sC) {
      lines.push(
        '整体上，你正在从「' + stageName(sA) + '」走到「' + stageName(sC) + '」——' +
        '这是一个往前推的方向。'
      );
    } else if (sA > sC) {
      lines.push(
        '整体上，你正在从「' + stageName(sA) + '」回到「' + stageName(sC) + '」——' +
        '这不是退步，更像是在回头整理某些还没处理完的东西。'
      );
    } else {
      lines.push('三张牌在阶段上有些摇摆，说明你正处在两种状态之间来回。');
    }

    var relation = lines.join('\n');

    // ---------- 第三层 · 综合观察 ----------
    var observation = buildObservation(question, sA, sB, sC);

    return {
      single: single,
      relation: relation,
      observation: observation
    };
  }

  function buildObservation(question, sA, sB, sC) {
    var head = '你问的是「' + question + '」。';
    var core, ask;

    if (sA === sB && sB === sC) {
      core = '牌面上没有出现明显的变化，反而是三张牌在同一层次里互相呼应。' +
             '也许问题不在「怎么变」，而在「你到底在看哪一面」。';
      ask  = '你现在最不愿意看的，是哪一张？';
    } else if (sA < sC) {
      core = '牌面整体是往前走的。你已经在动了，只是还没回头确认过自己走到了哪里。';
      ask  = '你已经走到这里了——下一步，你想先确认什么？';
    } else if (sA > sC) {
      core = '牌面看起来在往回走。有些东西还没有真正过去，它在用另一种方式提醒你。';
      ask  = '你在回望的那件事，真的还没有结束吗？';
    } else {
      core = '牌面在两种状态之间摆动。这不是混乱，而是你正在两件事之间找平衡。';
      ask  = '这两件事，哪一件更值得你现在花力气？';
    }

    return head + '\n\n' + core + '\n\n' + ask;
  }

  // ============================================================
  //  工具函数
  // ============================================================
  function randomCard() {
    return DECK[Math.floor(Math.random() * DECK.length)];
  }

  function pickUnique(n) {
    var picked = [];
    var used = {};
    var guard = 0;
    while (picked.length < n && guard < 500) {
      guard++;
      var c = randomCard();
      if (used[c.id]) continue;
      used[c.id] = 1;
      picked.push(c);
    }
    return picked;
  }

  function findById(id) {
    for (var i = 0; i < DECK.length; i++) {
      if (DECK[i].id === id) return DECK[i];
    }
    return null;
  }

  function dailyObs(cardId) {
    return DAILY_OBS[cardId] || '注意你今天注意到了什么。';
  }

  // ============================================================
  //  对外接口
  // ============================================================
  window.MT = {
    DECK: DECK,
    DAILY_OBS: DAILY_OBS,
    analyze: analyze,
    dailyObs: dailyObs,
    randomCard: randomCard,
    pickUnique: pickUnique,
    findById: findById,
    stageOf: stageOf,
    stageName: stageName
  };

})(window);
