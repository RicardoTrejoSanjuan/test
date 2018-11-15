

export class Pages {
    private _active: boolean = false;
    constructor(private _str: string, private _page: number) { }
}
export class PagesHandler {
    public init: number = 0;
    public final: number = 8;
    constructor() { }
}

export class ConfigNgTable2 {
    constructor(private total: number, private regPorPage: number) { }
    public getTotal(): number {
        return this.total;
    }
    public getRegPorPage(): number {
        return this.regPorPage;
    }
}
