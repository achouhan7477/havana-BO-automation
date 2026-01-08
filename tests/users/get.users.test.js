const apiClient = require("../../src/utils/apiClient");

test("should fetch users list", async () => {
  const res = await apiClient.get("/api/users");

  expect(res.status).toBe(200);
  expect(res.data).toBeDefined();
});
