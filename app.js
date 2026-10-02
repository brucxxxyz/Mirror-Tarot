/* ============================================================
   镜面塔罗 · Mirror Tarot
   app.js —— 界面逻辑
   ------------------------------------------------------------
   依赖：engine.js（window.MT）
   职责：
   1. Tab 切换
   2. 日卡：抽一张、记录
   3. 一问：L2 翻牌（逐张点击翻开）+ L2 分析（三层）
   4. 历史记录：列表、展开、持久化
   5. 明暗主题切换
   ============================================================ */

(function () {
  'use strict';

  // 防止 engine.js 没加载成功
  if (!window.MT) {
    alert('engine.js 未加载，请确认文件是否在同一目录。');
    return;
  }

  var MT = window.MT;
  var $ = function (id) { return document.getElementById(id); };

  // ============================================================
  //  状态
  // ============================================================
  var state = {
    // 日卡：当前抽到的牌和观察语
    daily: { card: null, obs: '' },

    // 一问：当前三张牌 + 翻牌进度 + 分析结果
    ask: {
      cards: [],          // [过去, 现在, 未来]
      revealed: 0,        // 已翻开几张（0 / 1 / 2 / 3）
      reading: null,      // { single, relation, observation }
      question: ''
    },

    // 历史记录
    history: []
  };

  // 从 localStorage 读历史
  try {
    state.history = JSON.parse(localStorage.getItem('mt_h') || '[]');
  } catch (e) {
    state.history = [];
  }

  function saveHistory() {
    try {
      localStorage.setItem('mt_h', JSON.stringify(state.history));
    } catch (e) { /* 忽略 */ }
  }

  // ============================================================
  //  时间工具
  // ============================================================
  function nowStr() {
    var d = new Date();
    function p(x) { return x < 10 ? '0' + x : '' + x; }
    return d.getFullYear() + '-' + p(d.getMonth() + 1) + '-' + p(d.getDate())
         + ' ' + p(d.getHours()) + ':' + p(d.getMinutes());
  }

  // ============================================================
  //  Tab 切换
  // ============================================================
  var tabBtns = document.querySelectorAll('.tabs button');
  var views = document.querySelectorAll('.view');

  function switchTab(name) {
    for (var i = 0; i < tabBtns.length; i++) {
      tabBtns[i].classList.toggle('on', tabBtns[i].getAttribute('data-tab') === name);
    }
    for (var j = 0; j < views.length; j++) {
      views[j].classList.toggle('on', views[j].id === 'v-' + name);
    }
    if (name === 'hist') renderHistory();
  }

  for (var t = 0; t < tabBtns.length; t++) {
    tabBtns[t].onclick = function () {
      switchTab(this.getAttribute('data-tab'));
    };
  }

  // ============================================================
  //  主题切换
  // ============================================================
  var themeBtn = $('themeBtn');

  function isLight() {
    return document.body.classList.contains('light');
  }

  function setTheme(t) {
    document.body.classList.toggle('light', t === 'light');
    themeBtn.textContent = t === 'light' ? '☾' : '☀';
    try { localStorage.setItem('mt_t', t); } catch (e) {}
  }

  themeBtn.onclick = function () {
    setTheme(isLight() ? 'dark' : 'light');
  };

  try {
    setTheme(localStorage.getItem('mt_t') || 'dark');
  } catch (e) {
    setTheme('dark');
  }

  // ============================================================
  //  日卡
  // ============================================================
  var dailyBtn = $('dailyBtn');
  var dailyOut = $('dailyOut');

  dailyBtn.onclick = function () {
    var card = MT.randomCard();
    var obs = MT.dailyObs(card.id);
    state.daily.card = card;
    state.daily.obs = obs;
    dailyBtn.textContent = '再抽一张';
    renderDaily(card, obs);
  };

  function renderDaily(card, obs) {
    var html =
      '<div class="card-show">' +
        '<div class="card-symbol">' + card.s + '</div>' +
        '<div class="card-name">' + card.n + '</div>' +
        '<div class="card-en">' + card.e + '</div>' +
        '<div class="card-key">' + card.k + '</div>' +
      '</div>' +
      '<div class="reading-layer">' + obs + '</div>' +
      '<textarea id="dailyRef" placeholder="今天，我注意到..."></textarea>' +
      '<button class="act" id="dailySaveBtn">记录这一张</button>';

    dailyOut.innerHTML = html;

    $('dailySaveBtn').onclick = function () {
      var v = $('dailyRef').value.trim();
      if (!v) { alert('写点什么吧'); return; }
      if (!state.daily.card) return;

      state.history.unshift({
        id: 'h' + Date.now(),
        mode: 'daily',
        date: nowStr(),
        card: state.daily.card,
        obs: state.daily.obs,
        reflect: v
      });
      saveHistory();
      alert('已记录');
    };
  }

  // ============================================================
  //  一问 · L2 翻牌 + L2 分析
  // ============================================================
  var askBtn = $('askBtn');
  var askHint = $('askHint');
  var askStage = $('askStage');
  var askReading = $('askReading');
  var qInput = $('qInput');

  // 位置标签
  var POSITIONS = ['过去', '现在', '未来'];

  // 洗牌抽牌
  askBtn.onclick = function () {
    var q = qInput.value.trim();
    if (!q) { alert('先写下你的问题'); qInput.focus(); return; }

    // 洗牌过程中禁用按钮
    askBtn.disabled = true;
    askBtn.textContent = '洗牌中...';
    askHint.textContent = '洗牌中...';

    // 清空上一轮
    askStage.innerHTML = '';
    askReading.innerHTML = '';
    askReading.classList.remove('show');

    setTimeout(function () {
      var picked = MT.pickUnique(3);
      state.ask.cards = picked;
      state.ask.revealed = 0;
      state.ask.reading = null;
      state.ask.question = q;

      renderStage();
      askBtn.disabled = false;
      askBtn.textContent = '重新洗牌';
      askHint.textContent = '点击第 1 张 · 过去';
    }, 450);
  };

  // 渲染三张牌位（牌背朝上）
  function renderStage() {
    var html = '';
    for (var i = 0; i < 3; i++) {
      var card = state.ask.cards[i];
      html +=
        '<div class="stage-item">' +
          '<div class="pos">' + POSITIONS[i] + '</div>' +
          '<div class="stage-card clickable" data-idx="' + i + '">' +
            '<div class="inner">' +
              '<div class="face back"></div>' +
              '<div class="face front">' +
                '<div class="sym" style="color:' + card.color + '">' + card.s + '</div>' +
                '<div class="nm" style="color:' + card.color + '">' + card.n + '</div>' +
                '<div class="en">' + card.e + '</div>' +
              '</div>' +
            '</div>' +
          '</div>' +
        '</div>';
    }
    askStage.innerHTML = html;

    // 绑定点击
    var cards = askStage.querySelectorAll('.stage-card');
    for (var k = 0; k < cards.length; k++) {
      cards[k].onclick = onCardClick;
    }

    // 只让第一张可点
    setClickable(0);
  }

  // 设定哪张牌可点
  function setClickable(idx) {
    var cards = askStage.querySelectorAll('.stage-card');
    for (var i = 0; i < cards.length; i++) {
      cards[i].classList.remove('clickable');
      cards[i].classList.remove('locked');
      if (i < state.ask.revealed) continue; // 已翻开不动
      if (i === idx) {
        cards[i].classList.add('clickable');
      } else {
        cards[i].classList.add('locked');
      }
    }
  }

  // 点击一张牌
  function onCardClick() {
    var idx = parseInt(this.getAttribute('data-idx'), 10);

    // 只能点当前该点的那张
    if (idx !== state.ask.revealed) return;
    if (this.classList.contains('flipped')) return;

    this.classList.add('flipped');
    this.classList.remove('clickable');
    state.ask.revealed++;

    // 更新提示
    if (state.ask.revealed === 1) {
      askHint.textContent = '点击第 2 张 · 现在';
      setClickable(1);
    } else if (state.ask.revealed === 2) {
      askHint.textContent = '点击第 3 张 · 未来';
      setClickable(2);
    } else if (state.ask.revealed === 3) {
      askHint.textContent = '正在读卡...';
      var cards = askStage.querySelectorAll('.stage-card');
      for (var i = 0; i < cards.length; i++) cards[i].classList.remove('clickable');
      setTimeout(doAnalyze, 400);
    }
  }

  // L2 分析
  function doAnalyze() {
    var q = state.ask.question;
    var cards = state.ask.cards;
    var result = MT.analyze(q, cards);
    state.ask.reading = result;

    var html =
      '<div class="reading-layer single">' +
        '<span class="label">第一层 · 单张解读</span>' +
        result.single +
      '</div>' +
      '<div class="reading-layer relation">' +
        '<span class="label">第二层 · 牌与牌的关联</span>' +
        result.relation +
      '</div>' +
      '<div class="reading-layer observation">' +
        '<span class="label">第三层 · 综合观察</span>' +
        result.observation +
      '</div>' +
      '<textarea id="askRef" placeholder="读了这几张牌，你想到了什么？"></textarea>' +
      '<button class="act" id="askSaveBtn">记录这次抽卡</button>';

    askReading.innerHTML = html;
    askReading.classList.add('show');
    askHint.textContent = '已读完 · 写下你的回答';

    $('askSaveBtn').onclick = function () {
      var v = $('askRef').value.trim();
      if (!v) { alert('写点什么吧'); return; }

      state.history.unshift({
        id: 'h' + Date.now(),
        mode: 'ask',
        date: nowStr(),
        question: q,
        cards: cards,
        reading: result,
        reflect: v
      });
      saveHistory();
      alert('已记录到本机');

      // 重置一问
      qInput.value = '';
      askStage.innerHTML = '';
      askReading.innerHTML = '';
      askReading.classList.remove('show');
      askHint.textContent = 'Step 1 · 写下你的问题';
      askBtn.textContent = '洗牌 · 抽 3 张牌';
      state.ask.cards = [];
      state.ask.revealed = 0;
      state.ask.reading = null;
      state.ask.question = '';
    };
  }

  // ============================================================
  //  历史记录
  // ============================================================
  var histOut = $('histOut');

  function renderHistory() {
    if (!state.history.length) {
      histOut.innerHTML = '<div class="empty">还没有记录<br><br>去抽一张吧</div>';
      return;
    }

    var html = '';
    for (var i = 0; i < state.history.length; i++) {
      var h = state.history[i];

      // 卡片摘要
      var cardTxt = '';
      if (h.mode === 'daily') {
        cardTxt = '日卡 · ' + h.card.n;
      } else if (h.cards) {
        var arr = [];
        for (var j = 0; j < h.cards.length; j++) {
          arr.push(POSITIONS[j] + '·' + h.cards[j].n);
        }
        cardTxt = arr.join(' / ');
      }

      // 展开详情
      var detailHtml = '';
      if (h.mode === 'daily') {
        detailHtml =
          '<div class="lbl">观察</div>' + (h.obs || '') +
          (h.reflect ? '<div class="lbl">你的回答</div>' + h.reflect : '');
      } else if (h.reading) {
        detailHtml =
          '<div class="lbl">单张解读</div>' + h.reading.single +
          '<div class="lbl">牌与牌的关联</div>' + h.reading.relation +
          '<div class="lbl">综合观察</div>' + h.reading.observation +
          (h.reflect ? '<div class="lbl">你的回答</div>' + h.reflect : '');
      }

      html +=
        '<div class="hist-item">' +
          '<div class="hist-head">' +
            '<span>' + h.date + '</span>' +
            '<span>' + (h.mode === 'daily' ? '日卡' : '一问') + '</span>' +
          '</div>' +
          (h.question ? '<div class="hist-q">' + escapeHtml(h.question) + '</div>' : '') +
          '<div class="hist-cards">' + cardTxt + '</div>' +
          '<div class="hist-detail" style="display:none">' + detailHtml + '</div>' +
        '</div>';
    }
    histOut.innerHTML = html;

    // 绑定展开
    var items = histOut.querySelectorAll('.hist-item');
    for (var k = 0; k < items.length; k++) {
      items[k].onclick = function () {
        var d = this.querySelector('.hist-detail');
        if (!d) return;
        d.style.display = (d.style.display === 'block') ? 'none' : 'block';
      };
    }
  }

  function escapeHtml(s) {
    var d = document.createElement('div');
    d.textContent = s;
    return d.innerHTML;
  }

})();
