import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";

interface PasswordInputProps {
    password: string;
    setPassword: (value: string) => void;
    showPassword: boolean;
    togglePasswordVisibility: () => void;
}

const PasswordInput: React.FC<PasswordInputProps> = ({
    password,
    setPassword,
    showPassword,
    togglePasswordVisibility,
}) => {
    const [isFocused, setIsFocused] = useState(false);

    return (
        <div className="max-w-sm relative">
            <div className="flex">
                <div className="relative flex-1">
                    {/* Password Strength Dropdown */}
                    {isFocused && password && (
                        <div className="absolute bottom-full mb-2 w-full bg-white shadow-md rounded-lg p-4">
                            <h4 className="text-sm font-semibold text-gray-800">
                                Your password must contain:
                            </h4>
                            <ul className="space-y-1 text-sm text-gray-500">
                                {[
                                    {
                                        rule: "min-length",
                                        text: "Minimum 6 characters",
                                        valid: password.length >= 6,
                                    },
                                    {
                                        rule: "lowercase",
                                        text: "Contains lowercase",
                                        valid: /[a-z]/.test(password),
                                    },
                                    {
                                        rule: "uppercase",
                                        text: "Contains uppercase",
                                        valid: /[A-Z]/.test(password),
                                    },
                                    {
                                        rule: "numbers",
                                        text: "Contains numbers",
                                        valid: /\d/.test(password),
                                    },
                                    {
                                        rule: "special-characters",
                                        text: "Contains special characters",
                                        valid: /[!@#$%^&*(),.?":{}|<>]/.test(
                                            password
                                        ),
                                    },
                                ].map(({ rule, text, valid }) => (
                                    <li
                                        key={rule}
                                        className={`flex items-center gap-x-2 ${
                                            valid
                                                ? "text-teal-500"
                                                : "text-gray-500"
                                        }`}
                                    >
                                        {valid ? (
                                            <svg
                                                className="shrink-0 w-4 h-4 text-teal-500"
                                                xmlns="http://www.w3.org/2000/svg"
                                                viewBox="0 0 24 24"
                                                fill="none"
                                                stroke="currentColor"
                                                strokeWidth="2"
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                            >
                                                <polyline points="20 6 9 17 4 12"></polyline>
                                            </svg>
                                        ) : (
                                            <svg
                                                className="shrink-0 w-4 h-4 text-gray-500"
                                                xmlns="http://www.w3.org/2000/svg"
                                                viewBox="0 0 24 24"
                                                fill="none"
                                                stroke="currentColor"
                                                strokeWidth="2"
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                            >
                                                <path d="M18 6 6 18"></path>
                                                <path d="m6 6 12 12"></path>
                                            </svg>
                                        )}
                                        {text}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}

                    {/* Password Input */}
                    <input
                        type={showPassword ? "text" : "password"}
                        id="password"
                        className=""
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        onFocus={() => setIsFocused(true)}
                        onBlur={() => setIsFocused(false)}
                    />

                    {/* Toggle Visibility Button */}
                    <button
                        type="button"
                        onClick={togglePasswordVisibility}
                        className="absolute right-3 top-1/2 -translate-y-1/2 bg-transparent text-gray-500 hover:text-gray-700 p-0 border-none focus:ring-0 focus:outline-none"
                    >
                        {showPassword ? (
                            <EyeOff size={25} className="pointer-events-none" />
                        ) : (
                            <Eye size={25} className="pointer-events-none" />
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default PasswordInput;
