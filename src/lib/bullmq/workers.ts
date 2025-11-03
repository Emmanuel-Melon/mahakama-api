import concurrently from "concurrently";

(async () => {
  await concurrently(
    [
      {
        command: "npm run workers:auth",
        name: "auth",
      },
    ],
    {
      killOthers: ["failure"],
    },
  );
  console.log("Workers running");
})();
