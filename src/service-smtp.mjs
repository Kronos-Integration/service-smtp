import { SMTPClient } from "smtp-client";
import {
  prepareAttributesDefinitions,
  boolean_attribute,
  hostname_attribute,
  port_attribute,
  username_attribute,
  password_attribute
} from "pacc";
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

  static attributes = prepareAttributesDefinitions(
    {
      host: {
        ...hostname_attribute,
        needsRestart: true,
        mandatory: true
      },
      port: {
        ...port_attribute,
        default: 25
      },
      secure: boolean_attribute,
      auth: {
        attributes: {
          username: username_attribute,
          password: password_attribute
        }
      }
    },
    Service.attributes
  );

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
