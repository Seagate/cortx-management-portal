import { getSessionKeys } from "./providers/SessionProvider";

export const getSessionKey = async (user: string) => {
  // if (q.length < 3) {
  //   return {
  //     type: "FeatureCollection",
  //     features: []
  //   };
  // }

  return await getSessionKeys(user);
};
