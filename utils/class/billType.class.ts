export class BillType {
  private static nameMap: { [key: string]: string } = {
      'DOMESTIC': 'CgLyr25vRE',
      'COMMERCIAL': 'rxc51QYu7l',
      'INDUSTRIAL': '0csbmPljgZ'
  };

  private static map: { [key: string]: { name: 'DOMESTIC' | 'COMMERCIAL' | 'INDUSTRIAL'; color: string } } = {
      'CgLyr25vRE': { name: 'DOMESTIC', color: '#FFA500' },
      'rxc51QYu7l': { name: 'COMMERCIAL', color: '#F0E9DD' },
      '0csbmPljgZ': { name: 'INDUSTRIAL', color: '#340138' },
  };

  static getName(id: string) : 'DOMESTIC' | 'COMMERCIAL' | 'INDUSTRIAL' {
      return this.map[id].name;
  }

  static getColor(id: string) {
      return this.map[id].color;
  }

  static getId(name: 'DOMESTIC' | 'COMMERCIAL' | 'INDUSTRIAL'): string | undefined {
      return this.nameMap[name];
  }
}