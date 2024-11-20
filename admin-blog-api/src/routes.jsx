import App from "./App";
import ErrorPage from "./components/errorPage";

const routes = [
  {
    path: "/",
    element: <App />,
    errorElement: <ErrorPage />
  },
  {
    path: "/:page",
    element: <App />,
  },
];

export default routes;