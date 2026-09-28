
export class MachineConnectionClass {
  ip: string;
  port: string;

  constructor() {
    this.ip = '10.20.50.233';
    this.port = '33200';
  }

  MachineIP(): string {
    return `${this.ip}:${this.port}`;
  }
}


export class ActionClass {
  sAction: string;
  ActionCheckError: boolean;

  constructor() {
    this.sAction = 'action';
    this.ActionCheckError = false;
  }

  ActionCheck(): void {
    this.ActionCheckError = false;

    if (this.sAction !== 'action' && this.sAction !== 'echo') {
      this.sAction = 'action';
      this.ActionCheckError = true;
    }
  }
}


export class MachineInfoJSON {
  machineStatus: string = '';
  errorValue: string = '';
  errorInfo: string = '';
  cardInside: string = '';
  coverOpen: string = '';
  feeder: string[] = [];
  cardCounter: number = 0;
  tipperStatus: string = '';
  tipperTemperature: number = 0;
  tipperNearEnd: string = '';
  frontInFillerNearEnd: string = '';
  rearInFillerNearEnd: string = '';
  machineSN: string = '';
  embosserVersion: string = '';

  constructor() {

  }

  machineInfoTextJSON(): string {
    let sb: string[] = [];

    sb.push('MACHINE INFO :');
    sb.push(`Machine Status: ${this.machineStatus}`);
    sb.push(`Card Inside: ${this.cardInside}`);
    sb.push(`Cover Open: ${this.coverOpen}`);

    this.feeder?.forEach((item, index) => {
      sb.push(`Feeder ${index}: ${item}`);
    });

    sb.push(`Card Counter: ${this.cardCounter}`);
    sb.push(`Tipper Status: ${this.tipperStatus}, Tipper Temperature: ${this.tipperTemperature}`);
    sb.push(`Tipper NearEnd: ${this.tipperNearEnd}`);
    sb.push(`FrontInfiller NearEnd: ${this.frontInFillerNearEnd}`);
    sb.push(`RearInfiller NearEnd: ${this.rearInFillerNearEnd}`);
    sb.push(`Machine SN: ${this.machineSN}`);
    sb.push(`Embosser Version: ${this.embosserVersion}`);

    return sb.join('\n');
  }
}


export class CardData {
  private static maxEmbLine: number = 20;

  cardsToProduce: number = 0;
  processMag: string = "";
  processEmb: string = "";
  trackToRead: string = "";
  feederID: string = "";
  stackerID: string = "";
  coercivity: string = "";
  tk1: string = "";
  tk2: string = "";
  tk3: string = "";
  readTrackID: string = "";
  tipperEnable: string = "";

  embossLineFont: string[] = new Array(CardData.maxEmbLine).fill("");
  embossLineCpi: string[] = new Array(CardData.maxEmbLine).fill("");
  embossLineX: string[] = new Array(CardData.maxEmbLine).fill("");
  embossLineY: string[] = new Array(CardData.maxEmbLine).fill("");
  embossLineText: string[] = new Array(CardData.maxEmbLine).fill("");

  static get MaxEmbLine(): number {
    return this.maxEmbLine;
  }

  static set MaxEmbLine(value: number) {
    this.maxEmbLine = value;
  }

  constructor() {
    this.clearCardData();
  }

  addEmbossBufferLine(index: number, embFont: string, embCpi: string, embX: string, embY: string, embText: string): void {
    if (index < CardData.maxEmbLine) {
      this.embossLineFont[index] = embFont;
      this.embossLineCpi[index] = embCpi;
      this.embossLineX[index] = embX;
      this.embossLineY[index] = embY;
      this.embossLineText[index] = embText;
    }
  }

  clearCardData(): void {
    this.processMag = "";
    this.processEmb = "";
    this.feederID = "";
    this.stackerID = "";
    this.trackToRead = "";
    this.coercivity = "";
    this.tk1 = "";
    this.tk2 = "";
    this.tk3 = "";
    this.readTrackID = "";
    this.tipperEnable = "";

    for (let i = 0; i < CardData.maxEmbLine; i++) {
      this.embossLineFont[i] = "";
      this.embossLineCpi[i] = "";
      this.embossLineX[i] = "";
      this.embossLineY[i] = "";
      this.embossLineText[i] = "";
    }
  }

  cardDataText(): string {
    let sb: string[] = [];

    sb.push("CARD DATA :");
    sb.push(`Process MAG = ${this.processMag}, EMB = ${this.processEmb}`);
    sb.push(`Load from Feeder = ${this.feederID} and Eject to Stacker = ${this.stackerID}`);
    sb.push(`Track to Read = ${this.trackToRead}`);

    let sCoercivity: string;
    if (this.coercivity === "1") sCoercivity = "MAG LOCO";
    else if (this.coercivity === "2") sCoercivity = "MAG HICO";
    else sCoercivity = "MAG Coercitivity Not Set";

    sb.push(sCoercivity);
    sb.push(`TK1 = ${this.tk1}`);
    sb.push(`TK2 = ${this.tk2}`);
    sb.push(`TK3 = ${this.tk3}`);
    sb.push(`MaxEmbLine = ${CardData.maxEmbLine}`);

    for (let i = 0; i < CardData.maxEmbLine; i++) {
      if (this.embossLineX[i] === "") break;

      sb.push(`EmbLine${i + 1} = F${this.embossLineFont[i]} CS${this.embossLineCpi[i]} X${this.embossLineX[i]} Y${this.embossLineY[i]} ${this.embossLineText[i]}`);
    }

    return sb.join("\n");
  }
}

export class MachineCommands
{
  _action :ActionClass=new ActionClass();
  _connectioninfo :MachineConnectionClass=new MachineConnectionClass();
  _machineinfo : MachineInfoJSON=new MachineInfoJSON();
  _data :CardData=new CardData();
  JsonCommand :string='';
  reply!:number;
  sReadMAGData:string='';
  sChip:string='';
  constructor(action:ActionClass,conn: MachineConnectionClass,info :MachineInfoJSON,data:CardData)
  {
      this._action=action;
      this._connectioninfo=conn;
      this._machineinfo=info;
      this._data=data;
  }





}


export enum Commands {
  GetInfo,
  GetInfoJson,
  Restore,
  Emboss,
  CoverOpen,

  LoadCard,
  EjectCard,
  RetractCard,
  RejectCard,

  WriteMAG,
  ReadMAG,

  MoveToChip,
  MoveToCLess,
  ChipReset,
  ApduExchange
}
