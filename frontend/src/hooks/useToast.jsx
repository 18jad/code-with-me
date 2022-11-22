import { useEffect, useState } from "react";
import t, { useToasterStore } from "react-hot-toast";

// HOOK TO LIMIT THE NUMBER OF TOASTS, SINCE THAT THIS LIBRARY DOESN'T HAVE A BUILT-IN LIMIT SETTER

const useToast = (limit = 3) => {
  const { toasts } = useToasterStore();

  const [toastLimit, setToastLimit] = useState(limit);

  useEffect(() => {
    toasts
      .filter((tt) => tt.visible)
      .filter((_, i) => i >= toastLimit)
      .forEach((tt) => t.dismiss(tt.id));
  }, [toasts]);

  const toast = {
    ...t,
    setLimit: (l) => {
      if (l !== toastLimit) {
        setToastLimit(l);
      }
    },
  };

  return { toast };
};

export default useToast;
