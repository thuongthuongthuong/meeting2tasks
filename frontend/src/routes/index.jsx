import { Suspense, lazy } from "react";
import { Navigate, useRoutes } from "react-router-dom";
// components
import LoadingScreen from "../components/LoadingScreen";
// ----------------------------------------------------------------------

const Loadable = (Component) => {
  const WrappedComponent = (props) => {
    return (
      <Suspense fallback={<LoadingScreen />}>
        <Component {...props} />
      </Suspense>
    );
  };
  WrappedComponent.displayName = `Loadable(${Component.name || "Component"})`;

  return WrappedComponent;
};

const fakeDelay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

export default function Router() {
  return useRoutes([
    // Main Routes
    {
      path: "*",
      children: [
        { path: "maintenance", element: <Maintenance /> },
        { path: "500", element: <Page500 /> },
        { path: "404", element: <Page404 /> },
        { path: ":id", element: <Karban /> },
        { path: "*", element: <Navigate to="/404" replace /> },
      ],
    },
  ]);
}



const Page500 = Loadable(
  lazy(() =>  import("../pages/Page500"))
);

const Page404 = Loadable(
  lazy(() => import("../pages/Page404"))
);

const Maintenance = Loadable(
  lazy(() => import("../pages/Maintenance"))
);

const Karban = Loadable(
  lazy(() => import("../pages/Karban"))
);
