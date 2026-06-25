# DESIGN.md

> Облачная 1С без установки — лендинг, который вызывает доверие за один экран.

**Проект**: промо-лендинг сервиса 1С:Фреш (аренда 1С-программ в облаке)
**Позиционирование**: запусти 1С за пять минут, работай из браузера откуда угодно — без сервера, обновлений и потери данных
**Точка отсчёта**: тёмный деловой стиль (глубина, доверие) — ориентиры тёмные редакции Linear / Stripe, с фирменной красно-жёлтой гаммой 1С (по стилю) и кириллической типографикой (реальный логотип не используется)

---

## 1. Visual Theme & Atmosphere

**Style**: Dark × Warm Professional × Trust-first SaaS
**Keywords**: доверие, ясность, глубина, профессионализм, спокойствие, красно-жёлтый акцент, аккуратность
**Tone**: тёмный, но не холодный; деловой и уверенный — **красно-жёлтый акцент (фирменная гамма 1С) светится на тёмном фоне** — NOT кричащий, неоновый, киберпанк, технократичный
**Feel**: тёмный кабинет с тёплой настольной лампой — спокойно, дорого, всё на своих местах

**Interaction Tier**: **L2 — плавный интерактив** (reveal по скроллу, sticky-навигация с размытием, hover-подъёмы карточек, счётчики, магнитный CTA)
**Dependencies**: чистый CSS + ванильный JS (IntersectionObserver, rAF). Без фреймворков и сборки.

---

## 2. Color Palette & Roles

```css
:root {
  /* Backgrounds — тёплый тёмный, не чистый чёрный */
  --bg: #131215;
  --surface: #232128;      /* карточки */
  --surface-2: #1A181E;    /* фон alt-секций */
  --surface-hover: #2C2A33;

  /* Borders — светлые с малой альфой */
  --border: rgba(255, 255, 255, 0.10);
  --border-strong: rgba(255, 255, 255, 0.18);

  /* Text — тёплые светлые, четыре уровня */
  --text-1: #F4F1EC;
  --text-2: #C5C0B8;
  --text-3: #948D82;
  --text-4: #6A6359;

  /* Accent — красный 1С по стилю (реальный логотип не используется) */
  --accent: #E2231A;
  --accent-hover: #FF4A41;
  --accent-soft: rgba(226, 35, 26, 0.16);

  /* Secondary — тёплый янтарь, дозированно (метки/иконки) */
  --warm: #F59E0B;
  --warm-soft: rgba(245, 158, 11, 0.16);

  /* Gradient — только для 1-2 ключевых слов */
  --gradient-key: linear-gradient(120deg, #FF4A41 0%, #FBB03B 100%);

  /* RGB variants for rgba() */
  --bg-rgb: 19, 18, 21;
  --accent-rgb: 226, 35, 26;
  --warm-rgb: 245, 158, 11;

  /* Semantic */
  --success: #2FD27A;
  --error: #FF4A41;
  --warning: #F59E0B;
}
```

**Color Rules**:
- все цвета через CSS-переменные, хардкод hex запрещён
- красный `--accent` (+ жёлтый `--warm` дозированно) — только акценты (CTA, активное состояние, ключевые маркеры); большие площади — `--surface` / `--bg`
- градиент `--gradient-key` — максимум на 1 ключевое слово в hero, нигде больше
- зелёный `--success` — только для галочек/«включено» в тарифах и списках преимуществ
- текст по уровням: заголовок `--text-1`, основной `--text-2`, вспомогательный `--text-3`, мелкие метки `--text-4`

**Светлая тема** (`[data-theme="light"]` на `<html>`; переключатель в nav, выбор в `localStorage`, по умолчанию — системная `prefers-color-scheme`):
```css
:root[data-theme="light"] {
  --bg: #FBFAF8; --surface: #FFFFFF; --surface-2: #F3EFE8; --surface-hover: #ECE6DD;
  --border: rgba(33,28,22,.12); --border-strong: rgba(33,28,22,.22);
  --text-1: #1E1B17; --text-2: #4A443B; --text-3: #6E665B; --text-4: #9A9385;
  --accent-hover: #C51C14; --accent-soft: rgba(226,35,26,.10); /* --accent (#E2231A) тот же — брендовый */
  --warm: #C2780A; --success: #149A50;                         /* темнее ради контраста на белом */
  --bg-rgb: 251,250,248;                                       /* для rgba-блюра sticky-nav */
  /* --shadow-*: мягкие тёплые тени вместо чёрных (см. styles.css) */
}
```
- `--accent` (#E2231A) одинаков в обеих темах — меняются только производные под фон
- инициализация темы — в инлайн-скрипте `<head>` (без FOUC); свап мгновенный (`.theme-switching` гасит transition на время переключения)

---

## 3. Typography Rules

**Font Stack** (обязательно кириллица):
```css
@import url('https://fonts.googleapis.com/css2?family=Manrope:wght@400;500;600;700;800&family=JetBrains+Mono:wght@400;500&display=swap');

--font-ui: 'Manrope', system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif;
--font-mono: 'JetBrains Mono', ui-monospace, 'SF Mono', Menlo, monospace;
```

| Role | Font | Size | Weight | Line Height | Letter Spacing |
|------|------|------|--------|-------------|----------------|
| Hero H1 | Manrope | `clamp(34px, 4.8vw, 60px)` | 800 | 1.06 | -0.02em |
| Section H2 | Manrope | `clamp(28px, 3.4vw, 44px)` | 800 | 1.12 | -0.015em |
| H3 / Card title | Manrope | 20px | 700 | 1.3 | -0.01em |
| Eyebrow Label | Manrope | 13px | 600 | 1.4 | 0.10em (uppercase) |
| Body Lg | Manrope | 18px | 400 | 1.6 | 0 |
| Body | Manrope | 16px | 400 | 1.65 | 0 |
| Small | Manrope | 14px | 500 | 1.5 | 0 |
| Stat number | Manrope | `clamp(36px, 4vw, 56px)` | 800 | 1.0 | -0.02em |
| Mono / Label | JetBrains Mono | 13px | 500 | 1.5 | 0 |

**Typography Rules**:
- все heading — Manrope 700–800; Heading weight ≥ 700
- основной текст 16–18px, line-height ≥ 1.6 (комфортное чтение на русском)
- eyebrow-метки uppercase + letter-spacing 0.10em, цвет `--text-3` или `--accent`
- **NEVER use**: Arial, Times New Roman, Comic Sans, шрифты без кириллицы

**Text Decoration** (по `text-decoration-rules.md`):
- Hero H1: одно ключевое слово («облако» / «1С») залить `--gradient-key`, **без тени** (на тёмном фоне градиент и так светится)
- Section H2: сплошной `--text-1`, без декора
- Body / H3: сплошной цвет, без декора

---

## 4. Component Stylings

### Buttons
```css
.btn-primary {
  display: inline-flex; align-items: center; gap: 8px;
  padding: 13px 22px; border-radius: 12px;
  background: var(--accent); color: #fff;
  font: 700 15px/1 var(--font-ui); letter-spacing: -0.01em;
  border: 1px solid var(--accent); cursor: pointer;
  transition: transform .22s var(--ease), background .14s var(--ease), box-shadow .22s var(--ease);
}
.btn-primary:hover { background: var(--accent-hover); transform: translateY(-2px); box-shadow: 0 10px 28px rgba(var(--accent-rgb), .28); }
.btn-primary:active { transform: translateY(0); }
.btn-primary:focus-visible { outline: 3px solid var(--accent-soft); outline-offset: 2px; }
.btn-primary:disabled { opacity: .5; cursor: not-allowed; transform: none; box-shadow: none; }

.btn-ghost {
  display: inline-flex; align-items: center; gap: 8px;
  padding: 12px 21px; border-radius: 12px;
  background: var(--surface); color: var(--text-1);
  border: 1px solid var(--border-strong);
  font: 700 15px/1 var(--font-ui); cursor: pointer;
  transition: background .14s, border-color .14s, transform .22s;
}
.btn-ghost:hover { background: var(--surface-2); border-color: var(--text-3); transform: translateY(-2px); }
.btn-ghost:focus-visible { outline: 3px solid var(--accent-soft); outline-offset: 2px; }
```

### Cards
```css
.card {
  background: var(--surface); border: 1px solid var(--border);
  border-radius: 16px; padding: 28px;
  transition: border-color .22s var(--ease), transform .22s var(--ease), box-shadow .22s var(--ease);
}
.card:hover { border-color: var(--border-strong); transform: translateY(-4px); box-shadow: 0 16px 40px rgba(33, 28, 22, .07); }
.card:focus-within { border-color: var(--accent); }
.card-icon {
  width: 44px; height: 44px; border-radius: 12px;
  background: var(--accent-soft); color: var(--accent);
  display: inline-flex; align-items: center; justify-content: center; margin-bottom: 18px;
}
```

### Navigation
```css
.nav { position: sticky; top: 0; z-index: 50; padding: 16px 0;
  background: transparent; border-bottom: 1px solid transparent;
  transition: background .25s, border-color .25s, backdrop-filter .25s; }
.nav.is-scrolled {
  background: rgba(var(--bg-rgb), .8); backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px); border-bottom-color: var(--border);
}
.nav-link { color: var(--text-2); font: 600 15px/1 var(--font-ui); transition: color .14s; }
.nav-link:hover { color: var(--text-1); }
```

### Theme toggle (кнопка-иконка в nav)
```css
.theme-toggle { width: 40px; height: 40px; border-radius: 10px;
  background: var(--surface); border: 1px solid var(--border-strong); color: var(--text-2); }
.theme-toggle:hover { color: var(--text-1); border-color: var(--text-3); transform: translateY(-2px); }
.theme-toggle .ico-moon { display: none; }                                    /* dark → солнце */
:root[data-theme="light"] .theme-toggle .ico-sun { display: none; }           /* light → луна */
:root[data-theme="light"] .theme-toggle .ico-moon { display: block; }
```
- остаётся видимой и на мобильном (внутри `.nav-cta`, рядом с CTA); JS пишет выбор в `localStorage` и синхронит `<meta name="theme-color">`

### Links
```css
.link { color: var(--accent); text-decoration: none;
  background: linear-gradient(var(--accent), var(--accent)) 0 100% / 0% 1.5px no-repeat;
  transition: background-size .28s var(--ease); }
.link:hover { background-size: 100% 1.5px; }
.link:focus-visible { outline: 3px solid var(--accent-soft); outline-offset: 3px; border-radius: 3px; }
```

### Tags / Badges
```css
.tag { display: inline-flex; align-items: center; gap: 6px;
  padding: 5px 11px; border-radius: 9999px;
  background: var(--accent-soft); color: var(--accent);
  font: 600 12px/1.4 var(--font-mono); letter-spacing: .02em; }
.tag-neutral { background: var(--surface-2); color: var(--text-3); border: 1px solid var(--border); }
.tag-success { background: rgba(24,169,87,.12); color: var(--success); }
```

### Testimonial card (база — `.card`)
```css
.testi { display: flex; flex-direction: column; gap: 12px; }
.testi-quote { font: 800 46px/1 var(--font-ui); color: var(--accent); opacity: .32; }  /* приглушённая кавычка-декор */
.testi-ava  { width: 42px; height: 42px; border-radius: 50%; background: var(--accent-soft); color: var(--accent); } /* инициалы */
.testi-name { color: var(--text-1); font-weight: 700; }
.testi-role { color: var(--text-3); font-size: 13.5px; }
```

### FAQ accordion (нативный `<details>`, без JS)
```css
.faq-item { background: var(--surface); border: 1px solid var(--border); border-radius: 14px; }
.faq-item:hover, .faq-item[open] { border-color: var(--border-strong); }
.faq-q { cursor: pointer; list-style: none; color: var(--text-1); font: 700 16.5px/1.4 var(--font-ui); } /* summary */
.faq-q::-webkit-details-marker { display: none; }
.faq-chev { color: var(--text-3); transition: transform .25s var(--ease), color .2s; }
.faq-item[open] .faq-chev { transform: rotate(180deg); color: var(--accent); }   /* индикатор раскрытия */
```
- доступность: фокус на `.faq-q` через `:focus-visible` (`--accent-soft`); работает без JS; деградирует под `prefers-reduced-motion`

### App mockup (детальные вкладки программ)
Панель `.prog-panel` — 2 колонки: `.pp-main` (описание `.pp-intro` + возможности + «кому подходит» + CTA `.pp-cta`) | `.pp-visual` (мини-мокап интерфейса). Стек в 1 колонку на ≤760px.
```css
.app-mock { background: var(--surface-2); border: 1px solid var(--border); border-radius: 14px; box-shadow: var(--shadow-soft); }
.am-bar { background: var(--surface); border-bottom: 1px solid var(--border); }       /* титулбар: иконка + имя + точки */
.am-row .k { background: var(--surface-hover); } .am-row .v { background: var(--border-strong); } /* строка списка */
.am-chart span { background: linear-gradient(var(--warm), var(--accent)); }            /* мини-график */
.am-pill.ok { color: var(--success); }  .am-pill.acc { background: var(--accent-soft); color: var(--accent); } /* статус-плашка */
```
- тематические варианты на программу: график (Бухгалтерия), строки-сотрудники (Зарплата), плитки модулей (ERP/УНФ), чек+итог (Касса), меню (Общепит); весь мокап `aria-hidden` — это декор.

---

## 5. Layout Principles

**Container**: `max-width: 1120px`; side padding `clamp(18px, 3.5vw, 36px)`; узкий вариант (текст) `720px`. Плотная сетка.

**Spacing Scale**:
```
--sp-1:4px  --sp-2:8px  --sp-3:12px --sp-4:16px --sp-5:24px
--sp-6:32px --sp-7:48px --sp-8:64px --sp-9:96px --sp-10:128px
```
- Section padding: `44px → 80px` (адаптив; плотная компоновка)
- Card padding 22px; gap сетки 16px; интервалы внутри hero 16-24

**Grid**:
```css
.grid-3 { display: grid; grid-template-columns: repeat(3, 1fr); gap: 22px; }
.grid-2 { display: grid; grid-template-columns: repeat(2, 1fr); gap: 22px; }
@media (max-width: 900px) { .grid-3 { grid-template-columns: 1fr 1fr; } }
@media (max-width: 600px) { .grid-3, .grid-2 { grid-template-columns: 1fr; } }
```

---

## 6. Depth & Elevation

Тёмная тема → глубину дают поверхности и мягкое свечение; тени почти не видны.

| Level | Treatment | Use |
|-------|-----------|-----|
| Flat | без border/shadow | фон, eyebrow, текст |
| Bordered | `1px solid var(--border)` (светлый, малая альфа) | карточки, поля по умолчанию |
| Hover | `border-strong` + `translateY(-4px)` + `0 18px 50px rgba(0,0,0,.55)` | карточки на hover |
| Raised | `0 12px 32px rgba(var(--accent-rgb), .42)` | primary CTA на hover (красный glow) |
| Glow | радиальные red/amber пятна под hero и в CTA-бэнде | атмосфера, акцент |
| Blur | `backdrop-filter: blur(12px)` + `rgba bg` | sticky-nav при скролле |

Запрещены: жёсткие неоновые ободки, кислотные заливки.

---

## 7. Animation & Interaction

**Motion Philosophy**: спокойный деловой ритм, движение только подчёркивает структуру — секции мягко всплывают, цифры считаются, CTA «притягивается». Никаких аттракционов.
**Tier**: **L2**

### Timing tokens
```css
--ease: cubic-bezier(.2, 0, 0, 1);
--ease-soft: cubic-bezier(.2, .8, .2, 1);
--dur-fast: .14s; --dur-mid: .22s; --dur-reveal: .7s;
```

### Entrance (reveal по скроллу)
```css
.reveal { opacity: 0; transform: translateY(22px); transition: opacity .7s var(--ease), transform .7s var(--ease); }
.reveal.in-view { opacity: 1; transform: translateY(0); }
/* stagger дочерних */
.reveal.in-view > * { transition-delay: calc(var(--i, 0) * .08s); }
```
JS: `IntersectionObserver` (threshold .12) добавляет `.in-view`, затем `unobserve`.

### Обязательные signature-моменты (L2)
- **Hero H1** — ключевое слово «облако» с текущим градиентом (`background-position` анимация, 18s).
- **Section H2** — fadeUp при появлении (reveal).
- **Body/eyebrow** — stagger reveal списков и карточек.
- **Элемент** — магнитный primary CTA (rAF-троттлинг, ±10px); hover-подъём карточек.
- **Компонент** — лента логотипов-доверия (бесконечный marquee, чистый CSS) + счётчики (count-up при появлении).
- **Background** — мягкое тёплое радиальное свечение за hero (CSS radial-gradient, без WebGL).

### Nav scrolled
```css
const nav: toggle('.is-scrolled', scrollY > 24)  // rAF-throttled
```

### Reduced Motion
```css
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after { animation-duration:.01ms!important; animation-iteration-count:1!important; transition-duration:.01ms!important; scroll-behavior:auto!important; }
  .reveal { opacity: 1; transform: none; }
}
```

---

## 8. Do's and Don'ts

### Do
- ✅ красный (+ жёлтый дозированно) — акценты: CTA, активные маркеры, 1-2 ключевых слова
- ✅ держи аккуратный воздух; секции компактны (44–80px между ними)
- ✅ каждая секция: eyebrow + H2 + подзаголовок, затем контент
- ✅ зелёные галочки `--success` для «включено» в тарифах/преимуществах
- ✅ карточки на hover только поднимаются + усиливают границу + мягкая тень
- ✅ цифры-доказательства (компании, аптайм, программы) — крупно, со счётчиком
- ✅ обязательная деградация `prefers-reduced-motion`
- ✅ кнопки ≥ 44px по высоте, тач-цели крупные

### Don't
- ❌ не заливай большие площади красным (это акцент, не фон)
- ❌ не больше 3 цветов: красный + жёлтый (янтарь) + тёплые нейтрали
- ❌ не используй градиент на кнопках, тексте body, границах (только 1 слово в hero)
- ❌ не делай неоново-кислотным — это деловой тёмный, не киберпанк
- ❌ не вставляй emoji в деловые блоки (иконки — inline SVG)
- ❌ не делай резких неоновых ободков и кислотных градиентов
- ❌ не хардкодь hex — только CSS-переменные
- ❌ не используй шрифт без кириллицы и не опускай line-height < 1.5 в тексте
- ❌ без заглушек сплошным цветом вместо картинок (inline SVG / CSS-арт)

---

## 9. Responsive Behavior

| Name | Width | Key changes |
|------|-------|-------------|
| Desktop | ≥ 1024px | сетка 3 кол., hero в 2 строки, padding 96–120px |
| Tablet | 640–1023px | сетка 2 кол., меню сворачивается, кегль на ступень меньше |
| Mobile | < 640px | одна колонка, hero clamp-низ, padding 64–80px, шаги вертикально, бургер-меню |

**Touch Targets**: минимум 44×44px.
**Collapsing**: nav → бургер (Logo + CTA остаются); grid 3→2→1; hero-CTA в столбец; лента логотипов скрывает часть.

```css
@media (max-width: 1023px) { .grid-3 { grid-template-columns: 1fr 1fr; } }
@media (max-width: 639px) {
  .grid-3, .grid-2 { grid-template-columns: 1fr; }
  .hero-ctas { flex-direction: column; align-items: stretch; }
}
```
