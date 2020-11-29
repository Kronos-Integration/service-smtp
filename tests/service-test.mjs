import test from "ava";
import { StandaloneServiceProvider } from "@kronos-integration/service";
import { ServiceSMTP } from "@kronos-integration/service-smtp";


const config = {
  type: ServiceSMTP,
  host: 'localhost',
  port: 587,
};

test("service-smtp send", async t => {
  const sp = new StandaloneServiceProvider();
  const smtp = await sp.declareService(config);

  t.deepEqual(
    await smtp.send({ username: "user1", password: "test" }),
    {  }
  );
});
