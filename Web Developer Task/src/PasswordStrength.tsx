import { useState, useEffect } from "react";
import { Check, X } from "lucide-react";

export default function PasswordStrength({ password }) {
  // Make sure we handle undefined or null password by defaulting to empty string
  const safePassword = password || "";
  const [passwordStrength, setPasswordStrength] = useState(0);

  useEffect(() => {
    // Calculate password strength
    if (!safePassword) {
      setPasswordStrength(0);
      return;
    }

    let strength = 0;
    // Length check
    if (safePassword.length >= 8) strength += 1;
    // Contains number
    if (/\d/.test(safePassword)) strength += 1;
    // Contains lowercase
    if (/[a-z]/.test(safePassword)) strength += 1;
    // Contains uppercase
    if (/[A-Z]/.test(safePassword)) strength += 1;
    // Contains special character
    if (/[^A-Za-z0-9]/.test(safePassword)) strength += 1;

    setPasswordStrength(strength);
  }, [safePassword]);

  const getPasswordStrengthColor = () => {
    if (passwordStrength <= 1) return "bg-red-500";
    if (passwordStrength <= 3) return "bg-yellow-500";
    return "bg-green-500";
  };

  const getPasswordStrengthText = () => {
    if (!safePassword) return "";
    if (passwordStrength <= 1) return "Weak";
    if (passwordStrength <= 3) return "Medium";
    return "Strong";
  };

  // Define test functions carefully to avoid null/undefined errors
  const checkLength = () => safePassword.length >= 8;
  const checkNumber = () => /\d/.test(safePassword);
  const checkLowercase = () => /[a-z]/.test(safePassword);
  const checkUppercase = () => /[A-Z]/.test(safePassword);
  const checkSpecial = () => /[^A-Za-z0-9]/.test(safePassword);

  const passwordRequirements = [
    { text: "At least 8 characters", test: checkLength },
    { text: "Contains a number", test: checkNumber },
    { text: "Contains a lowercase letter", test: checkLowercase },
    { text: "Contains an uppercase letter", test: checkUppercase },
    { text: "Contains a special character", test: checkSpecial },
  ];

  return (
    <>
      {/* Password strength meter */}
      <div className="mt-2">
        <div className="flex items-center justify-between mb-1">
          <div className="text-xs font-medium text-gray-500">
            Password strength
          </div>
          <div
            className={`text-xs font-medium ${
              passwordStrength <= 1
                ? "text-red-500"
                : passwordStrength <= 3
                ? "text-yellow-500"
                : "text-green-500"
            }`}
          >
            {getPasswordStrengthText()}
          </div>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className={`${getPasswordStrengthColor()} h-2 rounded-full transition-all duration-300`}
            style={{ width: `${(passwordStrength / 5) * 100}%` }}
          ></div>
        </div>
      </div>

      {/* Password requirements */}
      <div className="mt-2 space-y-1">
        {passwordRequirements.map((req, index) => (
          <div key={index} className="flex items-center">
            {req.test() ? (
              <Check className="h-4 w-4 text-green-500 mr-1" />
            ) : (
              <X className="h-4 w-4 text-red-500 mr-1" />
            )}
            <span
              className={`text-xs ${
                req.test() ? "text-green-600" : "text-gray-500"
              }`}
            >
              {req.text}
            </span>
          </div>
        ))}
      </div>
    </>
  );
}
