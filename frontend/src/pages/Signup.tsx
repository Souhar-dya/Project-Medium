import { Quote } from "../components/quote";
import { Signinpage } from "../components/signpage";
export const Signup = () => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2">
      <div>
        <Signinpage type="signup" />
      </div>
      <div className="invisible lg:visible">
        <Quote></Quote>
      </div>
    </div>
  );
};
