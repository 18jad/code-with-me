import Cookies from "js-cookie";
import Authentication from "views/Authentication/Authentication";
import ResetPassword from "views/Authentication/ResetPassword";
import Editor from "views/Editor/Editor";
import Home from "views/Home/Home";
import NotFound from "views/NotFound/NotFound";
import Profile from "views/Profile/Profile";
import User from "views/Profile/User";

/**
 * @type {Array}
 * @description The routes of the application
 * @property {String} path The path of the route
 * @property {React.Component} component The component of the route
 * @property {Boolean} isProtected If the route is protected
 * @property {Boolean} condition protected route condition
 * @property {React.Component} access The component to be rendered if the route is protected and the condition is met (true)
 * @property {String} redirect If the route is protected redirect to this path if condition not met (false)
 * @example Protected
 *
 * {
 *      path: "/profile",
 *      isProtected: true,
 *      condition: isAuthenticated,
 *      access: <Profile />,
 *      redirect: "/login"
 * }
 *
 * @example Not Protected
 * {
 *      path: "/",
 *      component: Home,
 *      isProtected: false
 * }
 *
 */

// Check if user is authenticated
const authCookies = Cookies.get("persist:user"),
  { loggedIn, user } = (authCookies && JSON.parse(authCookies)) || {
    loggedIn: false,
    user: null,
  },
  isAuthenticated = Boolean(
    loggedIn &&
      loggedIn !== "undefined" &&
      loggedIn === "true" &&
      !!loggedIn &&
      !!user,
  );

const routes = [
  {
    path: "/",
    component: <Home />,
    isProtected: false,
  },
  {
    path: "/authenticate",
    isProtected: true,
    condition: !isAuthenticated,
    access: <Authentication />,
    redirect: "/profile",
  },
  {
    path: "/profile",
    isProtected: true,
    condition: isAuthenticated,
    access: <Profile />,
    redirect: "/authenticate",
  },
  {
    path: "/user/:id",
    isProtected: true,
    condition: isAuthenticated,
    access: <User />,
    redirect: "/authenticate",
  },
  {
    path: "*",
    component: <NotFound />,
    isProtected: false,
  },
  {
    path: "/project/:id",
    isProtected: true,
    condition: isAuthenticated,
    access: <Editor />,
    redirect: "/authenticate",
  },
  {
    path: "/reset-password/:token",
    component: <ResetPassword />,
    isProtected: false,
  },
];

export default routes;
