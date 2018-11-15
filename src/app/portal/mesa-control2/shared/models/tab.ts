/*
 * @version 1.0 (10/10/2018)
 * @author rtrejo
 * @description Interfas del elemento Tab
 * @contributors Front-end team
 */
export interface ITab {
    id?: number;
    title?: string;
    status?: boolean;
}

export class Tab implements ITab {
    constructor(
        public id?: number,
        public title?: string,
        public status?: boolean,
    ){};

    public getTabsBandeja():Tab[]{
        return [
            new Tab(0, 'Bandeja de Recepción', true),
            new Tab(5, 'Bandeja en Corrección AC', true),
            new Tab(3, 'Devueltas con observación',false),
            // new Tab(4, 'Rechazadas', false),
            new Tab(21, 'Liberadas por MC', false),
            new Tab(22, 'Liberaciones Automáticas', false),
            new Tab(23, 'Conciliación', false)
        ];
    }

    public getTabsAsesor():Tab[]{
        return [
            new Tab(5, 'Bandeja de Recepción', true),
        ];
    }
}