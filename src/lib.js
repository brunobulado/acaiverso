export const ST=['aguardando','pagamento','fila','preparo','finalizado','entregue'];
export const LB={aguardando:'Aguardando aceite',pagamento:'Aguardando pagamento',fila:'Pago • na fila',preparo:'Em preparação',finalizado:'Pronto p/ retirada',entregue:'Entregue',cancelado:'Cancelado'};
export const EM={aguardando:'⏳',pagamento:'💳',fila:'🧾',preparo:'🍇',finalizado:'✅',entregue:'🎉',cancelado:'❌'};
export const MS={aguardando:'Recebemos seu pedido! O caixa vai aceitar já já.',pagamento:'Pedido aceito! Vá ao caixa pagar para liberar o preparo.',fila:'Pagamento confirmado! Seu pedido está na fila de preparo.',preparo:'Estamos montando seu açaí com carinho 🕸️',finalizado:'Está pronto! Retire no quiosque.',entregue:'Pedido finalizado! Obrigado, herói(na)!',cancelado:'Este pedido foi cancelado. Você pode fazer outro.'};
export const PAGAMENTOS=['Pix','Dinheiro','Cartão'];
export const brl=n=>Number(n).toLocaleString('pt-BR',{style:'currency',currency:'BRL'});
export const CAT={sizes:{t:'Tamanhos',paid:true},tops:{t:'Complementos (grátis)'},covs:{t:'Coberturas (grátis)'},extras:{t:'Opcionais pagos',paid:true}};
const s=(cat,l)=>l.map(([name,price=0],order)=>({cat,name,price,active:true,order}));
// Cardápio de exemplo (preços são exemplos: ajuste no painel do Caixa)
export const SEED=[
  ...s('sizes',[['200ml',8],['300ml',11],['400ml',14],['500ml',17],['700ml',22],['Garrafa',25]]),
  ...s('tops',[['Jujuba'],['Leite Ninho'],['Paçoca'],['Amendoim'],['Granola'],['Banana']]),
  ...s('covs',[['Leite condensado'],['Chocolate'],['Morango'],['Caramelo']]),
  ...s('extras',[['Cobertura de creme de avelã',3],['Marshmallow',2]]),
];
export const desc=o=>[o.size,o.tops.join(', '),o.covs[0]&&`cobertura: ${o.covs[0]}`,o.extras.length&&`➕ ${o.extras.join(', ')}`].filter(Boolean).join(' • ');
// Cada função tem uma conta própria no Firebase (só a senha é digitada na tela).
// Se mudar estes e-mails, mude também no arquivo firestore.rules.
export const EMAILS={caixa:'caixa@acaiverso.app',preparo:'preparo@acaiverso.app'};
