import { Button } from "@mui/material";
import {
  Mail,
  LockKeyhole,
  LogIn,
  Sparkles,
  Eye,
  EyeOff,
  ShieldCheck,
  Loader2,
} from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../../components/ZustandShare/AuthZuts";
import { toast } from "sonner";
import pentecost from "../../assets/Pentecost.jpg"

function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
const [isLoading, setIsLoading] = useState(false)


  const {Login, currentUser} = useAuthStore()

const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
  e.preventDefault();

  try {
    setIsLoading(true);

    const success = await Login(email, password);

    if (success) {
      navigate("/dashboard");

      // console.log(currentUser)
    }

  } catch (error) {
    // store handles errors
  } finally {
    setIsLoading(false);
  }
};

return (
  <div className="min-h-screen bg-white text-slate-800">
    <div className="grid min-h-screen lg:grid-cols-2">
      
      {/* LEFT SIDE — THE PENTECOST */}
    <div className="relative hidden overflow-hidden bg-gradient-to-br from-blue-950 via-blue-900 to-blue-700 lg:flex">
  <div className="absolute -right-24 -top-24 h-80 w-80 rounded-full bg-amber-400/10 blur-3xl" />
  <div className="absolute -bottom-24 -left-20 h-80 w-80 rounded-full bg-blue-300/10 blur-3xl" />

  <div className="relative z-10 flex w-full flex-col justify-between p-8 xl:p-10">
    <div>
      <div className="mb-8 flex items-center gap-3">
        <img
          src={pentecost}
          alt="The Church of Pentecost"
          className="h-12 w-12 rounded-lg object-cover"
        />
        <div>
          <p className="text-sm font-semibold text-white">
            THE CHURCH OF PENTECOST
          </p>
          <p className="text-xs text-blue-100/70">
            General Headquarters
          </p>
        </div>
      </div>

      <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1.5 text-xs font-medium text-amber-300">
        <Sparkles size={14} />
        Pent Requisition
      </span>

      <h1 className="mt-6 text-3xl font-semibold leading-tight text-white xl:text-4xl">
        Request.
        <span className="block text-amber-300">Approve.</span>
        Receive.
      </h1>

      <p className="mt-4 max-w-sm text-sm leading-6 text-blue-100/75">
        Manage requisitions, track approvals, and account for items
        from request to delivery.
      </p>
    </div>

    <div className="mt-10">
      <div className="mb-3 h-px w-12 bg-amber-400" />
      <p className="text-xs text-blue-100/65">
        Simple. Transparent. Accountable.
      </p>
      <p className="mt-5 text-xs text-blue-100/45">
        © {new Date().getFullYear()} The Church of Pentecost
      </p>
    </div>
  </div>
</div>

      {/* RIGHT SIDE — LOGIN FORM */}
      <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-gradient-to-br from-white via-white to-blue-50/70 px-5 py-10 sm:px-10">
        <div className="pointer-events-none absolute -right-24 -top-24 h-64 w-64 rounded-full bg-amber-100/50 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-24 -left-24 h-64 w-64 rounded-full bg-blue-100/60 blur-3xl" />

        <div className="relative z-10 w-full max-w-md">
          {/* MOBILE BRAND */}
          <div className="mb-10 flex items-center gap-3 lg:hidden">
            <img
              src={pentecost}
              alt="The Church of Pentecost"
              className="h-12 w-12 rounded-xl object-cover"
            />
            <div>
              <p className="text-sm font-bold text-blue-950">
                THE CHURCH OF PENTECOST
              </p>
              <p className="mt-1 text-xs text-slate-500">
                General Headquarters
              </p>
            </div>
          </div>

          <div className="mb-8">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-amber-50 px-3 py-1.5 text-xs font-semibold text-amber-700">
              <span className="h-1.5 w-1.5 rounded-full bg-amber-500" />
              Welcome back
            </div>

            <h2 className="text-xl font-semibold tracking-tight text-slate-900">
              Sign in to your account
            </h2>

            <p className="mt-3 text-sm leading-6 text-slate-500">
              Access your requisitions
              using your registered credentials.
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            {/* EMAIL */}
            <div>
              <label
                htmlFor="email"
                className="mb-2 block text-sm font-medium text-slate-700"
              >
                Email address
              </label>

              <div className="group relative">
                <Mail
                  size={18}
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 transition group-focus-within:text-blue-600"
                />

                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  required
                  className="w-full rounded-xl border-0 bg-slate-50/80 py-3.5 pl-11 pr-4 text-sm text-slate-800 outline-none ring-1 ring-slate-200/80 transition placeholder:text-slate-400 hover:bg-white hover:ring-blue-200 focus:bg-white focus:ring-2 focus:ring-blue-500/50"
                />
              </div>
            </div>

            {/* PASSWORD */}
            <div>
              <div className="mb-2 flex items-center justify-between">
                <label
                  htmlFor="password"
                  className="text-sm font-medium text-slate-700"
                >
                  Password
                </label>

                <button
                  type="button"
                  className="text-xs font-medium text-blue-700 transition hover:text-amber-600"
                >
                  Forgot password?
                </button>
              </div>

              <div className="group relative">
                <LockKeyhole
                  size={18}
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 transition group-focus-within:text-blue-600"
                />

                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  required
                  className="w-full rounded-xl border-0 bg-slate-50/80 py-3.5 pl-11 pr-12 text-sm text-slate-800 outline-none ring-1 ring-slate-200/80 transition placeholder:text-slate-400 hover:bg-white hover:ring-blue-200 focus:bg-white focus:ring-2 focus:ring-blue-500/50"
                />

                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 transition hover:text-blue-700"
                >
                  {showPassword ? (
                    <EyeOff size={18} />
                  ) : (
                    <Eye size={18} />
                  )}
                </button>
              </div>
            </div>

            {/* SIGN IN */}
            <Button
              type="submit"
              disabled={isLoading}
              fullWidth
              variant="contained"
              disableElevation
              sx={{
                mt: "8px",
                py: 1.6,
                borderRadius: "12px",
                textTransform: "none",
                fontSize: "14px",
                fontWeight: 600,
                color: "#ffffff",
                background: "linear-gradient(100deg, #173f83 0%, #2459a7 72%, #d99a22 150%)",
                boxShadow: "0 6px 18px rgba(36, 89, 167, 0.14)",
                "&:hover": {
                  background: "linear-gradient(100deg, #12346f 0%, #1d4d94 72%, #c58b1d 150%)",
                  boxShadow: "0 8px 22px rgba(36, 89, 167, 0.2)",
                },
                "&.Mui-disabled": {
                  color: "#ffffff",
                  opacity: 0.7,
                },
              }}
            >
              {isLoading ? (
                <span className="flex items-center gap-2">
                  <Loader2 className="animate-spin" size={18} />
                  Signing you in...
                </span>
              ) : (
                <span className="flex items-center justify-center gap-2">
                  Sign in
                  <LogIn size={17} />
                </span>
              )}
            </Button>
          </form>

          <div className="mt-8 flex items-center justify-center gap-2 text-xs text-slate-400">
            <ShieldCheck size={15} className="text-blue-600" />
            Secure access to your work platform
          </div>

         
        </div>
      </div>
    </div>
  </div>
);
}

export default Login;