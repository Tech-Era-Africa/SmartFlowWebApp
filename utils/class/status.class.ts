
export class Status {
  private static statusMap: { [key: string]: { name: string; color: string } } = {
    h9Eb9xqyjq: { name: 'Unpaid', color: 'bg-yellow-400' },
    t0H56JNEHb: { name: 'Inactive', color: 'bg-blue-100' },
    heWFtvGqhO: { name: 'Active', color: 'bg-blue-600' },
    vcDFmQoFkD: { name: 'Paid', color: 'bg-green-500' },

  };

  static getName(id: string) {
    return this.statusMap[id].name;
  }

  static getColor(id: string) {
    return this.statusMap[id].color;
  }


}

