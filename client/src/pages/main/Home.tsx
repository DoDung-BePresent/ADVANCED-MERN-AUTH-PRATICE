import EnableMFA from "@/components/mfa/EnableMFA";
import RevokeMFA from "@/components/mfa/RevokeMFA";
import { Session } from "@/components/Session";
import { useAuthContext } from "@/context/auth-provider";

const Home = () => {
  const { user } = useAuthContext();
  return (
    <div className="mx-20 mt-14 h-[calc(100vh-56px)] pt-10">
      <div className="mx-auto max-w-screen-xl">
        <div className="mb-8">
          <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl">
            Squezzy App
          </h1>
        </div>
        <Session
          title="Enable 2 Factor Authentication"
          label={
            user?.userPreferences.enable2FA && (
              <span className="rounded-md bg-green-100 p-1 px-2 text-sm text-green-500">
                Enabled
              </span>
            )
          }
          desc="Protect your account by adding an extra layer of security."
        >
          {user?.userPreferences.enable2FA ? <RevokeMFA /> : <EnableMFA />}
        </Session>
      </div>
    </div>
  );
};

export default Home;
