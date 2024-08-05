
const config = {
  HOST: "localhost",
  USER: "root",
  PASSWORD: "",
  DB: "ERPArij",
  dialect: "mysql",
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000,
  },
};

export default config;
