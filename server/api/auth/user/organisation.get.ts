import {useApiFetch} from "~/composables/use_api_fetch";

export default defineEventHandler(async (event) => {
    const queryParams = getQuery(event);
    const { userId } = queryParams;
    
    try {
        // Check for the availability of a user id
        if (!userId) throw Error("User id required");

        const res = await useApiFetch('functions/getOrganisationsByUserId', {
            method: "POST",
            data: {
                userId
            }
        });

        return res.data.result ?? [];
    } catch (error) {
        const responseData = (error as any)?.response?.data ?? null;
        const errorMessage = (error as any)?.message ?? "Unknown error occurred";

        return { success: false, error: responseData, message: errorMessage };
    }
});
