import Cookies from "cookies-js";
import routes from "routes";

/**
 * @description Logout logged in user, expire the cookie, make routes strictly protected and redirect to login page
 * @param {useNavigate: react-route-dom} navigate
 * @returns {void}
 */
export const logout = (navigate) => {
  Cookies.expire("persist:user");
  routes.forEach((route) => {
    route.condition = !!(route.path === "/authenticate");
  });
  navigate("/authenticate");
};
