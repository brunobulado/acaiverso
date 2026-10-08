import {useEffect,useState} from 'react';
import {collection,doc,onSnapshot,orderBy,query} from 'firebase/firestore';
import {db} from './firebase';
// Tempo real: qualquer mudança no Firestore atualiza as telas sozinha.
export const useMenu=()=>{const[m,setM]=useState(null);
  useEffect(()=>onSnapshot(collection(db,'menu'),s=>setM(s.docs.map(d=>({id:d.id,...d.data()})).sort((a,b)=>a.order-b.order))),[]);return m};
export const useOrders=()=>{const[o,setO]=useState(null);
  useEffect(()=>onSnapshot(query(collection(db,'orders'),orderBy('createdAt')),s=>setO(s.docs.map(d=>({id:d.id,...d.data()})))),[]);return o};
export const useConfig=()=>{const[c,setC]=useState({});
  useEffect(()=>onSnapshot(doc(db,'config','main'),s=>setC(s.data()||{})),[]);
  return{logo:'/logo.jpg',maxTops:4,...c}};
export function useToast(){const[m,setM]=useState('');
  const show=t=>{setM(t);setTimeout(()=>setM(''),2400)};
  return[<div className="toast" style={{opacity:m?1:0}}>{m}</div>,show]}
