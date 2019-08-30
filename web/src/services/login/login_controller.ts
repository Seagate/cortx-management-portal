import { getSessionKeys } from "./providers/session_provider";

export const getSessionKey = async (user: string) => {
  // if (q.length < 3) {
  //   return {
  //     type: "FeatureCollection",
  //     features: []
  //   };
  // }

  return await getSessionKeys(user);
};
