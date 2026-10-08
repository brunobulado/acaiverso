import {useEffect,useState} from 'react';
import {addDoc,collection,doc,onSnapshot,runTransaction,serverTimestamp} from 'firebase/firestore';
import {db} from './firebase';
import Header from './Header';
import {useConfig,useMenu,useToast} from './hooks.jsx';
import {EM,LB,MS,ST,PAGAMENTOS,brl,desc} from './lib';
const KEY='acaiverso:pedido';
const blank=()=>({size:null,tops:[],cov:null,extras:[],name:'',turma:'',pay:'Pix'});

function Chips({items,isOn,onPick,price=0}){
  return <div className="opts">{items.map(x=>
    <div key={x.id} className={`opt ${isOn(x.id)?'on':''} ${x.active?'':'off'}`} onClick={()=>onPick(x.id)}>
      {x.name}{price>0&&x.price>0&&<span className="mu"> {price===2?'+':''}{brl(x.price)}</span>}{!x.active&&' (esgotado)'}
    </div>)}</div>;
}

export default function Cliente(){
  const menu=useMenu(),cfg=useConfig(),[toast,show]=useToast();
  const [cart,setCart]=useState(blank),[id,setId]=useState(()=>localStorage.getItem(KEY)),[order,setOrder]=useState(null);
  useEffect(()=>{ if(!id){setOrder(null);return}
    return onSnapshot(doc(db,'orders',id),s=>setOrder(s.exists()?{id:s.id,...s.data()}:null)); },[id]);
  const novo=()=>{localStorage.removeItem(KEY);setId(null);setCart(blank())};
  useEffect(()=>{ if(order?.status==='entregue'){const t=setTimeout(novo,5000);return()=>clearTimeout(t)} },[order?.status]);

  if(order){
    const fin=order.status==='cancelado';
    return <><Header/><main>
      <div className="card hero"><div className="em">{EM[order.status]}</div>
        <h2 style={{justifyContent:'center'}}>Pedido #{order.num} — {order.name} ({order.turma})</h2>
        <p className="st">{LB[order.status]}</p><p>{MS[order.status]}</p>
        {fin?<button className="btn" style={{background:'#fff',color:'var(--pr)'}} onClick={novo}>Fazer novo pedido</button>
          :<div className="steps">{ST.map((s,i)=><div key={s} className={i<=ST.indexOf(order.status)?'on':''}>{EM[s]}<br/>{LB[s]}</div>)}</div>}
      </div>
      <div className="card"><b>Seu pedido</b><p>{desc(order)}</p>
        <p><b>{brl(order.total)}</b> — pagamento previsto: {order.pay} <span className="mu">(feito no caixa)</span></p>
        <p className="mu">{order.status==='entregue'?'Voltando ao início para um novo pedido…':'Esta tela atualiza sozinha.'}</p></div>
    </main>{toast}</>;
  }
  if(!menu)return <><Header/><main><p>Carregando cardápio…</p></main></>;

  const by=c=>menu.filter(m=>m.cat===c),get=i=>menu.find(m=>m.id===i);
  const set=p=>setCart(c=>({...c,...p}));
  const total=(get(cart.size)?.price||0)+cart.extras.reduce((a,i)=>a+(get(i)?.price||0),0);
  const toggle=(k,i,max)=>{const a=cart[k];
    if(a.includes(i))set({[k]:a.filter(x=>x!==i)});
    else if(max&&a.length>=max)show(`Máximo de ${max} complementos 🕸️`);
    else set({[k]:[...a,i]})};

  async function enviar(){
    if(!cart.name.trim()||!cart.turma.trim()||!cart.size)return show('Preencha nome, turma e escolha o tamanho');
    const names=ids=>ids.map(i=>get(i).name);
    try{
      const num=await runTransaction(db,async tx=>{const r=doc(db,'counters','orders'),s=await tx.get(r),n=(s.exists()?s.data().n:0)+1;tx.set(r,{n});return n});
      const ref=await addDoc(collection(db,'orders'),{num,name:cart.name.trim(),turma:cart.turma.trim(),size:get(cart.size).name,
        tops:names(cart.tops),covs:cart.cov?names([cart.cov]):[],extras:names(cart.extras),total,pay:cart.pay,paid:false,status:'aguardando',createdAt:serverTimestamp()});
      localStorage.setItem(KEY,ref.id);setId(ref.id);
    }catch(e){console.error(e);show('Não foi possível enviar. Tente de novo.')}
  }

  return <><Header/><main>
    <div className="welcome"><img className="biglogo" src={cfg.logo} alt="Açaí verso"/>🕸️ <b>Monte seu açaí em 5 passos</b> e a gente avisa quando estiver pronto!</div>
    <div className="card"><h2><span className="n">1</span>Quem é você?</h2><div className="grid">
      <input type="text" placeholder="Seu nome" value={cart.name} onChange={e=>set({name:e.target.value})}/>
      <input type="text" placeholder="Turma (ex: 1ºA)" value={cart.turma} onChange={e=>set({turma:e.target.value})}/></div></div>
    <div className="card"><h2><span className="n">2</span>Escolha o tamanho</h2>
      <Chips items={by('sizes')} isOn={i=>cart.size===i} onPick={i=>set({size:i})} price={1}/></div>
    <div className="card"><h2><span className="n">3</span>Complementos <span className="cnt">{cart.tops.length}/{cfg.maxTops} grátis</span></h2>
      <Chips items={by('tops')} isOn={i=>cart.tops.includes(i)} onPick={i=>toggle('tops',i,cfg.maxTops)}/>
      <h2 style={{marginTop:14}}>Cobertura <span className="cnt">escolha 1 • grátis</span></h2>
      <Chips items={by('covs')} isOn={i=>cart.cov===i} onPick={i=>set({cov:cart.cov===i?null:i})}/></div>
    <div className="card"><h2><span className="n">4</span>Turbine seu açaí <span className="cnt">opcional • pago à parte</span></h2>
      <Chips items={by('extras')} isOn={i=>cart.extras.includes(i)} onPick={i=>toggle('extras',i)} price={2}/></div>
    <div className="card"><h2><span className="n">5</span>Como vai pagar? <span className="cnt">no caixa</span></h2>
      <div className="opts">{PAGAMENTOS.map(p=><div key={p} className={`opt ${cart.pay===p?'on':''}`} onClick={()=>set({pay:p})}>{p}</div>)}</div></div>
    <div className="bar"><div><span style={{opacity:.7,fontSize:13}}>Total</span><br/><b>{brl(total)}</b></div>
      <button className="btn" onClick={enviar}>Enviar pedido 🕷️</button></div>
    {toast}
  </main></>;
}
