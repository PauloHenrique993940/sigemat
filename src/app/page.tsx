"use client";

import { Archive, BarChart3, Bell, CalendarClock, CheckCircle2, CircleHelp, ClipboardList, FileText, History, LayoutDashboard, LockKeyhole, LogOut, MapPinned, MapPin, Plus, Search, Truck, Users, X } from "lucide-react";
import { useEffect, useState } from "react";

type Cicom = { id: number; name: string; code: string; region: string; city: string; note: string; scheduleStart: string };
type Pickup = { id: number; cicomId: number; date: string; attendant: string; type: string; note: string; completed: boolean };
const cicomsBase: Cicom[] = [
  { id: 1, name: "CICOM Alagoinhas", code: "CICOM-ALG", region: "Leste", city: "Alagoinhas", note: "Faltando papel bobina, multiuso e desinfetante.", scheduleStart: "2026-01-15" },
  { id: 2, name: "CICOM Barreiras", code: "CICOM-BAR", region: "Oeste", city: "Barreiras", note: "Faltou esponja de aço.", scheduleStart: "2026-03-12" },
  { id: 3, name: "CICOM Euclides da Cunha", code: "CICOM-EUC", region: "Nordeste", city: "Euclides da Cunha", note: "Retirou apenas o que solicitou; verificar na pasta.", scheduleStart: "2026-01-19" },
  { id: 4, name: "CICOM Feira de Santana", code: "CICOM-FSA", region: "Leste", city: "Feira de Santana", note: "Solicitações pelos anexos VII e VIII.", scheduleStart: "2026-01-22" },
  { id: 5, name: "CICOM Guanambi", code: "CICOM-GUA", region: "Sudoeste", city: "Guanambi", note: "Faltou desinfetante, esponja de aço, pano de prato e saco de lixo.", scheduleStart: "2026-02-20" },
];
const pickupsBase: Pickup[] = [
  { id: 1, cicomId: 1, date: "15/01/2026", attendant: "Carvalho", type: "Material trimestral", note: "Material trimestral.", completed: true }, { id: 2, cicomId: 1, date: "05/05/2026", attendant: "Iracema", type: "Retirada completa", note: "Retirada completa.", completed: true }, { id: 3, cicomId: 1, date: "19/08/2026", attendant: "Paulo X Daniel", type: "Retirada incompleta", note: "Falta papel higiênico.", completed: false },
  { id: 4, cicomId: 2, date: "12/03/2026", attendant: "Leandro", type: "Retirada incompleta", note: "Faltou esponja de aço.", completed: false }, { id: 5, cicomId: 2, date: "16/08/2026", attendant: "Leandro", type: "Retirada completa", note: "Retirada completa.", completed: true },
  { id: 6, cicomId: 3, date: "19/01/2026", attendant: "", type: "Material trimestral", note: "Retirou apenas o que solicitou.", completed: true }, { id: 7, cicomId: 3, date: "10/04/2026", attendant: "", type: "Material trimestral", note: "Material trimestral.", completed: true }, { id: 8, cicomId: 3, date: "06/05/2026", attendant: "", type: "Material trimestral", note: "Material trimestral.", completed: true },
  { id: 9, cicomId: 4, date: "22/01/2026", attendant: "Carvalho", type: "Material de limpeza e escritório", note: "Solicitado pelo anexo VII.", completed: true }, { id: 10, cicomId: 4, date: "06/03/2026", attendant: "Leandro", type: "Enviado na viagem", note: "Enviado na viagem, inventário.", completed: true }, { id: 11, cicomId: 4, date: "19/06/2026", attendant: "Leandro", type: "Retirada incompleta", note: "Pendência em acompanhamento.", completed: false },
  { id: 12, cicomId: 5, date: "20/02/2026", attendant: "Jailton", type: "Enviado na viagem", note: "Enviado na viagem, inventário.", completed: true }, { id: 13, cicomId: 5, date: "10/05/2026", attendant: "Jailton", type: "Envio completo", note: "Envio completo.", completed: true },
];
const nav = [["painel", LayoutDashboard, "Visão geral"], ["cicoms", Users, "CICOMs"], ["retiradas", Truck, "Retiradas"], ["pendencias", ClipboardList, "Pendências"], ["relatorios", BarChart3, "Relatórios"], ["auditoria", History, "Auditoria"]] as const;
type View = (typeof nav)[number][0] | "detalhe";

export default function Home() {
  useEffect(() => {
    const attachMapControl = () => {
      const cicomTable = [...document.querySelectorAll("table")].find((table) => table.querySelector("thead")?.textContent?.includes("PRÓXIMA PREVISTA"));
      cicomTable?.querySelectorAll("tbody tr").forEach((row) => {
        if (row.querySelector(".row-map-control")) return;
        const city = row.querySelector("td span")?.textContent?.trim();
        if (!city) return;
        const cell = document.createElement("td");
        const button = document.createElement("button");
        button.className = "row-map-control";
        button.type = "button";
        button.textContent = "Ver no mapa";
        button.title = `Abrir ${city}, Bahia no mapa`;
        button.onclick = () => window.open(`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${city}, Bahia`)}`, "_blank", "noopener,noreferrer");
        cell.append(button);
        row.append(cell);
      });
      const title = [...document.querySelectorAll("main:has(aside) h1")].find((element) => element.textContent?.startsWith("CICOM "));
      if (!title || title.parentElement?.querySelector(".map-control")) return;
      const city = title.nextElementSibling?.textContent?.split(" · ")[1]?.trim();
      if (!city) return;
      const button = document.createElement("button");
      button.className = "map-control";
      button.type = "button";
      button.textContent = "Ver no mapa";
      button.onclick = () => window.open(`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${city}, Bahia`)}`, "_blank", "noopener,noreferrer");
      title.parentElement?.append(button);
    };
    const observer = new MutationObserver(attachMapControl);
    observer.observe(document.body, { childList: true, subtree: true });
    attachMapControl();
    return () => observer.disconnect();
  }, []);
  useEffect(() => {
    const button = document.createElement("button");
    button.className = "logout-control";
    button.type = "button";
    button.setAttribute("aria-label", "Sair do sistema");
    button.textContent = "Sair do sistema";
    button.onclick = () => window.location.reload();
    document.body.append(button);
    return () => button.remove();
  }, []);
  useEffect(() => {
    const toolbar = document.createElement("div");
    toolbar.className = "quick-toolbox";
    const openPage = (title: string, subtitle: string, body: string) => {
      document.querySelector(".quick-page")?.remove();
      const page = document.createElement("section");
      page.className = "quick-page";
      page.innerHTML = `<div class="quick-page-content"><button class="quick-page-close" type="button" aria-label="Fechar">Fechar</button><p class="quick-page-kicker">CENTRAL OPERACIONAL</p><h2>${title}</h2><p class="quick-page-subtitle">${subtitle}</p><div class="quick-page-body">${body}</div></div>`;
      page.querySelector(".quick-page-close")?.addEventListener("click", () => page.remove());
      document.body.append(page);
    };
    const actions = [
      { label: "Avisos", title: "Ver pendências", run: () => openPage("Avisos e pendências", "Retiradas que exigem acompanhamento da equipe.", "<article><strong>Alagoinhas</strong><span>Retirada incompleta: falta papel higiênico.</span></article><article><strong>Barreiras</strong><span>Retirada incompleta: falta esponja de aço.</span></article><article><strong>Feira de Santana</strong><span>Entrega com pendência em acompanhamento.</span></article>") },
      { label: "Ajuda", title: "Ver orientações do sistema", run: () => openPage("Ajuda operacional", "Fluxo de controle das retiradas dos CICOMs.", "<article><strong>1. Cadastre o CICOM</strong><span>Informe unidade, código, município, região e primeira retirada prevista.</span></article><article><strong>2. Agenda trimestral</strong><span>O quadro calcula automaticamente as próximas retiradas de 3 em 3 meses.</span></article><article><strong>3. Registre a retirada</strong><span>Informe data, atendente, tipo e observação. O histórico é ilimitado.</span></article>") },
    ];
    actions.forEach((action) => { const button = document.createElement("button"); button.type = "button"; button.title = action.title; button.setAttribute("aria-label", action.title); button.textContent = action.label; button.onclick = action.run; toolbar.append(button); });
    document.body.append(toolbar);
    return () => toolbar.remove();
  }, []);
  const signOut = () => setSignedIn(false);
  const [signedIn, setSignedIn] = useState(false); const [view, setView] = useState<View>("painel"); const [cicoms, setCicoms] = useState(cicomsBase); const [pickups, setPickups] = useState(pickupsBase); const [selected, setSelected] = useState<number | null>(null); const [modal, setModal] = useState<"cicom" | "retirada" | null>(null); const [search, setSearch] = useState(""); const [notificationsOpen, setNotificationsOpen] = useState(false);
  const showCicom = (id: number) => { setSelected(id); setView("detalhe"); };
  const save = (form: FormData) => { if (modal === "cicom") { const created = { id: Date.now(), name: String(form.get("name")), code: String(form.get("code")), region: String(form.get("region")), city: String(form.get("city")), note: String(form.get("note")), scheduleStart: String(form.get("scheduleStart")) }; setCicoms((all) => [...all, created]); setSelected(created.id); setView("detalhe"); } else { const cicomId = Number(form.get("cicomId")); setPickups((all) => [...all, { id: Date.now(), cicomId, date: String(form.get("date")).split("-").reverse().join("/"), attendant: String(form.get("attendant")), type: String(form.get("type")), note: String(form.get("note")), completed: form.get("completed") === "on" }]); setSelected(cicomId); setView("detalhe"); } setModal(null); };
  useEffect(() => {
    if (!signedIn || !["cicoms", "retiradas"].includes(view)) return;
    const isCicomList = view === "cicoms";
    document.querySelectorAll(".record-actions").forEach((element) => element.remove());
    document.querySelectorAll("table tbody tr").forEach((row) => {
      const cells = row.querySelectorAll("td");
      const match = isCicomList
        ? cicoms.find((cicom) => cicom.name === cells[0]?.textContent?.trim().split("\n")[0])
        : pickups.find((pickup) => cicoms.find((cicom) => cicom.id === pickup.cicomId)?.name === cells[1]?.textContent?.trim());
      if (!match) return;
      const actions = document.createElement("td");
      actions.className = "record-actions";
      const edit = document.createElement("button");
      edit.type = "button";
      edit.textContent = "Editar";
      edit.className = "record-edit";
      edit.onclick = () => {
        if (isCicomList) {
          const cicom = match as Cicom;
          const name = window.prompt("Nome do CICOM", cicom.name);
          const city = window.prompt("Município", cicom.city);
          const note = window.prompt("Observação", cicom.note);
          if (name?.trim() && city?.trim()) setCicoms((all) => all.map((item) => item.id === cicom.id ? { ...item, name: name.trim(), city: city.trim(), note: note?.trim() ?? item.note } : item));
        } else {
          const pickup = match as Pickup;
          const type = window.prompt("Tipo de retirada", pickup.type);
          const note = window.prompt("Observação", pickup.note);
          if (type?.trim()) setPickups((all) => all.map((item) => item.id === pickup.id ? { ...item, type: type.trim(), note: note?.trim() ?? item.note } : item));
        }
      };
      const remove = document.createElement("button");
      remove.type = "button";
      remove.textContent = "Apagar";
      remove.className = "record-delete";
      remove.onclick = () => {
        if (isCicomList) {
          const cicom = match as Cicom;
          if (!window.confirm(`Apagar ${cicom.name} e todo o histórico de retiradas?`)) return;
          setCicoms((all) => all.filter((item) => item.id !== cicom.id));
          setPickups((all) => all.filter((item) => item.cicomId !== cicom.id));
        } else {
          const pickup = match as Pickup;
          if (window.confirm("Apagar esta retirada?")) setPickups((all) => all.filter((item) => item.id !== pickup.id));
        }
      };
      actions.append(edit, remove);
      row.append(actions);
    });
  }, [signedIn, view, cicoms, pickups]);
  if (!signedIn) return <Login enter={() => setSignedIn(true)}/>;
  const pending = pickups.filter((p) => !p.completed); const selectedCicom = cicoms.find((c) => c.id === selected); const queryMatch = (text:string) => text.toLowerCase().includes(search.toLowerCase());
  return <main className="min-h-screen bg-[#f3f7fa] text-[#132630]"><aside className="sidebar !translate-x-0"><div className="flex gap-3 px-5 py-7"><div className="grid h-11 w-11 place-items-center rounded-lg bg-[#075985] text-white"><Archive size={21}/></div><div><strong className="block text-sm leading-5">Sistema Integrado de<br/>Gestão de Materiais</strong><span className="text-[10px] font-bold tracking-[.12em] text-[#37647d]">CICOMS · BAHIA</span></div></div><nav className="px-3">{nav.map(([id,Icon,label]) => <button key={id} onClick={() => {setView(id);setSearch("")}} className={`nav-item ${view===id?"nav-active":""}`}><Icon size={18}/>{label}{id === "pendencias" && <b>{pending.length}</b>}</button>)}</nav><div className="mt-auto m-3 rounded-lg bg-[#e0f2fe] p-4"><p className="text-xs font-bold text-[#075985]">Agenda trimestral</p><p className="mt-1 text-xs leading-5 text-[#37647d]">Novos CICOMs recebem agenda automática a cada 3 meses.</p></div></aside><section className="pl-[248px]"><header className="flex h-[72px] items-center border-b border-[#dce8ee] bg-white px-8"><div className="relative w-full max-w-md"><Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[#8498a4]" size={17}/><input value={search} onChange={(e)=>setSearch(e.target.value)} className="h-10 w-full rounded-md border border-[#cedfe8] bg-[#f8fbfd] pl-10 text-sm outline-none" placeholder="Buscar CICOM, atendente ou observação"/></div><Bell className="ml-auto mr-5 text-[#527080]" size={20}/><button onClick={()=>setModal("retirada")} className="primary-button inline-flex items-center gap-2"><Plus size={17}/>Registrar retirada</button></header><div className="mx-auto max-w-[1440px] px-8 py-8">{view === "painel" && <Dashboard cicoms={cicoms} pickups={pickups} open={()=>setModal("retirada")} detail={showCicom}/>} {view === "cicoms" && <CicomList rows={cicoms.filter((c)=>queryMatch(`${c.name} ${c.code} ${c.city}`))} pickups={pickups} create={()=>setModal("cicom")} open={showCicom}/>} {view === "detalhe" && selectedCicom && <CicomDetail cicom={selectedCicom} pickups={pickups.filter((p)=>p.cicomId===selectedCicom.id)} back={()=>setView("cicoms")} add={()=>setModal("retirada")}/>} {view === "retiradas" && <PickupList rows={pickups.filter((p)=>queryMatch(`${cicoms.find((c)=>c.id===p.cicomId)?.name} ${p.attendant} ${p.note}`))} cicoms={cicoms} open={showCicom}/>} {view === "pendencias" && <Pending rows={pending} cicoms={cicoms} open={showCicom}/>} {view === "relatorios" && <Reports pickups={pickups} cicoms={cicoms}/>} {view === "auditoria" && <Audit rows={pickups}/>}</div></section>{modal && <Modal kind={modal} cicoms={cicoms} close={()=>setModal(null)} save={save}/>}</main>;
}
function Login({enter}:{enter:()=>void}) { return <main className="min-h-screen bg-[#e8f1f6] p-5"><div className="mx-auto mt-[8vh] max-w-[520px] border-l-4 border-[#075985] p-10"><p className="text-xs font-extrabold tracking-[.13em] text-[#075985]">ACESSO RESTRITO</p><h1 className="mt-3 text-3xl font-extrabold text-[#062b45]">NÚCLEO DE MATERIAL E PATRIMÔNIO</h1><p className="mt-3 text-sm leading-6 text-[#395a70]">Use suas credenciais institucionais para acessar a logística dos CICOMs.</p><form className="mt-8 space-y-5" onSubmit={(e)=>{e.preventDefault();enter()}}><label className="form-label">E-mail institucional<input type="email" required placeholder="nome@ssp.ba.gov.br"/></label><label className="form-label">Senha<input type="password" required placeholder="Digite sua senha"/></label><button className="primary-button flex w-full items-center justify-center gap-2 py-3"><LockKeyhole size={17}/>Acessar ambiente</button></form><p className="mt-8 text-center text-xs leading-5 text-[#476579]">Acesso autorizado apenas para servidores do Núcleo de Material e Patrimônio do Estado da Bahia.</p></div></main> }
function Dashboard({cicoms,pickups,open,detail}:{cicoms:Cicom[];pickups:Pickup[];open:()=>void;detail:(id:number)=>void}) { const hour = new Date().getHours(); const greet=hour<12?"Bom dia":hour<18?"Boa tarde":"Boa noite"; return <><p className="text-sm text-[#587585]">Controle de retiradas e programação trimestral</p><h1 className="mt-1 text-3xl font-extrabold">{greet}, Paulo.</h1><div className="mt-7 grid gap-4 md:grid-cols-4"><Metric value={String(cicoms.length)} label="CICOMs cadastrados" icon={<Users/>}/><Metric value={String(pickups.length)} label="Retiradas registradas" icon={<Truck/>}/><Metric value={String(pickups.filter(p=>p.completed).length)} label="Entregas concluídas" icon={<CheckCircle2/>}/><Metric value={String(pickups.filter(p=>!p.completed).length)} label="Pendências abertas" icon={<ClipboardList/>}/></div><section className="panel mt-6 overflow-hidden"><div className="flex items-center justify-between p-6"><div><h2 className="font-bold">Últimas movimentações</h2><p className="mt-1 text-sm text-[#718079]">Retiradas registradas no sistema</p></div><button onClick={open} className="text-sm font-bold text-[#075985]">Nova retirada</button></div><PickupTable rows={[...pickups].slice(-5).reverse()} cicoms={cicoms} open={detail}/></section></> }
function Metric({value,label,icon}:{value:string;label:string;icon:React.ReactNode}) { return <section className="panel metric-card"><div className="metric-icon icon-green">{icon}</div><div><p className="text-3xl font-extrabold">{value}</p><p className="mt-1 text-sm font-semibold text-[#536d7b]">{label}</p></div></section> }
function CicomList({rows,pickups,create,open}:{rows:Cicom[];pickups:Pickup[];create:()=>void;open:(id:number)=>void}) { return <><Head title="CICOMs" text="Cadastre unidades e acompanhe automaticamente sua agenda trimestral." action="Cadastrar CICOM" click={create}/><section className="panel mt-7 overflow-hidden"><table><thead><tr><th>CICOM</th><th>CÓDIGO</th><th>REGIÃO</th><th>RETIRADAS</th><th>PRÓXIMA PREVISTA</th><th/></tr></thead><tbody>{rows.map(c=>{const amount=pickups.filter(p=>p.cicomId===c.id).length; return <tr key={c.id}><td className="font-bold">{c.name}<span className="block pt-1 text-xs font-normal text-[#718079]"><MapPin className="mr-1 inline" size={12}/>{c.city}</span></td><td className="font-semibold text-[#075985]">{c.code}</td><td>{c.region}</td><td>{amount}</td><td className="font-semibold text-[#075985]">{formatDate(schedule(c.scheduleStart,amount))}</td><td><button onClick={()=>open(c.id)} className="text-sm font-bold text-[#075985]">Abrir painel</button></td></tr>})}</tbody></table></section></> }
function CicomDetail({cicom,pickups,back,add}:{cicom:Cicom;pickups:Pickup[];back:()=>void;add:()=>void}) { const ordered=[...pickups].sort((a,b)=>dateNum(a.date)-dateNum(b.date)); return <><button onClick={back} className="text-sm font-bold text-[#075985]">← Voltar para CICOMs</button><div className="mt-4 flex items-end justify-between"><div><p className="text-xs font-bold tracking-[.12em] text-[#075985]">HISTÓRICO E AGENDA DO CICOM</p><h1 className="mt-1 text-3xl font-extrabold">{cicom.name}</h1><p className="mt-2 text-sm text-[#607985]">{cicom.code} · {cicom.city} · Agenda trimestral ativa</p></div><button onClick={add} className="primary-button inline-flex items-center gap-2"><Plus size={17}/>Nova retirada</button></div><section className="panel mt-7 overflow-hidden"><div className="flex items-center gap-3 border-b border-[#e2ebf0] px-6 py-5"><CalendarClock className="text-[#075985]" size={21}/><div><h2 className="font-bold">Quadro de retiradas</h2><p className="mt-1 text-sm text-[#718079]">A programação é automática de 3 em 3 meses. As quatro primeiras posições ficam em destaque.</p></div></div><div className="grid grid-cols-4 divide-x divide-[#e2ebf0]">{[0,1,2,3].map(index=>{const row=ordered[index]; const planned=formatDate(schedule(cicom.scheduleStart,index)); return <div className={`min-h-48 p-5 ${row?"":"scheduled-card"}`} key={index}><p className="text-xs font-extrabold tracking-[.1em] text-[#075985]">{index+1}ª RETIRADA</p>{row?<><p className="mt-5 text-sm font-bold">{row.date}</p><p className="mt-2 text-sm text-[#587585]">{row.type}</p><span className={`mt-4 status ${row.completed?"status-success":"status-warning"}`}>{row.completed?"Completa":"Incompleta"}</span></>:<><span className="planned-badge mt-5">PROGRAMADA</span><p className="mt-3 text-sm font-bold text-[#075985]">{planned}</p><p className="mt-2 text-sm text-[#587585]">Retirada trimestral prevista</p></>}</div>})}</div></section><section className="panel mt-6 overflow-hidden"><div className="p-6"><h2 className="font-bold">Histórico completo</h2><p className="mt-1 text-sm text-[#718079]">{ordered.length} retirada(s). A programação segue ativa após a 4ª retirada.</p></div><table><thead><tr><th>CLASSIFICAÇÃO</th><th>DATA</th><th>ATENDENTE</th><th>TIPO</th><th>OBSERVAÇÃO</th><th>STATUS</th></tr></thead><tbody>{ordered.map((p,i)=><tr key={p.id}><td className="font-bold text-[#075985]">{i+1}ª retirada</td><td>{p.date}</td><td>{p.attendant||"Não informado"}</td><td>{p.type}</td><td className="text-[#607985]">{p.note}</td><td><span className={`status ${p.completed?"status-success":"status-warning"}`}>{p.completed?"Completa":"Incompleta"}</span></td></tr>)}</tbody></table></section><section className="panel mt-6 border-l-4 border-l-[#f59e0b] p-5"><p className="text-xs font-bold tracking-[.1em] text-[#a96318]">OBSERVAÇÃO ATUAL</p><p className="mt-2 text-sm text-[#4c626e]">{cicom.note}</p></section></> }
function PickupList({rows,cicoms,open}:{rows:Pickup[];cicoms:Cicom[];open:(id:number)=>void}) { return <><Head title="Retiradas" text="Histórico integral de retiradas, sem limite por CICOM."/><section className="panel mt-7 overflow-hidden"><PickupTable rows={rows} cicoms={cicoms} open={open}/></section></> }
function PickupTable({rows,cicoms,open}:{rows:Pickup[];cicoms:Cicom[];open:(id:number)=>void}) { const ordinal=(p:Pickup)=>[...rows.filter(r=>r.cicomId===p.cicomId)].sort((a,b)=>dateNum(a.date)-dateNum(b.date)).findIndex(r=>r.id===p.id)+1; return <table><thead><tr><th>RETIRADA</th><th>CICOM</th><th>DATA</th><th>ATENDENTE</th><th>TIPO</th><th>OBSERVAÇÃO</th><th>STATUS</th></tr></thead><tbody>{rows.map(p=><tr key={p.id}><td className="font-bold text-[#075985]">{ordinal(p)}ª retirada</td><td><button onClick={()=>open(p.cicomId)} className="font-bold hover:text-[#075985]">{cicoms.find(c=>c.id===p.cicomId)?.name}</button></td><td>{p.date}</td><td>{p.attendant||"Não informado"}</td><td>{p.type}</td><td className="text-[#607985]">{p.note}</td><td><span className={`status ${p.completed?"status-success":"status-warning"}`}>{p.completed?"Completa":"Incompleta"}</span></td></tr>)}</tbody></table> }
function Pending({rows,cicoms,open}:{rows:Pickup[];cicoms:Cicom[];open:(id:number)=>void}) { return <><Head title="Pendências" text="Retiradas incompletas que precisam de conferência ou nova entrega."/><div className="mt-7 grid gap-4 md:grid-cols-2 xl:grid-cols-3">{rows.map(p=><button key={p.id} onClick={()=>open(p.cicomId)} className="panel border-l-4 border-l-[#f59e0b] p-5 text-left"><p className="text-xs font-bold text-[#a96318]">{p.date} · retirada incompleta</p><h2 className="mt-3 font-bold">{cicoms.find(c=>c.id===p.cicomId)?.name}</h2><p className="mt-2 text-sm leading-6 text-[#607985]">{p.note}</p><p className="mt-4 text-sm font-bold text-[#075985]">Abrir histórico</p></button>)}</div></> }
function Reports({pickups,cicoms}:{pickups:Pickup[];cicoms:Cicom[]}) { return <><Head title="Relatórios" text="Indicadores consolidados da operação."/><div className="mt-7 grid gap-4 md:grid-cols-3"><Metric value={String(pickups.length)} label="Total de retiradas" icon={<Truck/>}/><Metric value={String(pickups.filter(p=>p.completed).length)} label="Concluídas" icon={<CheckCircle2/>}/><Metric value={String(pickups.filter(p=>!p.completed).length)} label="Pendências" icon={<ClipboardList/>}/></div><section className="panel mt-6 p-6"><h2 className="font-bold">Retiradas por CICOM</h2>{cicoms.map(c=>{const amount=pickups.filter(p=>p.cicomId===c.id).length;return <div key={c.id} className="mt-5 flex items-center gap-4"><p className="w-52 text-sm font-semibold">{c.name}</p><div className="h-2 flex-1 rounded-full bg-[#e7f0f5]"><div className="h-full rounded-full bg-[#0284c7]" style={{width:`${Math.max(8,amount/Math.max(1,pickups.length)*100)}%`}}/></div><b className="text-[#075985]">{amount}</b></div>})}</section></> }
function Audit({rows}:{rows:Pickup[]}) { return <><Head title="Auditoria" text="Movimentações registradas pelo sistema."/><section className="panel mt-7 divide-y divide-[#e5edf2]">{[...rows].slice(-8).reverse().map(p=><div key={p.id} className="flex gap-4 px-6 py-5"><div className="grid h-9 w-9 place-items-center rounded-full bg-[#e0f2fe] text-[#075985]"><History size={17}/></div><div><p className="text-sm font-semibold">Retirada registrada: {p.type}</p><p className="mt-1 text-xs text-[#718079]">{p.date} · Atendente: {p.attendant||"Não informado"}</p></div></div>)}</section></> }
function Head({title,text,action,click}:{title:string;text:string;action?:string;click?:()=>void}) { return <div className="flex items-end justify-between"><div><p className="text-xs font-extrabold tracking-[.12em] text-[#075985]">CONTROLE OPERACIONAL</p><h1 className="mt-1 text-3xl font-extrabold">{title}</h1><p className="mt-2 text-sm text-[#607985]">{text}</p></div>{action&&<button onClick={click} className="primary-button inline-flex items-center gap-2"><Plus size={17}/>{action}</button>}</div> }
function Modal({kind,cicoms,close,save}:{kind:"cicom"|"retirada";cicoms:Cicom[];close:()=>void;save:(f:FormData)=>void}) { const pickup=kind==="retirada"; return <div className="modal-backdrop"><form action={save} className="modal"><div className="flex items-center justify-between border-b border-[#e3ebf0] p-5"><div><h2 className="font-bold">{pickup?"Registrar retirada":"Cadastrar CICOM"}</h2><p className="mt-1 text-xs text-[#718079]">{pickup?"Classificação e histórico atualizados automaticamente.":"A agenda trimestral será criada automaticamente."}</p></div><button type="button" onClick={close}><X size={19}/></button></div><div className="space-y-4 p-5">{pickup?<><label className="form-label">CICOM<select name="cicomId">{cicoms.map(c=><option key={c.id} value={c.id}>{c.name}</option>)}</select></label><div className="grid grid-cols-2 gap-4"><label className="form-label">Data<input name="date" type="date" required/></label><label className="form-label">Atendente<input name="attendant" required/></label></div><label className="form-label">Tipo<select name="type"><option>Retirada completa</option><option>Retirada incompleta</option><option>Material trimestral</option><option>Enviado na viagem</option><option>Envio completo</option></select></label><label className="flex items-center gap-2 text-sm font-semibold text-[#385866]"><input name="completed" type="checkbox"/> Concluída sem pendência</label></>:<><label className="form-label">Nome do CICOM<input name="name" required placeholder="CICOM ..."/></label><div className="grid grid-cols-2 gap-4"><label className="form-label">Código<input name="code" required/></label><label className="form-label">Município<input name="city" required/></label></div><label className="form-label">Região<input name="region" required/></label><label className="form-label">Primeira retirada prevista<input name="scheduleStart" type="date" required/></label></>}<label className="form-label">Observação<textarea name="note" required rows={3} placeholder="Registre detalhes, pendências ou conferências"/></label></div><div className="flex justify-end gap-2 border-t border-[#e3ebf0] p-4"><button type="button" className="secondary-button" onClick={close}>Cancelar</button><button className="primary-button">Salvar</button></div></form></div> }
function schedule(start:string,index:number) { const date=new Date(`${start}T12:00:00`); date.setMonth(date.getMonth()+index*3); return date; } function formatDate(date:Date) { return date.toLocaleDateString("pt-BR"); } function dateNum(value:string) { const [d,m,y]=value.split("/").map(Number); return new Date(y,m-1,d).getTime(); }
