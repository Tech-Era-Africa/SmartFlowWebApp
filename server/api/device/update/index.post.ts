import { useApiFetch } from "~/composables/use_api_fetch";


export default defineEventHandler(async (event) => {
    const { eui, uid, totalConsumption, valveState } = await readBody(event)

    try {

        if (!uid || uid == undefined) throw Error("UID is required")
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
            throw Error("Could not update device")
        }

        const deviceData = res.data.result.data;

        // Send entry to Influx db
        const baseUrl = useRuntimeConfig().INFLUX_SERVER_BASE_URL
        const influxData = {
            "uid": uid,
            "orgId": deviceData.organisation.objectId,
            "deviceId": deviceData.objectId,
            "consumptionChange": deviceData.lastConsumptionChange > 0 ? deviceData.lastConsumptionChange : 0.0000001, //?Influx throws an error when the value is 0, type needs to be a float of some kind
            "allTimeConsumption": deviceData.lastTotalConsumption > 0 ? deviceData.lastTotalConsumption : 0.0000001, //?Influx throws an error when the value is 0, type needs to be a float of some kind
            "cost": 0.05,
            "clusterId": deviceData.group.objectId
        }

        const influxRes = await $fetch(`${baseUrl}/consumption/write`, {
            method: "POST",
            body: influxData
        })


        return { success: true, message: "Successfully updated device", data:influxRes }

    } catch (error: any) {
        const responseData = (error as any)?.response?.data ?? null;
        const errorMessage = (error as any)?.message ?? "Unknown error occurred";

        return { success: false, error: responseData, message: errorMessage };
    }
})