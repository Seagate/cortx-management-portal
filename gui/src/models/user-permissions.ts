export const userPermissions = {
  manage: {
    alerts: {
      list: true,
      update: true,
      delete: true
    },
    stats: {
      list: true
    },
    capacity: {
      list: true
    },
    sysconfig: {
      list: true,
      update: true,
      delete: true
    },
    users: {
      list: true,
      update: true,
      delete: true,
      create: true
    },
    s3accounts: {
      list: true,
      update: true,
      delete: true,
      create: true
    },
    s3iamusers: {
      list: true,
      delete: true,
      create: true
    },
    s3buckets: {
      list: true,
      update: true,
      delete: true,
      create: true
    }
  },
  monitor: {
    alerts: {
      list: true
    },
    stats: {
      list: true
    },
    capacity: {
      list: true
    },
    sysconfig: {
      list: true
    },
    users: {
      list: true
    },
    s3accounts: {
      list: true
    }
  }
};
