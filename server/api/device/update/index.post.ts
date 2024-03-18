import { useApiFetch } from "~/composables/use_api_fetch";


export default defineEventHandler((event) => new Promise(async (resolve, reject) => {
    const { eui, totalConsumption, valveState } = await readBody(event)

    try {

        if (!eui) throw Error("EUI is required")
        if (!valveState) throw Error("Valve state is required")
        if (!totalConsumption) throw Error("Total consumption is required")

        const res = await useApiFetch('functions/updateDeviceData', {
            method: "POST",
            data: {
                eui,
                totalConsumption,
                valveState,
            }
        });

        if (!res.data.result.success) {
            return reject("Could not update device")
        }

        const deviceData = res.data.result.data;

        // Send entry to Influx db
        const influxRes = await $fetch('http://localhost:4700/consumption/write', {
            method: "POST",
            body: {
                "uid" : "95lmGWfP9C", //TODO!: MAKE THIS DYNAMIC
                "orgId": deviceData.organisation.objectId,
                "deviceId": deviceData.objectId,
                "consumptionChange": deviceData.lastConsumptionChange,
                "allTimeConsumption": deviceData.lastTotalConsumption,
                "cost": 0.05,
                "clusterId": deviceData.group.objectId
            }
        })


        return resolve({ success: true, message: "Successfully updated device", influxRes })

    } catch (error: any) {
        console.log(error.response.data)
        return reject(error)
    }
}))