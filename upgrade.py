import os
import re

base_dir = r"d:\Desktop\AstraOS\astraos-dashboard"
html_file = os.path.join(base_dir, "index.html")
css_file = os.path.join(base_dir, "css", "styles.css")
js_file = os.path.join(base_dir, "js", "main.js")

# Modify HTML
with open(html_file, 'r', encoding='utf-8') as f:
    html = f.read()

if '<div class="light-grade"></div>' not in html:
    html = html.replace('<body>', '<body>\n<div class="light-grade"></div>\n<div class="cursor-dot" id="cursorDot"></div>\n<div class="cursor-ring" id="cursorRing"></div>')

with open(html_file, 'w', encoding='utf-8') as f:
    f.write(html)

# Modify CSS
with open(css_file, 'r', encoding='utf-8') as f:
    css = f.read()

css = css.replace('--bg:#070C18;', '--bg:#0B0F19;')

old_body_after = r'''body::after\{
  content:'';position:fixed;
  width:600px;height:600px;
  top:-200px;left:60px;
  background:radial-gradient\(circle,rgba\(6,182,212,0\.05\) 0%,transparent 70%\);
  pointer-events:none;z-index:0;
\}'''
new_body_after = '''body::after{
  content:'';position:fixed;inset:0;
  background:
    radial-gradient(circle at top right, rgba(6,182,212,0.12) 0%, transparent 40%),
    radial-gradient(circle at bottom left, rgba(139,92,246,0.08) 0%, transparent 45%);
  pointer-events:none;z-index:0;
  animation:slowDrift 20s ease-in-out infinite alternate;
}
@keyframes slowDrift {
  0% { transform: scale(1) translate(0, 0); }
  100% { transform: scale(1.05) translate(-20px, 10px); }
}
.light-grade {
  position: fixed; inset: 0; pointer-events: none; z-index: 9998;
  background: radial-gradient(circle at top right, #ffffff, transparent 60%);
  mix-blend-mode: screen; opacity: 0.04;
}
@media (min-width: 768px) {
  body, a, button, input, .card, .task-item, .nav-item, .icon-btn, .user-card, .vault-item { cursor: none !important; }
}
.cursor-dot {
  position: fixed; top: 0; left: 0; width: 6px; height: 6px;
  background: var(--text); border-radius: 50%; pointer-events: none; z-index: 10000;
  will-change: transform; transition: transform 0.1s ease-out;
}
.cursor-ring {
  position: fixed; top: 0; left: 0; width: 28px; height: 28px;
  border: 1px solid rgba(255,255,255,0.4); border-radius: 50%; pointer-events: none; z-index: 9999;
  will-change: transform; transition: transform 0.15s ease-out, border-color 0.15s ease-out, width 0.15s ease-out, height 0.15s ease-out;
}
@media (max-width: 768px) {
  .cursor-dot, .cursor-ring { display: none !important; }
}'''
css = re.sub(old_body_after, new_body_after, css)

old_card = r'''\.card\{
  background:var\(--card\);
  border:1px solid var\(--border\);
  border-radius:14px;
  padding:22px;
  position:relative;overflow:hidden;
  transition:border-color 0\.25s,transform 0\.25s,box-shadow 0\.25s;
  cursor:default;
\}
\.card:hover\{
  border-color:rgba\(255,255,255,0\.1\);
  transform:translateY\(-2px\);
  box-shadow:0 20px 40px rgba\(0,0,0,0\.3\);
\}'''

new_card = '''.card{
  background:var(--card);
  border:1px solid var(--border);
  border-radius:14px;
  padding:22px;
  position:relative;overflow:hidden;
  transition:border-color 0.35s ease,transform 0.35s ease,box-shadow 0.35s ease;
  box-shadow: inset 0 1px 0 0 rgba(255,255,255,0.05), 0 4px 6px -1px rgba(0,0,0,0.1), 0 2px 4px -1px rgba(0,0,0,0.06), 0 0 20px rgba(6,182,212,0.03);
}
.card:hover{
  border-color:rgba(255,255,255,0.1);
  transform:translateY(-4px) scale(1.01);
  box-shadow: inset 0 1px 0 0 rgba(255,255,255,0.08), 0 20px 40px rgba(0,0,0,0.3), 0 0 30px rgba(6,182,212,0.05);
}'''
css = re.sub(old_card, new_card, css)

old_main = r'''\.main\{flex:1;display:flex;flex-direction:column;overflow:hidden;position:relative;z-index:1;\}'''
new_main = '''.main{flex:1;display:flex;flex-direction:column;overflow:hidden;position:relative;z-index:1;
  animation: pageFadeIn 0.4s cubic-bezier(0, 0.55, 0.45, 1) both;
}
@keyframes pageFadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}'''
css = re.sub(old_main, new_main, css)

css = css.replace('width:3px;height:16px;background:var(--accent);border-radius:0 2px 2px 0;',
                  'width:3px;height:16px;background:var(--accent);border-radius:0 2px 2px 0;animation: slideAccent 0.3s cubic-bezier(0.16,1,0.3,1) both;')
css = css.replace('.nav-item.active .nav-icon{opacity:1;}', '.nav-item.active .nav-icon{opacity:1;}\n@keyframes slideAccent { from { transform: translateY(-50%) scaleY(0); } to { transform: translateY(-50%) scaleY(1); } }\n.nav-icon { transition: filter 0.2s, opacity 0.2s; }\n.nav-item:hover .nav-icon { filter: drop-shadow(0 0 5px rgba(255,255,255,0.4)); opacity: 1; }\n.nav-item.active { background: rgba(6,182,212,0.15) !important; filter: brightness(1.1); }')

css = css.replace('.icon-btn{', '.icon-btn{\n  transition: background 0.2s, border-color 0.2s, color 0.2s, transform 0.5s cubic-bezier(0.16,1,0.3,1);\n')
css = re.sub(r'cursor:pointer;transition:all 0\.2s;color:var\(--muted\);position:relative;', 'cursor:pointer;color:var(--muted);position:relative;', css)

css = css.replace('.bar{', '.bar{\n  animation: barGrow 0.6s cubic-bezier(0.16,1,0.3,1) both;\n  transform-origin: bottom; position: relative; overflow: hidden;\n')
css += '''\n@keyframes barGrow { from { transform: scaleY(0); } to { transform: scaleY(1); } }
.bar::after { content: ''; position: absolute; top: 0; left: 0; right: 0; height: 2px; background: rgba(255,255,255,0.4); box-shadow: 0 0 8px rgba(255,255,255,0.6); }'''

css = css.replace('.progress-fill{', '.progress-fill{\n  position: relative; overflow: hidden; animation: fillWidth 1s cubic-bezier(0.16,1,0.3,1) both;\n')
css = css.replace('.show-bar-fill{', '.show-bar-fill{\n  position: relative; overflow: hidden; animation: fillWidth 1s cubic-bezier(0.16,1,0.3,1) both;\n')
css += '''\n@keyframes fillWidth { from { width: 0 !important; } }
.progress-fill::after, .show-bar-fill::after {
  content: ''; position: absolute; top: 0; left: -100%; width: 50%; height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent);
  animation: shimmer 1.5s 1s cubic-bezier(0.16,1,0.3,1) forwards;
}
@keyframes shimmer { to { left: 200%; } }'''

css = css.replace('transition:stroke-dashoffset 1s 1s cubic-bezier(0.16,1,0.3,1);', '')
css += '''\n
.circle-fill {
  stroke-dashoffset: 150.8;
  animation: circleDraw 1.5s 0.2s cubic-bezier(0.16,1,0.3,1) forwards;
}
@keyframes circleDraw { to { stroke-dashoffset: 38; } }
.circle-wrap {
  animation: circleGlow 2s 1.7s cubic-bezier(0.16,1,0.3,1) forwards;
}
@keyframes circleGlow {
  0% { filter: drop-shadow(0 0 0 rgba(245,158,11,0)); }
  50% { filter: drop-shadow(0 0 15px rgba(245,158,11,0.4)); }
  100% { filter: drop-shadow(0 0 5px rgba(245,158,11,0.2)); }
}'''

with open(css_file, 'w', encoding='utf-8') as f:
    f.write(css)

# Modify JS
with open(js_file, 'r', encoding='utf-8') as f:
    js = f.read()

new_js = '''
// Cursor System
const dot = document.getElementById('cursorDot');
const ring = document.getElementById('cursorRing');
let mouseX = window.innerWidth / 2;
let mouseY = window.innerHeight / 2;
let ringX = mouseX;
let ringY = mouseY;
let isHoveringBtn = false;
let isHoveringText = false;
let isClicking = false;

window.addEventListener('mousemove', (e) => {
  mouseX = e.clientX;
  mouseY = e.clientY;
  if(dot) {
    dot.style.transform = `translate(${mouseX - 3}px, ${mouseY - 3}px) scale(${isClicking ? 0.7 : 1})`;
  }
});

window.addEventListener('mousedown', () => { isClicking = true; if(dot) dot.style.transform = `translate(${mouseX - 3}px, ${mouseY - 3}px) scale(0.7)`; });
window.addEventListener('mouseup', () => { isClicking = false; if(dot) dot.style.transform = `translate(${mouseX - 3}px, ${mouseY - 3}px) scale(1)`; });

const renderCursor = () => {
  ringX += (mouseX - ringX) * 0.15;
  ringY += (mouseY - ringY) * 0.15;
  if(ring) {
    let scale = 1;
    if(isHoveringBtn) scale = 1.4;
    else if(isHoveringText) scale = 0.5;
    ring.style.transform = `translate(${ringX - 14}px, ${ringY - 14}px) scale(${scale})`;
  }
  requestAnimationFrame(renderCursor);
};

if(window.innerWidth > 768) {
  requestAnimationFrame(renderCursor);
}

// Hover states detection
document.querySelectorAll('a, button, .icon-btn, .task-item, .nav-item, .user-card, .vault-item, .card').forEach(el => {
  el.addEventListener('mouseenter', () => isHoveringBtn = true);
  el.addEventListener('mouseleave', () => {
    isHoveringBtn = false;
    // Magnetic Reset
    if(el.classList.contains('icon-btn') || el.classList.contains('nav-item')) {
      el.style.transform = 'translate(0px, 0px)';
    }
  });
  
  // Magnetic Effect
  if(el.classList.contains('icon-btn') || el.classList.contains('nav-item')) {
    el.addEventListener('mousemove', (e) => {
      const rect = el.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;
      const dx = Math.max(-4, Math.min(4, x * 0.1));
      const dy = Math.max(-4, Math.min(4, y * 0.1));
      el.style.transform = `translate(${dx}px, ${dy}px)`;
    });
  }
});

// Count up logic
document.querySelectorAll('[data-count]').forEach(el => {
  const target = parseFloat(el.getAttribute('data-count'));
  const duration = 1500; 
  let startTime = null;
  const isFloat = target % 1 !== 0;
  
  const step = (timestamp) => {
    if (!startTime) startTime = timestamp;
    const progress = Math.min((timestamp - startTime) / duration, 1);
    const ease = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
    const current = ease * target;
    
    el.textContent = isFloat ? current.toFixed(1) : Math.floor(current);
    
    if (progress < 1) {
      requestAnimationFrame(step);
    } else {
      el.textContent = target; 
      el.style.textShadow = '0 0 10px rgba(6,182,212,0.5)';
      setTimeout(() => el.style.textShadow = 'none', 500);
    }
  };
  requestAnimationFrame(step);
});

'''

js = js.replace('''setTimeout(() => {
  const c = document.getElementById('energyCircle');
  if (c) { c.style.transition = 'stroke-dashoffset 1s cubic-bezier(0.16,1,0.3,1)'; }
}, 100);''', '')

with open(js_file, 'w', encoding='utf-8') as f:
    f.write(new_js + js)

print("Upgrade applied successfully!")
