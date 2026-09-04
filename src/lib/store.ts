import { randomUUID } from "node:crypto";

export type Cicom = { id: string; name: string; code: string; region?: string | null; municipality?: string | null; address?: string | null; responsible?: string | null; phone?: string | null; email?: string | null; status: "ACTIVE" | "INACTIVE"; notes?: string | null; createdAt: string };
export type Material = { id: string; code: string; name: string; unit: string; currentStock: number; minimumStock: number; categoryId?: string | null; status: "ACTIVE" | "INACTIVE" | "DISCONTINUED"; description?: string | null; notes?: string | null };
export type SolicitationItem = { id: string; materialId: string; requestedAmount: number };
export type Solicitation = { id: string; number: string; cicomId: string; requester: string; status: string; items: SolicitationItem[] };
export type Delivery = { id: string; number: string; solicitationId: string; cicomId: string; attendantId: string; attendantName: string; status: "DELIVERED" | "PARTIALLY_DELIVERED"; notes?: string; deliveredAt: string; items: { solicitationItemId: string; materialId: string; deliveredAmount: number }[] };

type Store = { cicoms: Cicom[]; materials: Material[]; solicitations: Solicitation[]; deliveries: Delivery[]; auditLogs: unknown[]; sequence: number };

const globalStore = globalThis as unknown as { sigematStore?: Store };
export const store = globalStore.sigematStore ?? {
  cicoms: [
    { id: "cicom-alagoinhas", name: "CICOM Alagoinhas", code: "CICOM-ALG", region: "Leste", municipality: "Alagoinhas", responsible: "Carvalho", status: "ACTIVE", notes: "Retirada incompleta: falta papel higiênico.", createdAt: "2026-01-10T09:00:00.000Z" },
    { id: "cicom-barreiras", name: "CICOM Barreiras", code: "CICOM-BAR", region: "Oeste", municipality: "Barreiras", responsible: "Leandro", status: "ACTIVE", notes: "Pendente: esponja de aço.", createdAt: "2026-01-10T09:00:00.000Z" },
    { id: "cicom-euclides", name: "CICOM Euclides da Cunha", code: "CICOM-EUC", region: "Nordeste", municipality: "Euclides da Cunha", status: "ACTIVE", notes: "Retirou apenas o que solicitou; verificar na pasta.", createdAt: "2026-01-10T09:00:00.000Z" },
    { id: "cicom-feira", name: "CICOM Feira de Santana", code: "CICOM-FSA", region: "Leste", municipality: "Feira de Santana", responsible: "Carvalho", status: "ACTIVE", createdAt: "2026-01-10T09:00:00.000Z" },
    { id: "cicom-guanambi", name: "CICOM Guanambi", code: "CICOM-GUA", region: "Sudoeste", municipality: "Guanambi", responsible: "Jailton", status: "ACTIVE", notes: "Faltou desinfetante, esponja de aço, pano de prato e saco de lixo.", createdAt: "2026-01-10T09:00:00.000Z" },
  ],
  materials: [
    { id: "mat-papel-higienico", code: "MAT-001", name: "Papel higiênico", unit: "Unidade", currentStock: 120, minimumStock: 50, status: "ACTIVE" },
    { id: "mat-papel-bobina", code: "MAT-002", name: "Papel bobina", unit: "Rolo", currentStock: 8, minimumStock: 20, status: "ACTIVE" },
    { id: "mat-desinfetante", code: "MAT-003", name: "Desinfetante", unit: "Galão", currentStock: 14, minimumStock: 15, status: "ACTIVE" },
    { id: "mat-multiuso", code: "MAT-004", name: "Multiuso", unit: "Galão", currentStock: 30, minimumStock: 10, status: "ACTIVE" },
  ],
  solicitations: [], deliveries: [], auditLogs: [{ action: "IMPORT_SPREADSHEET", message: "Histórico inicial importado da planilha de retiradas de 2026.", at: "2026-09-03T09:00:00.000Z" }], sequence: 0,
};
globalStore.sigematStore = store;

export function id() { return randomUUID(); }
export function paginate<T>(items: T[], page: number, perPage: number) { return { data: items.slice((page - 1) * perPage, page * perPage), meta: { page, perPage, total: items.length, pages: Math.ceil(items.length / perPage) } }; }
