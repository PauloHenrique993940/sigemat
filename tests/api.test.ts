import { describe, expect, it } from "@jest/globals";
import { pageParams } from "@/lib/api";
import { paginate } from "@/lib/store";

describe("helpers da API", () => {
  it("normaliza paginação e limita o tamanho da página", () => {
    expect(pageParams(new URLSearchParams("page=0&perPage=500"))).toEqual({ page: 1, perPage: 100, skip: 0 });
    expect(pageParams(new URLSearchParams("page=3&perPage=10"))).toEqual({ page: 3, perPage: 10, skip: 20 });
  });

  it("retorna itens e metadados paginados", () => {
    expect(paginate(["a", "b", "c"], 2, 2)).toEqual({ data: ["c"], meta: { page: 2, perPage: 2, total: 3, pages: 2 } });
  });
});
