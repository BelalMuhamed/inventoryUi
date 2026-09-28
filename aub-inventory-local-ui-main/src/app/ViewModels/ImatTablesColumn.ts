export interface ColumnDef {
  key: string;
  label: string;
  type?: 'text' | 'number' | 'date' | 'currency' | 'boolean' |'image'| 'actions'|'printWay'|'printedFace';
}
