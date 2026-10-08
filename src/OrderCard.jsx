import {doc,serverTimestamp,updateDoc} from 'firebase/firestore';
import {db} from './firebase';
import {brl,desc} from './lib';
// Mudar para "fila" = pagamento confirmado: libera o pedido para o Preparo.
export const setStatus=(o,status)=>updateDoc(doc(db,'orders',o.id),{status,...(status==='fila'?{paid:true,paidAt:serverTimestamp()}:{})});
export const Btn=({o,to,ghost,children})=><button className={`btn sm ${ghost?'g':''}`} onClick={()=>setStatus(o,to)}>{children}</button>;
export const Card=({o,children})=><div className="card"><b>#{o.num} {o.name}</b> <span className="tag">{o.turma}</span>
  <div className="mu">{desc(o)}</div><div><b>{brl(o.total)}</b> • {o.pay}</div><div className="acts">{children}</div></div>;
export const Col=({title,list,render})=><div><h2>{title} ({list.length})</h2>{list.length?list.map(render):<p className="mu">Nenhum</p>}</div>;
export const Tabs=({tabs,tab,setTab})=><div className="tabs">{tabs.map(([k,n])=><button key={k} className={`btn sm ${tab===k?'':'g'}`} onClick={()=>setTab(k)}>{n}</button>)}</div>;
