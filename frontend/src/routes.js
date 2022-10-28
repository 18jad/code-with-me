import Authentication from "views/Authentication";
import Home from "views/Home";
import NotFound from "views/NotFound";
import Profile from "views/Profile";
import User from "views/User";

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

// TODO: Modify condition when authentication is implemented
const isAuthenticated = true;

const routes = [
  {
    path: "/",
    component: <Home />,
    isProtected: false,
  },
  {
    path: "/auth", // TODO: Make the route protected and redirect to /.. if the user is authenticated
    component: <Authentication />,
    isProtected: false,
  },
  {
    path: "/profile",
    isProtected: true,
    condition: isAuthenticated,
    access: <Profile />,
    redirect: "/login",
  },
  {
    path: "/user/:id",
    isProtected: true,
    condition: isAuthenticated,
    access: <User />,
    redirect: "/login",
  },
  {
    path: "*",
    component: <NotFound />,
    isProtected: false,
  },
];

export default routes;
