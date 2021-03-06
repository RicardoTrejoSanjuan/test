/*
Archivo con url´s para el consumo de servicios de la mesa de control
*/
export const MESA_CONTROL: any = {
    consultaPorRol: '/mesacontrol/captacion/solicitud/rol/consulta',
    consultaPorRol2: '/mesacontrol/captacion/soldocs/solXrol',
    bloquea: '/mesacontrol/captacion/solicitud/bloquea',
    permisosUser: '/mesacontrol/configuracion/rol/consulta',
    solicitudRevision: '/mesacontrol/captacion/solicitud/consulta/id',
    idUsuario: '/mesacontrol/captacion/revision/consulta/IdEmpleado',
    historialNombres: '/mesacontrol/captacion/historico/nombre/consulta',
    consultaDocumentos: '/mesacontrol/captacion/digitalizacion/rutas/consulta',
    consultaDocumentosPdf: '/documentos/digitalizacion/captacion/obtiene/rutas',
    consultaDocumentosPdfDigitalizacion: '/mesacontrol/digitalizacion/base64/pdf/consulta/temp',
    consultaStatusDocument: '/mesacontrol/captacion/soldocs/consulta',
    getSign: '/ServiciosBig/api/externo/digitalizacion/consultaFirma',
    // rutas documentos

    generarDocumentoById: '/digitalizacion/',

    cambioEstatusDocumento: '/documentos/digitalizacion/captacion/actualiza/status',
    certificaDocumento: '/documentos/digitalizacion/captacion/certifica',

    revisionesPrevias: '/mesacontrol/captacion/revision/solicitud/consulta',
    recuperaFoto: '/mesacontrol/captacion/clienteunico/foto/consulta',
    getBase64Image: '/mesacontrol/digitalizacion/base64/png/consulta',
    insertaCalificacion: '/mesacontrol/captacion/revision/inserta',
    getInstituciones: '/mesacontrol/credito/instituciones/mesa/consulta',
    getProductos: '/mesacontrol/credito/instituciones/productos/consulta',
    getQueryCreditos: '/mesacontrol/credito/solicitud/datos/consulta',
    consultaDocumentosCredito: '/mesacontrol/credito/documentos/rutas/consulta',
    getDocumentPDF: '/mesacontrol/credito/documentos/pdf',
    getNotasCredito: '/mesacontrol/credito/notas/consulta',
    getTipoIdentificacion: '/mesacontrol/captacion/datos/tipodocumento/consulta',
    actualizarStatusDoc: '/documentos/digitalizacion/captacion/actualiza/status',
    certificarSolicitud: '/documentos/digitalizacion/captacion/certifica'
};

export const B64_DOC_NOT_FOUND: string = "PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iaXNvLTg4NTktMSI/Pgo8IS0tIEdlbmVyYXRvcjogQWRvYmUgSWxsdXN0cmF0b3IgMTguMC4wLCBTVkcgRXhwb3J0IFBsdWctSW4gLiBTVkcgVmVyc2lvbjogNi4wMCBCdWlsZCAwKSAgLS0+CjwhRE9DVFlQRSBzdmcgUFVCTElDICItLy9XM0MvL0RURCBTVkcgMS4xLy9FTiIgImh0dHA6Ly93d3cudzMub3JnL0dyYXBoaWNzL1NWRy8xLjEvRFREL3N2ZzExLmR0ZCI+CjxzdmcgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4bWxuczp4bGluaz0iaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGluayIgdmVyc2lvbj0iMS4xIiBpZD0iQ2FwYV8xIiB4PSIwcHgiIHk9IjBweCIgdmlld0JveD0iMCAwIDU4IDU4IiBzdHlsZT0iZW5hYmxlLWJhY2tncm91bmQ6bmV3IDAgMCA1OCA1ODsiIHhtbDpzcGFjZT0icHJlc2VydmUiIHdpZHRoPSI1MTJweCIgaGVpZ2h0PSI1MTJweCI+CjxnPgoJPGc+CgkJPHBvbHlnb24gc3R5bGU9ImZpbGw6I0VGRUJERTsiIHBvaW50cz0iNDYuNSwxNCAzMi41LDAgMS41LDAgMS41LDU4IDQ2LjUsNTggICAiLz4KCQk8Zz4KCQkJPHBhdGggc3R5bGU9ImZpbGw6I0Q1RDBCQjsiIGQ9Ik0xMS41LDIzaDI1YzAuNTUyLDAsMS0wLjQ0NywxLTFzLTAuNDQ4LTEtMS0xaC0yNWMtMC41NTIsMC0xLDAuNDQ3LTEsMVMxMC45NDgsMjMsMTEuNSwyM3oiLz4KCQkJPHBhdGggc3R5bGU9ImZpbGw6I0Q1RDBCQjsiIGQ9Ik0xMS41LDE1aDEwYzAuNTUyLDAsMS0wLjQ0NywxLTFzLTAuNDQ4LTEtMS0xaC0xMGMtMC41NTIsMC0xLDAuNDQ3LTEsMVMxMC45NDgsMTUsMTEuNSwxNXoiLz4KCQkJPHBhdGggc3R5bGU9ImZpbGw6I0Q1RDBCQjsiIGQ9Ik0zNi41LDI5aC0yNWMtMC41NTIsMC0xLDAuNDQ3LTEsMXMwLjQ0OCwxLDEsMWgyNWMwLjU1MiwwLDEtMC40NDcsMS0xUzM3LjA1MiwyOSwzNi41LDI5eiIvPgoJCQk8cGF0aCBzdHlsZT0iZmlsbDojRDVEMEJCOyIgZD0iTTM2LjUsMzdoLTI1Yy0wLjU1MiwwLTEsMC40NDctMSwxczAuNDQ4LDEsMSwxaDI1YzAuNTUyLDAsMS0wLjQ0NywxLTFTMzcuMDUyLDM3LDM2LjUsMzd6Ii8+CgkJCTxwYXRoIHN0eWxlPSJmaWxsOiNENUQwQkI7IiBkPSJNMzYuNSw0NWgtMjVjLTAuNTUyLDAtMSwwLjQ0Ny0xLDFzMC40NDgsMSwxLDFoMjVjMC41NTIsMCwxLTAuNDQ3LDEtMVMzNy4wNTIsNDUsMzYuNSw0NXoiLz4KCQk8L2c+CgkJPHBvbHlnb24gc3R5bGU9ImZpbGw6I0Q1RDBCQjsiIHBvaW50cz0iMzIuNSwwIDMyLjUsMTQgNDYuNSwxNCAgICIvPgoJPC9nPgoJPGc+CgkJPGNpcmNsZSBzdHlsZT0iZmlsbDojRUQ3MTYxOyIgY3g9IjQ0LjUiIGN5PSI0NiIgcj0iMTIiLz4KCQk8cGF0aCBzdHlsZT0iZmlsbDojRkZGRkZGOyIgZD0iTTQ1LjkxNCw0NmwzLjUzNi0zLjUzNmMwLjM5MS0wLjM5MSwwLjM5MS0xLjAyMywwLTEuNDE0cy0xLjAyMy0wLjM5MS0xLjQxNCwwTDQ0LjUsNDQuNTg2ICAgIGwtMy41MzYtMy41MzZjLTAuMzkxLTAuMzkxLTEuMDIzLTAuMzkxLTEuNDE0LDBzLTAuMzkxLDEuMDIzLDAsMS40MTRMNDMuMDg2LDQ2bC0zLjUzNiwzLjUzNmMtMC4zOTEsMC4zOTEtMC4zOTEsMS4wMjMsMCwxLjQxNCAgICBjMC4xOTUsMC4xOTUsMC40NTEsMC4yOTMsMC43MDcsMC4yOTNzMC41MTItMC4wOTgsMC43MDctMC4yOTNsMy41MzYtMy41MzZsMy41MzYsMy41MzZjMC4xOTUsMC4xOTUsMC40NTEsMC4yOTMsMC43MDcsMC4yOTMgICAgczAuNTEyLTAuMDk4LDAuNzA3LTAuMjkzYzAuMzkxLTAuMzkxLDAuMzkxLTEuMDIzLDAtMS40MTRMNDUuOTE0LDQ2eiIvPgoJPC9nPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+Cjwvc3ZnPgo=";
/*
/mesacontrol/historico/nombre/consulta
/mesacontrol/captacion/digitalizacion/rutas/consulta
/mesacontrol/captacion/clienteunico/foto/consulta
*/