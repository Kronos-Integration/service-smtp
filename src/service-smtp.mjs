import { SMTPClient } from "smtp-client";
import { mergeAttributes, createAttributes } from "model-attributes";
import { Service } from "@kronos-integration/service";

/**
 * SMTP
 */
export class ServiceSMTP extends Service {
  /**
   * @return {string} 'smtp'
   */
  static get name() {
    return "smtp";
  }

  static get configurationAttributes() {
    return mergeAttributes(
      Service.configurationAttributes,
      createAttributes({
        host: {
          needsRestart: true,
          mandatory: true,
          type: "string"
        },
        port: {
          type: "number"
        }
      })
    );
  }

  static get endpoints() {
    return {
      ...super.endpoints,
      send: {
        receive: "send"
      }
    };
  }

  async send(request) {
    const client = new SMTPClient({
      host: this.host,
      port: this.port
    });

    await client.connect();
    await client.greet({ hostname: "mx.domain.com" }); // runs EHLO command or HELO as a fallback
    await client.authPlain({ username: "alice@example.com", password: "secret" });
    await client.mail({ from: "from@sender.com" }); // runs MAIL FROM command
    await client.rcpt({ to: "to@recipient.com" }); // runs RCPT TO command (run this multiple times to add more recii)
    await client.data("mail source"); // runs DATA command and streams email source
    await client.quit();
  }
}

export default ServiceSMTP;
