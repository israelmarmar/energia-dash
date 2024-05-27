import { convertToDate } from "./convertToDate";

export default function extractData(data: string){
    const json: any = {};
    let nClient;
    let month;
    let energiaQt;
    let energiaV;
    let energiaQtSCEE;
    let energiaVSCEE;
    let energiaQtGDI;
    let energiaVGDI;
    let contribMun;
  
    let regexNClient = /Nº DO CLIENTE\s+Nº DA INSTALAÇÃO\n\s+(\d+)\s+/g;
    nClient = [...data.matchAll(regexNClient)][0][1];
    json.nClient = nClient;
  
    let regexMonth = /Referente a\s+Vencimento\s+Valor a pagar \(R\$\)\n\s+([A-Z]{3}\/\d{4})/g;
    month = [...data.matchAll(regexMonth)][0][1];

    console.log(month);
  
    let regexEnergiaEl = /ElétricakWh\s+([\d.]+)\s+([\d,]+)/g;
    let regexEnergiaSCEE = /ISENTAkWh\s+([\d.]+)\s+([\d,]+)/g;
    let regexEnergiaGDI = /IkWh\s+([\d.]+)\s+([\d,]+)/g;
    let regexContribMun = /Municipal\s+([\d,]+)/g;
  
    energiaQt = [...data.matchAll(regexEnergiaEl)][0][1];

    console.log(energiaQt);

    energiaV = [...data.matchAll(regexEnergiaEl)][0][2];
  
    contribMun = [...data.matchAll(regexContribMun)][0][1];
  
    if([...data.matchAll(regexEnergiaSCEE)][0]){
      energiaQtSCEE = [...data.matchAll(regexEnergiaSCEE)][0][1];
      json.energiaQtSCEE = parseInt(energiaQtSCEE);
      energiaVSCEE = [...data.matchAll(regexEnergiaSCEE)][0][2];
      json.energiaVSCEE = parseFloat(energiaVSCEE.replace(',','.'));
    }
  
  
    if([...data.matchAll(regexEnergiaGDI)][0]){
      energiaVGDI= [...data.matchAll(regexEnergiaSCEE)][0][1];
      json.energiaVGDI= parseFloat(energiaVGDI.replace(',','.'));
  
      energiaQtGDI= [...data.matchAll(regexEnergiaSCEE)][0][2];
      json.energiaQtGDI= parseFloat(energiaQtGDI.replace(',','.'));
    }
  
    json.month = month;
    json.energiaQt = parseInt(energiaQt.replace('.',''));
    json.energiaV = parseFloat(energiaV.replace(',','.'));
    json.contribMun = parseFloat(contribMun.replace(',','.'));
    json.date = convertToDate(json.month);
  
    return json;
  }