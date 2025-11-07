import test from "ava";
import { StandaloneServiceProvider } from "@kronos-integration/service";
import { ServiceSMTP } from "@kronos-integration/service-smtp";

/*
Host	smtp.ethereal.email
Port	587
Security	STARTTLS
Username	abdiel.fritsch@ethereal.email
Password	c1Jr4vdW856YcUUD6S
*/

const config = {
  type: ServiceSMTP,

  host: "smtp.ethereal.email",
  port: 587,
  auth: {
    username: "abdiel.fritsch@ethereal.email",
    password: "c1Jr4vdW856YcUUD6S"
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
