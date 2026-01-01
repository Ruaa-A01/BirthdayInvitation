/* Confetti Burst */
(function(){
  function rand(min,max){return Math.random()*(max-min)+min}

  function makeCanvas(){
    const c = document.createElement('canvas');
    c.style.position = 'fixed';
    c.style.left = 0; c.style.top = 0;
    c.style.pointerEvents = 'none';
    c.width = innerWidth; c.height = innerHeight;
    c.className = 'confetti-canvas';
    return c;
  }

  function burstAt(x,y,opts){
    opts = Object.assign({count:80}, opts || {});
    const canvas = makeCanvas();
    const ctx = canvas.getContext('2d');
    document.body.appendChild(canvas);

    const palette = ['#FF9CC7','#FFD36B','#9BD3FF','#B6FFB3','#CBA6FF','#FFB3A7','#FFD2F0'];
    const parts = [];
    for(let i=0;i<opts.count;i++){
      const angle = rand(-Math.PI, Math.PI);
      const speed = rand(2, 12);
      parts.push({
        x, y,
        vx: Math.cos(angle)*speed,
        vy: Math.sin(angle)*speed - rand(2,8),
        size: rand(5,14),
        color: palette[Math.floor(rand(0,palette.length))],
        rot: rand(0,Math.PI*2),
        rotSpeed: rand(-0.2,0.2),
        life: rand(60,140)
      });
    }

    let frame = 0;
    function step(){
      frame++;
      ctx.clearRect(0,0,canvas.width,canvas.height);
      for(let i=parts.length-1;i>=0;i--){
        const p = parts[i];
        p.vy += 0.35; // gravity
        p.vx *= 0.995;
        p.x += p.vx;
        p.y += p.vy;
        p.rot += p.rotSpeed;
        const alpha = Math.max(0, 1 - (frame / p.life));
        ctx.save();
        ctx.globalAlpha = alpha;
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rot);
        ctx.fillStyle = p.color;
        ctx.fillRect(-p.size/2, -p.size/2, p.size, p.size*0.6);
        ctx.restore();
        if(alpha <= 0.02 || p.y > canvas.height + 50) parts.splice(i,1);
      }
      if(parts.length) requestAnimationFrame(step);
      else canvas.remove();
    }
    requestAnimationFrame(step);
  }

  function setup(){
    // Small/Default Burst On Card (If Present)
    const card = document.getElementById('invitation-card');
    if(card){
      card.style.cursor = 'pointer';
      card.addEventListener('click', function(){
        const r = card.getBoundingClientRect();
        burstAt(r.left + r.width/2, r.top + r.height/3, {count: 80});
      });
      card.tabIndex = card.tabIndex || 0;
      card.addEventListener('keydown', function(e){
        if(e.key === 'Enter' || e.key === ' '){ e.preventDefault(); const r = card.getBoundingClientRect(); burstAt(r.left + r.width/2, r.top + r.height/3, {count: 80}); }
      });
    }

    // Large Burst When The Event Image Is Clicked
    const evtImg = document.querySelector('.event-image');
    if(evtImg){
      evtImg.style.cursor = 'pointer';
      evtImg.addEventListener('click', function(e){
        const r = evtImg.getBoundingClientRect();
        burstAt(r.left + r.width/2, r.top + r.height/2, {count: 300});
      });
      evtImg.tabIndex = evtImg.tabIndex || 0;
      evtImg.addEventListener('keydown', function(e){
        if(e.key === 'Enter' || e.key === ' '){ e.preventDefault(); const r = evtImg.getBoundingClientRect(); burstAt(r.left + r.width/2, r.top + r.height/2, {count: 300}); }
      });
    }
  }

  if(document.readyState === 'loading') document.addEventListener('DOMContentLoaded', setup);
  else setup();

})();