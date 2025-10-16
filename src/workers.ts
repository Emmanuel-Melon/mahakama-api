import concurrently from "concurrently";

(async () => {
  await concurrently(
    [
      {
        command: "npm work:auth",
        name: "auth",
      },
    ],
    {
      killOthers: ["failure"],
    },
  );
  console.log("Workers running");
})();
