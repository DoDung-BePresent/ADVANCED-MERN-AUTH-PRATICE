import { Loading } from "./Loading";

const LoadingScreen = () => {
  return (
    <div className="flex h-screen items-center justify-center">
      <Loading className="h-10 w-10" />
    </div>
  );
};

export default LoadingScreen;
