import {useEffect,useState} from 'react';
import {onAuthStateChanged,signInWithEmailAndPassword,signOut} from 'firebase/auth';
import {auth} from './firebase';
import Header from './Header';
import {EMAILS} from './lib';
const NOME={caixa:'Caixa',preparo:'Preparo'};

function Login({role}){
  const[senha,setSenha]=useState(''),[erro,setErro]=useState('');
  const entrar=async e=>{e.preventDefault();setErro('');
    try{await signInWithEmailAndPassword(auth,EMAILS[role],senha)}catch{setErro('Senha incorreta.')}};
  return <><Header/><main><form className="card" onSubmit={entrar} style={{maxWidth:400,margin:'0 auto'}}>
    <h2>🔒 Acesso do {NOME[role]}</h2>
    <input type="password" placeholder={`Senha do ${NOME[role]}`} value={senha} onChange={e=>setSenha(e.target.value)} style={{marginBottom:8}}/>
    {erro&&<p style={{color:'var(--pr)'}}>{erro}</p>}
    <button className="btn" style={{width:'100%'}}>Entrar</button></form></main></>;
}

// Cada tela só abre para a conta da própria função (Caixa ou Preparo).
export default function Staff({role,children}){
  const[u,setU]=useState(undefined);
  useEffect(()=>onAuthStateChanged(auth,setU),[]);
  if(u===undefined)return <main><p>Carregando…</p></main>;
  if(!u||u.email!==EMAILS[role])return <Login role={role}/>;
  return <><Header><b>{NOME[role]}</b><button onClick={()=>signOut(auth)}>Sair</button></Header><main>{children}</main></>;
}
