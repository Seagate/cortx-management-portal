export const accessCheck = function(this: any, role: string) {
  if (!role) {
    return false;
  }
  const [resource, action] = role.split(":");
  const userPermissions = this.$store.getters["createUser/getUserPermissions"];
  if (
    userPermissions &&
    userPermissions[resource] &&
    userPermissions[resource][action]
  ) {
    return true;
  }
  return false;
};
