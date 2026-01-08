const apiClient = require("../../src/utils/apiClient");

describe("BO Login Test (Token Based)", () => {
  test(
    "should allow access to protected BO API with valid token",
    async () => {
      const res = await apiClient.get("/api/users");

      expect(res.status).toBe(200);
      expect(res.data).toBeDefined();
    },
    15000 // ⬅️ explicit timeout
  );
});
