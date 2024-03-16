import {useApiFetch} from "~/composables/use_api_fetch";

export default defineEventHandler(async (event) => {
    const queryParams = getQuery(event);
    const { id } = queryParams;
    
    try {
        // Check for the availability of a user id
        if (!id) throw Error("Org id required");

        const res = await useApiFetch('functions/getDevicesByOrgId', {
            method: "POST",
            data: {
                orgId: id,
            }
        });

        return res.data.result ?? [];
    } catch (error) {
        console.log("FAILED TO LOAD DEVICES")
        return { success: false, error : (error as any).response.data, message :(error as any).message };
    }
});
