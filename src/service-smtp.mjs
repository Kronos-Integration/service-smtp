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
      createAttributes({
        host: {
          needsRestart: true,
          mandatory: true,
          type: "string"
        },
        port: {
          type: "number",
          default: 25
        },
        secure: {
          type: "boolean",
          default: false
        },
        auth: {
          attributes: {
            username: {
              type: "string",
              private: true
            },
            password: {
              type: "string",
              private: true
            }
          }
        }
      }),
      Service.configurationAttributes
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
      port: this.port,
      secure: this.secure
    });

    await client.connect();
    await client.ehlo();
    if (client.hasExtension("STARTTLS")) {
      await client.secure();
      await client.ehlo();
    }

    await client.authLogin(this.auth);
    await client.mail({ from: request.from });
    await client.rcpt({ to: request.to });
    await client.data(request.data);
    await client.quit();
  }
}

export default ServiceSMTP;
