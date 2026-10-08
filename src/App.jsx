import {Navigate,Route,Routes} from 'react-router-dom';
import Cliente from './Cliente';
import Staff from './Staff';
import Caixa from './Caixa';
import Preparo from './Preparo';
export default function App(){
  return <Routes>
    <Route path="/" element={<Cliente/>}/>
    <Route path="/caixa" element={<Staff role="caixa"><Caixa/></Staff>}/>
    <Route path="/preparo" element={<Staff role="preparo"><Preparo/></Staff>}/>
    <Route path="*" element={<Navigate to="/"/>}/>
  </Routes>;
}
