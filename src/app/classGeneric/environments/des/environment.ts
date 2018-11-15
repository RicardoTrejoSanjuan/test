import { Path, Production } from "../../../interfaces/path";

export const PathServicedes = {
  paths: [
    {
      idPath: 1,
      namePath: "Asesor",
      path: "http://10.51.193.146:8080"
    },
    {
      idPath: 2,
      namePath: "Portal",
      // path: "http://10.51.212.35:8080/"
      path: "http://10.51.193.146/"
    },
    {
      idPath: 3,
      namePath: "Mesa",
      path: "http://10.51.193.146:80/ServiciosPortal"
      // path: "http://10.51.212.35:8080/ServiciosPortal"
    }
  ]
};

export const Environment: Production = {
  production: false
};
