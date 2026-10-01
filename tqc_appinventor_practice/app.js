const $ = (id) => document.getElementById(id);
const screens = { start: $('startScreen'), quiz: $('quizScreen'), result: $('resultScreen') };
const letters = ['A','B','C','D'];
let state = {
  range: null,
  queue: [],
  index: 0,
  phase: 'initial',
  initialWrong: [],
  currentRoundWrong: [],
  correctionRound: 0,
  initialCorrect: 0
};

function showScreen(name){
  Object.values(screens).forEach(s=>s.classList.add('hidden'));
  screens[name].classList.remove('hidden');
  $('homeBtn').classList.toggle('hidden', name==='start');
  window.scrollTo({top:0,behavior:'smooth'});
}
function normalize(a){ return [...a].sort().join('|'); }
function currentQuestion(){ return state.queue[state.index]; }
function beginRange(start,end){
  state.range={start,end};
  state.queue=window.QUESTIONS.filter(q=>q.id>=start && q.id<=end);
  state.index=0; state.phase='initial'; state.initialWrong=[]; state.currentRoundWrong=[]; state.correctionRound=0; state.initialCorrect=0;
  showScreen('quiz'); renderQuestion();
}
function renderQuestion(){
  const q=currentQuestion();
  const total=state.queue.length;
  $('phaseBadge').textContent = state.phase==='initial' ? '第一次作答' : `錯題訂正 第 ${state.correctionRound} 輪`;
  $('questionCounter').textContent=`${state.index+1} / ${total}`;
  $('progressBar').style.width=`${((state.index)/total)*100}%`;
  $('questionTitle').textContent=`第 ${q.id} 題`;
  $('multiHint').textContent=q.multiple?'本題可複選':'';
  $('questionImage').src=q.image;
  $('questionImage').alt=`第 ${q.id} 題題目圖片`;
  $('feedback').className='feedback hidden';
  $('feedback').textContent='';
  const type=q.multiple?'checkbox':'radio';
  $('answerArea').innerHTML=letters.map(l=>`<div class="choice"><input id="ans${l}" name="answer" type="${type}" value="${l}"><label for="ans${l}">${l}</label></div>`).join('');
  $('nextBtn').textContent = state.index===total-1 ? (state.phase==='initial'?'交卷':'完成本輪訂正') : '下一題';
  $('nextBtn').disabled=false;
}
function selectedAnswers(){
  return [...document.querySelectorAll('#answerArea input:checked')].map(x=>x.value);
}
function submitCurrent(){
  const selected=selectedAnswers();
  if(!selected.length){ alert('請先選擇答案。'); return; }
  const q=currentQuestion();
  const correct=normalize(selected)===normalize(q.correct);
  if(state.phase==='initial'){
    if(correct) state.initialCorrect++; else state.initialWrong.push(q);
    advance();
  } else {
    if(!correct) state.currentRoundWrong.push(q);
    const fb=$('feedback');
    fb.classList.remove('hidden','ok','bad');
    if(correct){ fb.classList.add('ok'); fb.textContent='✓ 訂正正確'; }
    else { fb.classList.add('bad'); fb.textContent='✗ 這題訂正仍未答對。'; }
    $('nextBtn').disabled=true;
    setTimeout(()=>{ advance(); }, 650);
  }
}
function advance(){
  state.index++;
  if(state.index<state.queue.length){ renderQuestion(); return; }
  if(state.phase==='initial') showInitialResult();
  else finishCorrectionRound();
}
function showInitialResult(){
  const total=35, wrong=state.initialWrong.length, pct=Math.round(state.initialCorrect/total*100);
  showScreen('result');
  $('resultIcon').textContent=wrong?'📊':'🎉';
  $('resultTitle').textContent='第一次作答完成';
  $('scoreBlock').innerHTML=`<div class="score-big">${pct}%</div><div class="score-sub">答對 ${state.initialCorrect} / ${total} 題，答錯 ${wrong} 題</div>`;
  renderWrongList(state.initialWrong,'需要訂正的題目');
  $('correctionBtn').classList.toggle('hidden',wrong===0);
  $('restartBtn').classList.toggle('hidden',wrong!==0);
  if(wrong===0){ $('resultTitle').textContent='全部答對！'; }
}
function startCorrection(){
  state.phase='correction'; state.correctionRound=1; state.queue=[...state.initialWrong]; state.index=0; state.currentRoundWrong=[];
  showScreen('quiz'); renderQuestion();
}
function finishCorrectionRound(){
  const originalWrong=state.initialWrong.length;
  const stillWrong=state.currentRoundWrong.length;
  const corrected=originalWrong-stillWrong;
  const pct=Math.round(state.initialCorrect/35*100);
  showScreen('result');
  $('resultIcon').textContent=stillWrong===0?'✅':'📝';
  $('resultTitle').textContent='錯題訂正完成';
  $('scoreBlock').innerHTML=`<div class="score-big">${corrected} / ${originalWrong}</div><div class="score-sub">錯題訂正答對 ${corrected} 題；第一次正確率 ${pct}%</div>`;
  if(stillWrong===0){
    $('wrongList').innerHTML='<strong>全部錯題都已訂正正確。</strong>';
  }else{
    renderWrongList(state.currentRoundWrong,'訂正後仍答錯的題目');
  }
  $('correctionBtn').classList.add('hidden');
  $('restartBtn').classList.remove('hidden');
}
function renderWrongList(list,title){
  if(!list.length){ $('wrongList').innerHTML='<strong>沒有錯題。</strong>'; return; }
  $('wrongList').innerHTML=`<strong>${title}（${list.length} 題）</strong><div class="wrong-chips">${list.map(q=>`<span class="chip">第 ${q.id} 題</span>`).join('')}</div>`;
}
function restart(){ beginRange(state.range.start,state.range.end); }
function home(){ showScreen('start'); }

document.querySelectorAll('.set-btn').forEach(btn=>btn.addEventListener('click',()=>beginRange(Number(btn.dataset.start),Number(btn.dataset.end))));
$('nextBtn').addEventListener('click',submitCurrent);
$('correctionBtn').addEventListener('click',startCorrection);
$('restartBtn').addEventListener('click',restart);
$('chooseBtn').addEventListener('click',home);
$('homeBtn').addEventListener('click',home);
