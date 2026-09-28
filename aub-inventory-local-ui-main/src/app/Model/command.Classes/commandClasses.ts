
export class LoadCardClass {
  command: string;
  feeder_id: string;

  constructor(command: string, feeder_id: string) {
    this.command = command;
    this.feeder_id = feeder_id;
  }
}

export class EjectCardClass {
  command: string;
  reject_id: string;

  constructor(command: string, reject_id: string) {
    this.command = command;
    this.reject_id = reject_id;
  }
}

export class MagData {
  coercivity: string;
  tk1: string;
  tk2: string;
  tk3: string;

  constructor(coercivity: string, tk1: string, tk2: string, tk3: string) {
    this.coercivity = coercivity;
    this.tk1 = tk1;
    this.tk2 = tk2;
    this.tk3 = tk3;
  }
}

export class WriteMAGClass {
  command: string;
  magData: MagData;

  constructor(command: string, coercivity: string, tk1: string, tk2: string, tk3: string) {
    this.command = command;
    this.magData = new MagData(coercivity, tk1, tk2, tk3);
  }
}

export class ReadMAGClass {
  command: string;
  track_id: string;

  constructor(command: string, track_id: string) {
    this.command = command;
    this.track_id = track_id;
  }
}

export class EmbossLine {
  font: string;
  cpi: string;
  x: string;
  y: string;
  text: string;

  constructor(font: string, cpi: string, x: string, y: string, text: string) {
    this.font = font;
    this.cpi = cpi;
    this.x = x;
    this.y = y;
    this.text = text;
  }
}

export class EmbossLineClass {
  command: string;
  emboss_line: EmbossLine[];
  tipper_on: string;
  tipper_termperature: string;
  tipper_pressure: string;
  tipper_consuming: string;
  tipper_time: string;

  constructor(
    command: string,
    emboss_line: EmbossLine[],
    tipper_on: string,
    tipTemp: string,
    tipPress: string,
    tipCons: string,
    tipTime: string
  ) {
    this.command = command;
    this.emboss_line = emboss_line;
    this.tipper_on = tipper_on;
    this.tipper_termperature = tipTemp;
    this.tipper_pressure = tipPress;
    this.tipper_consuming = tipCons;
    this.tipper_time = tipTime;
  }
}

export class CoverOpenClass {
  command: string;
  parameter: string;

  constructor(command: string, parameter: string) {
    this.command = command;
    this.parameter = parameter;
  }
}

export class MoveToChipClass {
  command: string;
  chip_station: string;

  constructor(command: string, chip_station: string) {
    this.command = command;
    this.chip_station = chip_station;
  }
}

export class ChipResetClass {
  command: string;
  unpower: string;

  constructor(command: string, unpower: string) {
    this.command = command;
    this.unpower = unpower;
  }
}

export class ApduExchangeClass {
  command: string;
  apdu: string;

  constructor(command: string, apdu: string) {
    this.command = command;
    this.apdu = apdu;
  }
}

export class ErrorClass {
  group: string;
  code: string;
  message: string;

  constructor(group: string = '', code: string = '', message: string = '') {
    this.group = group;
    this.code = code;
    this.message = message;
  }
}

export class AnswerClass {
  answer: string;
  error: ErrorClass;
  data: string;

  constructor(answer: string = '', data: string = '', group: string = '', code: string = '', message: string = '') {
    this.answer = answer;
    this.error = new ErrorClass(group, code, message);
    this.data = data;
  }
}
