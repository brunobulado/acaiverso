import {useState} from 'react';
import {doc,setDoc,updateDoc} from 'firebase/firestore';
import {db} from './firebase';
import {useConfig,useOrders,useToast} from './hooks.jsx';
import {PAGAMENTOS,brl} from './lib';
import {Btn,Card,Col,Tabs} from './OrderCard';
import MenuView from './MenuView';

function Relatorio({orders}){
  const p=orders.filter(o=>o.paid),sum=p.reduce((a,o)=>a+o.total,0);
  const rank=f=>{const c={};p.forEach(o=>f(o).forEach(n=>c[n]=(c[n]||0)+1));return Object.entries(c).sort((a,b)=>b[1]-a[1])};
  const Rk=({t,l})=><div className="card"><h2>{t}</h2>{l.length?l.map(([n,q])=><div className="row" key={n}><span>{n}</span><b>{q}</b></div>):<p className="mu">Sem vendas ainda</p>}</div>;
  return <div className="grid"><div className="card"><h2>Total recebido</h2><div className="big">{brl(sum)}</div>
    <div className="mu">{p.length} pedido(s) pago(s) de {orders.length}</div>
    {PAGAMENTOS.map(m=><div className="row" key={m}><span>{m}</span><b>{brl(p.filter(o=>o.pay===m).reduce((a,o)=>a+o.total,0))}</b></div>)}</div>
    <Rk t="Tamanhos mais vendidos" l={rank(o=>[o.size])}/><Rk t="Complementos mais pedidos" l={rank(o=>o.tops)}/>
    <Rk t="Coberturas" l={rank(o=>o.covs)}/><Rk t="Opcionais pagos" l={rank(o=>o.extras)}/></div>;
}

function Config(){
  const cfg=useConfig(),[toast,show]=useToast();
  const up=e=>{const f=e.target.files[0];if(!f)return;const r=new FileReader();
    r.onload=()=>{const im=new Image();im.onload=async()=>{
      const c=document.createElement('canvas');c.width=c.height=400;const s=Math.min(im.width,im.height);
      c.getContext('2d').drawImage(im,(im.width-s)/2,(im.height-s)/2,s,s,0,0,400,400);
      await setDoc(doc(db,'config','main'),{logo:c.toDataURL('image/jpeg',.85)},{merge:true});show('Logo atualizada!')};im.src=r.result};r.readAsDataURL(f)};
  return <div className="grid">
    <div className="card"><h2>Logo do quiosque</h2><img className="biglogo" src={cfg.logo} alt=""/>
      <input type="file" accept="image/*" onChange={up}/>
      <div className="acts"><button className="btn sm g" onClick={()=>setDoc(doc(db,'config','main'),{logo:'/logo.jpg'},{merge:true})}>Restaurar logo original</button></div></div>
    <div className="card"><h2>Regras</h2><label>Máximo de complementos grátis{' '}
      <input type="number" className="pi" min="1" max="10" defaultValue={cfg.maxTops}
        onBlur={e=>setDoc(doc(db,'config','main'),{maxTops:Math.max(1,parseInt(e.target.value)||4)},{merge:true})}/></label></div>{toast}</div>;
}

export default function Caixa(){
  const orders=useOrders()||[],[tab,setTab]=useState('pedidos'),by=s=>orders.filter(o=>o.status===s);
  const Sel=({o})=><select defaultValue={o.pay} onChange={e=>updateDoc(doc(db,'orders',o.id),{pay:e.target.value})}>{PAGAMENTOS.map(p=><option key={p}>{p}</option>)}</select>;
  return <><Tabs tab={tab} setTab={setTab} tabs={[['pedidos','Pedidos'],['menu','Cardápio'],['rel','Relatório'],['cfg','Configurações']]}/>
    {tab==='pedidos'&&<><div className="grid">
      <Col title="1. Para aceitar" list={by('aguardando')} render={o=><Card key={o.id} o={o}><Btn o={o} to="pagamento">Aceitar</Btn><Btn o={o} to="cancelado" ghost>Cancelar</Btn></Card>}/>
      <Col title="2. Aguardando pagamento" list={by('pagamento')} render={o=><Card key={o.id} o={o}><Sel o={o}/><Btn o={o} to="fila">💰 Confirmar pagamento</Btn><Btn o={o} to="cancelado" ghost>Cancelar</Btn></Card>}/></div>
      <p className="mu">Já liberados para o preparo: {by('fila').length} na fila • {by('preparo').length} preparando • {by('finalizado').length} prontos • {by('entregue').length} entregues.</p></>}
    {tab==='menu'&&<MenuView edit/>}
    {tab==='rel'&&<Relatorio orders={orders}/>}
    {tab==='cfg'&&<Config/>}</>;
}
