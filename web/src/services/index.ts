import loginRoutes from "./login/routes";
import alertRoutes from "./alerts/routes";
import systemConfigRoutes from "./onboarding/routes";
import statsRoutes from "./stats/routes";

export default [...loginRoutes, ...alertRoutes, ...systemConfigRoutes, ...statsRoutes];
