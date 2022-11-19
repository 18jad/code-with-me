import toast from "react-hot-toast";

export const notificationToaster = (message, error = false) => {
  toast[error ? "error" : "success"](message, {
    style: {
      borderRadius: "8px",
      background: "#fff2",
      border: "1px solid #fff6",
      backdropFilter: "blur(10px)",
      color: "#fff",
      fontSize: "14px",
    },
  });
};
