
export class Status {
  private static statusMap: { [key: string]: { name: string; color: string } } = {
    h9Eb9xqyjq: { name: 'Unpaid', color: '#FFA500' },
    t0H56JNEHb: { name: 'Inactive', color: '#F0E9DD' },
    heWFtvGqhO: { name: 'Active', color: '#340138' },
    vcDFmQoFkD: { name: 'Paid', color: '#00FF7B' },

  };

  static getStatus(id: string): { name: string; color: string } | null {
    return this.statusMap[id] || null;
  }

  static get Pending(): { name: string; color: string } | null {
    return this.getStatus('h9Eb9xqyjq');
  }

}

