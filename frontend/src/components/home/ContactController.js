export class ContactController {
  #email_regex = new RegExp(
    "^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$",
  );
  #send_email_url = "/user/contact_me";

  checkLength(min, max) {
    return (value) => {
      if (typeof value === "string") {
        return (
          value &&
          value !== undefined &&
          value.trim().length >= min &&
          value.length <= max
        );
      } else {
        return (
          value &&
          value !== undefined &&
          value.length >= min &&
          value.length <= max
        );
      }
    };
  }
}
