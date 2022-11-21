export const contactHTML = (name: string, email: string, message: string) => {
  return `
        <p style="font-size: 16px;"><b>Sender name: </b><span>${name}</span></p></ br>
        <p style="font-size: 16px;"><b>Sender email: </b><span>${email}</span></p></ br>
        <p style="font-size: 16px;"><b>Message: </b></p></ br>
        <span style="background: #f5f5f5; padding: 2px; font-size: 16px;">${message}</span>
    `;
};
