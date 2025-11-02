"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function CustomerLoginPage() {
  const router = useRouter();
  const [phone, setPhone] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const result = await signIn('phone', {
        phone,
        redirect: false,
      });

      if (result?.ok) {
        router.push('/profile');
      } else {
        setError("شماره تلفن اشتباه است یا سفارشی ثبت نکرده‌اید");
      }
    } catch (err) {
      console.error('Login error:', err);
      setError("خطا در ورود. لطفاً دوباره تلاش کنید.");
    } finally {
      setIsLoading(false);
    }
  };

  // Validate phone format
  const validatePhone = (phoneNumber: string) => {
    const iranPattern = /^09\d{9}$/;
    const afghanPattern = /^07\d{8}$/;
    return iranPattern.test(phoneNumber) || afghanPattern.test(phoneNumber);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        {/* Logo and Title */}
        <div className="text-center">
          <div className="flex justify-center">
            <div className="bg-white p-4 rounded-full shadow-lg">
              <svg className="w-16 h-16 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
          </div>
          <h2 className="mt-6 text-3xl font-bold text-gray-900">
            ورود مشتریان
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            برای مشاهده سفارشات خود، شماره تلفن خود را وارد کنید
          </p>
        </div>

        {/* Login Form */}
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="bg-white rounded-xl shadow-lg p-8 space-y-6">
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                {error}
              </div>
            )}

            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                شماره تلفن
              </label>
              <input
                id="phone"
                name="phone"
                type="tel"
                autoComplete="tel"
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="appearance-none relative block w-full px-4 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm text-center"
                placeholder="09123456789 یا 0791234567"
              />
              <p className="mt-2 text-xs text-gray-500 text-center">
                ایران (09xxxxxxxxx) یا افغانستان (07xxxxxxxx)
              </p>
            </div>

            <div>
              <button
                type="submit"
                disabled={isLoading || !validatePhone(phone)}
                className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
              >
                {isLoading ? (
                  <div className="flex items-center space-x-2">
                    <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <span className="text-white">در حال ورود...</span>
                  </div>
                ) : (
                  "ورود"
                )}
              </button>
            </div>

            <div className="text-center">
              <Link
                href="/"
                className="text-sm text-indigo-600 hover:text-indigo-800 hover:underline"
              >
                بازگشت به صفحه اصلی
              </Link>
            </div>
          </div>

          {/* Info Box */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-start">
              <svg className="w-5 h-5 text-blue-600 mt-0.5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <div>
                <h5 className="text-sm font-medium text-blue-900 mb-1">نکته مهم</h5>
                <p className="text-sm text-blue-700">
                  فقط افرادی که قبلاً سفارش ثبت کرده‌اند می‌توانند وارد شوند. اگر اولین بار است، لطفاً ابتدا یک سفارش ثبت کنید.
                </p>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

