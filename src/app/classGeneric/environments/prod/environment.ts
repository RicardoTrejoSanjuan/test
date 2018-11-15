import { Path, Production } from "../../../interfaces/path";

export const PathServiceprod = {
  paths: [
    {
      idPath: 1,
      namePath: "Asesor",
      path: "https://www.bancaempresarialazteca.com.mx"
    },
    {
      idPath: 2,
      namePath: "Portal",
      path: "http://10.51.193.146/"
    },
    {
      idPath: 3,
      namePath: "Mesa",
      path: "https://10.53.42.83:8443/ServiciosPortal"
    }
  ]
};


export const Environment: Production = {
  production: true
};
