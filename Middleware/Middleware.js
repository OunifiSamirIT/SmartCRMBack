const { User, Role } = require('./models');

const checkRole = (requiredRoles) => {
  return async (req, res, next) => {
    try {
      const user = await User.findByPk(req.userId, {
        include: [{
          model: Role,
          as: 'roles',
        }],
      });

      const userRoles = user.roles.map(role => role.name);

      if (requiredRoles.some(role => userRoles.includes(role))) {
        next();
      } else {
        res.status(403).send({ message: 'Access Denied' });
      }
    } catch (error) {
      res.status(500).send({ message: 'Internal Server Error' });
    }
  };
};

// Usage example
// app.post('/products', checkRole(['admin', 'commercial']), (req, res) => {
//   // Add product logic here
// });
