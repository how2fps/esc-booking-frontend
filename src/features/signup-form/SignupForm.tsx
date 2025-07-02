import { useEffect, useState } from "react";

export const SignupForm = () => {
       const [email, setEmail] = useState<string>("");
       const [password, setPassword] = useState<string>("");
       const [confirmPassword, setConfirmPassword] = useState<string>("");
       useEffect(() => {
              console.log("SignupForm mounted");
       }, []);
       return (
              <div>
                     <form>
                            <label htmlFor="email">Email</label>
                            <input
                                   id="email"
                                   type="email"
                                   placeholder="Email"
                                   value={email}
                                   onChange={(e) => setEmail(e.target.value)}
                            />
                            <label htmlFor="password">Password</label>
                            <input
                                   id="password"
                                   type="password"
                                   placeholder="Password"
                                   value={password}
                                   onChange={(e) => setPassword(e.target.value)}
                            />
                            <label htmlFor="confirmPassword">Confirm Password</label>
                            <input
                                   id="confirmPassword"
                                   type="password"
                                   placeholder="Confirm Password"
                                   value={confirmPassword}
                                   onChange={(e) => setConfirmPassword(e.target.value)}
                            />
                            <button type="submit">Sign Up</button>
                     </form>
              </div>
       );
};
