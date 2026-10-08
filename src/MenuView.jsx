import {useState} from 'react';
import {addDoc,collection,doc,updateDoc,writeBatch} from 'firebase/firestore';
import {db} from './firebase';
import {useMenu} from './hooks.jsx';
import {CAT,SEED,brl} from './lib';

function Add({cat,paid}){
  const[n,setN]=useState(''),[p,setP]=useState('');
  const add=async()=>{if(!n.trim())return;
    await addDoc(collection(db,'menu'),{cat,name:n.trim(),price:paid?parseFloat(p.replace(',','.'))||0:0,active:true,order:Date.now()});setN('');setP('')};
  return <div className="add"><input type="text" placeholder="Novo item" value={n} onChange={e=>setN(e.target.value)}/>
    {paid&&<input type="number" step="0.5" placeholder="R$" value={p} onChange={e=>setP(e.target.value)} style={{width:80}}/>}
    <button className="btn sm" onClick={add}>+</button></div>;
}
async function seed(){const b=writeBatch(db);SEED.forEach(x=>b.set(doc(collection(db,'menu')),x));await b.commit()}

// edit=true (Caixa): cadastra, muda preço, inativa. edit=false (Preparo): só ativa/inativa.
export default function MenuView({edit}){
  const menu=useMenu();
  if(!menu)return <p>Carregando…</p>;
  if(!menu.length)return edit?<button className="btn" onClick={seed}>Carregar cardápio de exemplo</button>:<p className="mu">Cardápio vazio.</p>;
  return <div className="grid">{Object.entries(CAT).map(([k,c])=><div className="card" key={k}><h2>{c.t}</h2>
    {menu.filter(x=>x.cat===k).map(x=><div className="row" key={x.id}>
      <span className={x.active?'':'mu'}>{x.name}{c.paid&&!edit&&` • ${brl(x.price)}`}</span>
      <span>{edit&&c.paid&&<>R$ <input type="number" className="pi" step="0.5" defaultValue={x.price}
          onBlur={e=>updateDoc(doc(db,'menu',x.id),{price:Math.max(0,parseFloat(e.target.value)||0)})}/> </>}
        <button className={`btn sm ${x.active?'g':''}`} onClick={()=>updateDoc(doc(db,'menu',x.id),{active:!x.active})}>{x.active?'Inativar':'Ativar'}</button></span>
    </div>)}
    {edit&&<Add cat={k} paid={c.paid}/>}</div>)}</div>;
}
