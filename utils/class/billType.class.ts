
export class BillType {
    private static map: { [key: string]: { name: string; color: string } } = {
        CgLyr25vRE: { name: 'Domestic', color: '#FFA500' },
        rxc51QYu7l: { name: 'Commercial', color: '#F0E9DD' },
        '0csbmPljgZ': { name: 'Industrial', color: '#340138' },

  
    };
  
    static getName(id: string) {
      return this.map[id].name;
    }

    static getColor(id: string) {
        return this.map[id].color;
      }
  
   
  
  }
  
  