
export class Status {
  private static statusMap: { [key: string]: { name: string; color: string } } = {
    h9Eb9xqyjq: { name: 'Unpaid', color: '#FFA500' },
    t0H56JNEHb: { name: 'Inactive', color: '#F0E9DD' },
    heWFtvGqhO: { name: 'Active', color: '#340138' },
    vcDFmQoFkD: { name: 'Paid', color: '#00FF7B' },

  };

  static getName(id: string) {
    return this.statusMap[id].name;
  }

  static getColor(id: string) {
    return this.statusMap[id].color;
  }


}

