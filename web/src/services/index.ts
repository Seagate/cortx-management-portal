import loginRoutes from "./login/routes";
import alertRoutes from "./alerts/routes";
import systemConfigRoutes from "./onboarding/routes";

export default [...loginRoutes, ...alertRoutes, ...systemConfigRoutes];
