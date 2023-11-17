export const useUseStatusName = (statusId:string) => {
  const statuses:any = {
    "t0H56JNEHb" : "Inactive",
    "heWFtvGqhO" : "Active"
  }

  return statuses[statusId] ?? "Invalid"
}
