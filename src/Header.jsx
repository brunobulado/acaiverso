import {useConfig} from './hooks.jsx';
export default function Header({children}){
  const {logo}=useConfig();
  return <header>
    <div className="brand"><img className="logo" src={logo} alt="Açaí verso"/>
      <div><h1>Açaí verso</h1><div className="tag2">Seu açaí com superpoderes 🕷️</div></div></div>
    <div className="sw">{children}</div>
  </header>;
}
