const whitelist: String[] = [
  "http://localhost:3000",
  "http://127.0.0.0.1:3000",
  "https://your-site.com",
];

const corsOptions: Object = {
  origin: function (origin: any, callback: any) {
    if (whitelist.indexOf(origin) !== -1 || !origin) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
};

export default corsOptions;
