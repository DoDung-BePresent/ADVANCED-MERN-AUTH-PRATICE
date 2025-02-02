import { useAuthContext } from "@/context/auth-provider";

const Home = () => {
  const { user } = useAuthContext();

  return (
    <div className="h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="mb-4">
          <h1 className="text-xl font-medium">Home Page</h1>
          <p>Hello {user?.name}</p>
        </div>
      </div>
    </div>
  );
};

export default Home;
