(function(){
  var stage=document.getElementById('stage'),face=document.getElementById('face'),body=document.getElementById('body'),
      eL=document.getElementById('eyeL'),eR=document.getElementById('eyeR'),hop=document.getElementById('hop'),
      wig=document.getElementById('wig');
  var tx=0,ty=0,cx=0,cy=0,lastMove=performance.now(),over=false,state='idle',
      blinkAt=performance.now()+2500,blinkT=0,squish=0,px=-1,py=-1;
  function setState(s){
    if(s===state)return; state=s;
    stage.classList.toggle('happy',s==='happy');
    stage.classList.toggle('sleep',s==='sleep');
    if(s==='happy'){
      [hop,wig].forEach(function(e){e.classList.remove('go');void e.offsetWidth;e.classList.add('go')});
      setTimeout(function(){hop.classList.remove('go');wig.classList.remove('go')},1900);
    }
  }
  function move(e){
    var r=stage.getBoundingClientRect(),mx=e.clientX-(r.left+r.width/2),my=e.clientY-(r.top+r.height/2);
    var d=Math.hypot(mx,my)||1,k=Math.min(d/(r.width*.6),1);
    tx=mx/d*k;ty=my/d*k;
    over=d<r.width/2;stage.classList.toggle('hover',over);
    if(Math.abs(e.clientX-px)+Math.abs(e.clientY-py)>2){lastMove=performance.now();if(state!=='idle')setState('idle');}
    px=e.clientX;py=e.clientY;
  }
  addEventListener('pointermove',move);
  addEventListener('pointerdown',function(e){move(e);if(over)squish=1;});
  addEventListener('pointerleave',function(){tx=ty=0;over=false;stage.classList.remove('hover')});
  function frame(t){
    var still=t-lastMove;
    if(state==='idle'&&over&&still>1400)setState('happy');
    else if(state==='idle'&&still>5000)setState('sleep');
    if(state==='happy'&&!over)setState('idle');
    cx+=(tx-cx)*.12;cy+=(ty-cy)*.12;
    var sleepy=state==='sleep';
    var fx=cx*30,fy=cy*22;
    face.style.transform='translate('+fx+'px,'+fy+'px)';
    body.style.transform='translate('+cx*8+'px,'+cy*6+'px)';
    if(t>blinkAt&&!sleepy){blinkT=t;blinkAt=t+2200+Math.random()*3000;}
    var b=1,bp=(t-blinkT)/160;
    if(bp>=0&&bp<1)b=1-Math.sin(bp*Math.PI)*.9;
    var sy=sleepy?.1:(state==='happy'?.45:b);
    var bob=state==='happy'?Math.sin(t/120)*3:0;
    var sx=1+(1-sy)*.12;
    [eL,eR].forEach(function(el){el.style.transform='translateY('+bob+'px) scale('+sx+','+sy+')'});
    squish*=.9;
    var br=sleepy?Math.sin(t/700)*.025:0;
    body.style.transform+=' scale('+(1+squish*.12+br)+','+(1-squish*.14-br)+')';
    requestAnimationFrame(frame);
  }
  requestAnimationFrame(frame);
})();
