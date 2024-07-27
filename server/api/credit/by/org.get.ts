import { useApiFetch } from "~/composables/use_api_fetch";

export default defineEventHandler(async (event) => {
    const queryParams = getQuery(event);
    const { id } = queryParams;

    try {
        // Check for the availability of a user id
        if (!id) throw Error("Org id required");

        const res = await useApiFetch('functions/getOrganisationById', {
            method: "POST",
            data: {
                orgId: id,
            }
        });

        return res.data.result.accountCredit;
    } catch (error) {
        const responseData = (error as any)?.response?.data ?? null;
        const errorMessage = (error as any)?.message ?? "Unknown error occurred";

        return { success: false, error: responseData, message: errorMessage };
    }
});
