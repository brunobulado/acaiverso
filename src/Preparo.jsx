import {useState} from 'react';
import {useOrders} from './hooks.jsx';
import {Btn,Card,Col,Tabs} from './OrderCard';
import MenuView from './MenuView';
export default function Preparo(){
  const orders=useOrders()||[],[tab,setTab]=useState('fila'),by=s=>orders.filter(o=>o.status===s);
  return <><Tabs tab={tab} setTab={setTab} tabs={[['fila','Fila de preparo'],['estoque','Estoque (esgotou?)']]}/>
    {tab==='estoque'?<><p className="mu">Inative o que acabou: some na hora para o cliente.</p><MenuView/></>
    :<div className="grid">
      <Col title="Na fila (já pagos)" list={by('fila')} render={o=><Card key={o.id} o={o}><Btn o={o} to="preparo">🍇 Iniciar preparo</Btn></Card>}/>
      <Col title="Em preparação" list={by('preparo')} render={o=><Card key={o.id} o={o}><Btn o={o} to="finalizado">✅ Marcar pronto</Btn></Card>}/>
      <Col title="Prontos" list={by('finalizado')} render={o=><Card key={o.id} o={o}><Btn o={o} to="entregue">🎉 Entregar ao cliente</Btn></Card>}/></div>}</>;
}
