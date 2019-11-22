import loginRoutes from "./login/routes";
import alertRoutes from "./alerts/routes";
import systemConfigRoutes from "./onboarding/routes";
import statsRoutes from "./stats/routes";
import udxRoutes from "./udx/routes";

export default [...loginRoutes, ...alertRoutes, ...systemConfigRoutes, ...statsRoutes, ...udxRoutes];
