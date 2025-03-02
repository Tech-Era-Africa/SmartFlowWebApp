
export class ClusterModel{

    static fromMap(json: any): ICluster {
        const cluster: ICluster = {
            id: json.id,
            name: json.name,
            type:json.type,
            description: json.description || null,
            device_count: json.device_count ?? 0
        };
    
        return cluster;
    }

}


export interface ICluster {
    id: number;
    name: string;
    description: string | null;
    device_count: number;
    type:{
        id: number;
        name: string;}
}



