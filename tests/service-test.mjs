import test from "ava";
import { StandaloneServiceProvider } from "@kronos-integration/service";
import { ServiceSMTP } from "@kronos-integration/service-smtp";

const config = {
  type: ServiceSMTP,
  host: "localhost",
  auth: {
    username: "xyz",
    password: "secret"
  }
};

test("service-smtp send", async t => {
  const sp = new StandaloneServiceProvider();
  const smtp = await sp.declareService(config);

  try {
    await smtp.send({
      from: "root@somewhere.com",
      to: "other@somewhere.com",
      data: "test#4"
    });
    t.true(true);
  } catch (e) {
    t.log(e);
    t.true(false);
  }
});
