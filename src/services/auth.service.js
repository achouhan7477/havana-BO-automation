const apiClient = require("../utils/apiClient");

let sessionCookie = null;

const getCsrfToken = async () => {
  const res = await apiClient.get("/api/auth/csrf", {
    validateStatus: () => true,
  });

  return res.data.csrfToken;
};

const loginAdmin = async () => {
  const csrfToken = await getCsrfToken();

  const payload = new URLSearchParams({
    csrfToken,
    email: process.env.ADMIN_EMAIL,
    password: process.env.ADMIN_PASSWORD,
    redirect: "false",
  });

  const res = await apiClient.post(
    "/api/auth/callback/credentials",
    payload,
    {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      maxRedirects: 0,
      validateStatus: () => true,
    }
  );

  const cookies = res.headers["set-cookie"];
  if (cookies) {
    sessionCookie = cookies.join("; ");
    global.sessionCookie = sessionCookie;
  }

  return res;
};

module.exports = { loginAdmin };
