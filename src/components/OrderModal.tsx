"use client";

import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { signIn } from "next-auth/react";
import { useOrderModal } from "@/contexts/OrderModalContext";

interface OrderModalProps {
  isOpen?: boolean;
  onClose?: () => void;
  productId?: string;
  productName?: string;
  productPrice?: number;
  userId?: string;
}

export function OrderModal({
  isOpen: propIsOpen,
  onClose: propOnClose,
  productId: propProductId,
  productName: propProductName,
  productPrice: propProductPrice,
  userId: propUserId,
}: OrderModalProps = {}) {
  // Use context for global modal, but allow props override for backward compatibility
  const context = useOrderModal();
  const isOpen = propIsOpen !== undefined ? propIsOpen : context.isModalOpen;
  const onClose = propOnClose !== undefined ? propOnClose : context.closeModal;
  const productId = propProductId !== undefined ? propProductId : context.productId;
  const productName = propProductName !== undefined ? propProductName : context.productName;
  const productPrice = propProductPrice !== undefined ? propProductPrice : context.productPrice;
  const userId = propUserId !== undefined ? propUserId : context.userId;
  
  // Initialize formData with product price as default if available
  const [formData, setFormData] = useState({
    quantity: 1,
    desiredPrice: productPrice !== undefined && productPrice !== null ? (productPrice * 1).toString() : "",
    customerPhone: "",
  });

  // Update desiredPrice when productPrice changes (when modal opens with a new product)
  useEffect(() => {
    if (isOpen) {
      if (productPrice !== undefined && productPrice !== null) {
        setFormData((prev) => ({
          ...prev,
          desiredPrice: (productPrice * prev.quantity).toString(),
        }));
      } else {
        setFormData((prev) => ({
          ...prev,
          desiredPrice: "",
        }));
      }
    } else {
      // Reset form when modal closes
      setFormData({
        quantity: 1,
        desiredPrice: "",
        customerPhone: "",
      });
      setShowQuantityDropdown(false);
      setQuantitySearch("");
      setSubmitMessage("");
      setOrderReceipt(null);
    }
  }, [isOpen, productPrice]);
  const [showQuantityDropdown, setShowQuantityDropdown] = useState(false);
  const [quantitySearch, setQuantitySearch] = useState("");
  const quantityRef = useRef<HTMLDivElement>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState("");
  const [orderReceipt, setOrderReceipt] = useState<{
    id: string;
    productName: string;
    quantity: number;
    desiredPrice: number;
    status: string;
    createdAt: string;
  } | null>(null);

  const quantityOptions = [1, 10, 20, 30, 50, 100, 200, 300, 500, 1000, 2000];

  // Format number to Persian readable format with commas
  const formatNumber = (num: number): string => {
    const numStr = num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");

    if (num >= 1000000) {
      return `${numStr} `;
    } else if (num >= 1000) {
      return `${numStr}`;
    }
    return numStr;
  };

  // Format decimal number to Persian readable format with decimal places
  const formatDecimalNumber = (num: number): string => {
    // Convert to string to preserve decimal precision
    const numStr = num.toString();
    const parts = numStr.split(".");
    
    // Check if number has significant decimal part
    if (parts.length > 1) {
      const decimalPart = parts[1].replace(/0+$/, ""); // Remove trailing zeros
      
      if (decimalPart.length > 0) {
        // Calculate decimal places (max 4)
        const decimalPlaces = Math.min(decimalPart.length, 4);
        
        // Format with Persian digits, preserving exact decimal places
        return new Intl.NumberFormat("fa-IR", {
          minimumFractionDigits: decimalPlaces,
          maximumFractionDigits: 4,
          useGrouping: true,
        }).format(num);
      }
    }
    
    // If no decimal part, use regular format
    return formatNumber(num);
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        quantityRef.current &&
        !quantityRef.current.contains(event.target as Node)
      ) {
        setShowQuantityDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Filter options based on search
  const filteredQuantityOptions = quantityOptions.filter((opt) =>
    opt.toString().includes(quantitySearch)
  );

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    
    // Special handling for phone number input
    if (name === "customerPhone") {
      // Remove any non-digit characters
      const digitsOnly = value.replace(/\D/g, "");
      
      // Only allow if empty or starts with 0
      if (digitsOnly === "" || digitsOnly.startsWith("0")) {
        // Limit based on starting digits
        let maxLength = 11; // Default for Iran (09 + 9 digits)
        
        if (digitsOnly.startsWith("07")) {
          maxLength = 10; // Afghanistan (07 + 8 digits)
        } else if (digitsOnly.startsWith("09")) {
          maxLength = 11; // Iran (09 + 9 digits)
        } else if (digitsOnly.length > 1) {
          // If starts with 0 but not 07 or 09, check if second digit is 7 or 9
          const secondDigit = digitsOnly[1];
          if (secondDigit === "7") {
            maxLength = 10; // Will become 07...
          } else if (secondDigit === "9") {
            maxLength = 11; // Will become 09...
          } else {
            // Invalid second digit, don't allow more than 2 digits
            maxLength = 2;
          }
        } else if (digitsOnly === "0") {
          // Just 0, allow user to continue typing
          maxLength = 11;
        }
        
        const limitedValue = digitsOnly.slice(0, maxLength);
        setFormData((prev) => ({
          ...prev,
          [name]: limitedValue,
        }));
      }
      // If doesn't start with 0, ignore the input
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
    
    // Clear error message when user types
    if (submitMessage) setSubmitMessage("");
  };

  const validateForm = () => {
    // Validate quantity
    if (formData.quantity < 1) {
      setSubmitMessage("تعداد باید حداقل 1 عدد باشد");
      return false;
    }

    // Validate desired price
    const price = parseFloat(formData.desiredPrice);
    if (isNaN(price) || price <= 0) {
      setSubmitMessage("لطفاً یک قیمت معتبر وارد کنید");
      return false;
    }

    // Validate phone number (Afghanistan: 07xxxxxxxx, Iran: 09xxxxxxxxx)
    const phone = formData.customerPhone.trim();
    
    if (!phone) {
      setSubmitMessage("لطفاً شماره تماس را وارد کنید");
      return false;
    }

    // Check if phone contains only digits
    if (!/^\d+$/.test(phone)) {
      setSubmitMessage("شماره تماس باید فقط شامل اعداد باشد");
      return false;
    }

    // Check length (Afghanistan: 10 digits, Iran: 11 digits)
    if (phone.length < 10 || phone.length > 11) {
      setSubmitMessage(
        "شماره تماس باید 10 رقم (افغانستان) یا 11 رقم (ایران) باشد"
      );
      return false;
    }

    // Check if starts with valid prefix
    if (!phone.startsWith("09") && !phone.startsWith("07")) {
      setSubmitMessage(
        "شماره تماس باید با 09 (ایران) یا 07 (افغانستان) شروع شود"
      );
      return false;
    }

    // Validate exact format
    const iranPattern = /^09\d{9}$/; // Iran: 09 followed by exactly 9 digits = 11 total
    const afghanPattern = /^07\d{8}$/; // Afghanistan: 07 followed by exactly 8 digits = 10 total

    if (!iranPattern.test(phone) && !afghanPattern.test(phone)) {
      if (phone.startsWith("09")) {
        setSubmitMessage("شماره تماس ایران باید دقیقاً 11 رقم باشد (09 + 9 رقم)");
      } else if (phone.startsWith("07")) {
        setSubmitMessage("شماره تماس افغانستان باید دقیقاً 10 رقم باشد (07 + 8 رقم)");
      } else {
        setSubmitMessage(
          "شماره تماس باید با 09 (ایران) یا 07 (افغانستان) شروع شود"
        );
      }
      return false;
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate form before submission
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    setSubmitMessage("");

    try {
      const response = await fetch("/api/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          productId,
          productName,
          quantity: parseInt(formData.quantity.toString()),
          desiredPrice: parseFloat(formData.desiredPrice),
          customerName: "مشتری", // Default name
          customerPhone: formData.customerPhone.trim(),
          notes: "", // Empty notes
          userId,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setOrderReceipt(data.order);
        setSubmitMessage("");

        // Automatically sign in the user with phone number
        if (data.userPhone && !userId) {
          try {
            const result = await signIn("phone", {
              phone: data.userPhone,
              redirect: false,
            });

            if (result?.ok) {
              console.log("User automatically signed in");
              // Optionally redirect to profile after signing in
              // router.push('/profile');
            }
          } catch (signInError) {
            console.error("Auto sign-in error:", signInError);
            // Continue anyway - order is created
          }
        }

        // Reset form
        setFormData({
          quantity: 1,
          desiredPrice: productPrice !== undefined && productPrice !== null ? (productPrice * 1).toString() : "",
          customerPhone: "",
        });
        setShowQuantityDropdown(false);
        setQuantitySearch("");
        // Close modal after 5 seconds
        setTimeout(() => {
          onClose();
          setOrderReceipt(null);
        }, 10000);
      } else {
        setSubmitMessage(data.error || "خطا در ثبت سفارش");
      }
    } catch (error) {
      console.error("Error submitting order:", error);
      setSubmitMessage("خطا در ثبت سفارش. لطفاً دوباره تلاش کنید.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-[9999] p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white p-6 rounded-t-2xl">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold">خرید قیمت دلخواه</h2>
            <button
              onClick={onClose}
              className="text-white hover:text-gray-200 transition-colors"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
          <p className="text-indigo-100 mt-2 text-sm">
            برای محصول: <span className="font-semibold">{productName}</span>
          </p>
        </div>

        {/* Order Receipt */}
        {orderReceipt ? (
          <div className="p-6">
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg
                  className="w-8 h-8 text-green-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                سفارش شما با موفقیت ثبت شد!
              </h3>
              <p className="text-gray-600">
                شماره سفارش:{" "}
                <span className="font-bold text-indigo-600">
                  #{orderReceipt.id.slice(-8)}
                </span>
              </p>
            </div>

            <div className="bg-gray-50 rounded-lg p-4 mb-6">
              <h4 className="font-semibold text-gray-900 mb-3">
                جزئیات سفارش:
              </h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">محصول:</span>
                  <span className="font-medium">
                    {orderReceipt.productName}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">تعداد:</span>
                  <span className="font-medium">{orderReceipt.quantity}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">قیمت کل دلخواه:</span>
                  <span className="font-medium">
                    {new Intl.NumberFormat("fa-IR").format(
                      orderReceipt.desiredPrice
                    )}{" "}
                    افغانی
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">قیمت هر عدد:</span>
                  <span className="font-medium">
                    {formatDecimalNumber(
                      orderReceipt.desiredPrice / orderReceipt.quantity
                    )}{" "}
                    افغانی
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">وضعیت:</span>
                  <span className="text-yellow-600 font-medium">در انتظار</span>
                </div>
              </div>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-start">
                <svg
                  className="w-5 h-5 text-blue-600 mt-0.5 ml-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <div>
                  <h5 className="font-medium text-blue-900 mb-1">مرحله بعدی</h5>
                  <p className="text-blue-700 text-sm">
                    به زودی با شما تماس خواهیم گرفت تا سفارش شما را تأیید کنیم.
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-6 text-center">
              <p className="text-sm text-gray-500">
                این پنجره در 10 ثانیه بسته خواهد شد...
              </p>
            </div>
          </div>
        ) : (
          /* Form */
          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            {/* Quantity */}
            <div className="relative" ref={quantityRef}>
              <label
                htmlFor="quantity"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                تعداد مورد نظر
              </label>
              <div className="relative">
                <input
                  type="text"
                  id="quantity-search"
                  value={
                    quantitySearch !== ""
                      ? quantitySearch
                      : formData.quantity.toString()
                  }
                  onChange={(e) => {
                    const value = e.target.value;
                    setQuantitySearch(value);
                    setShowQuantityDropdown(true);
                  }}
                  onBlur={(e) => {
                    // When user leaves the field, if it's a valid number, update formData
                    const numValue = parseInt(e.target.value);
                    if (
                      !isNaN(numValue) &&
                      numValue > 0 &&
                      numValue !== formData.quantity
                    ) {
                      setFormData((prev) => {
                        const newQuantity = numValue;
                        const newPrice = productPrice !== undefined && productPrice !== null 
                          ? (productPrice * newQuantity).toString() 
                          : prev.desiredPrice;
                        return { 
                          ...prev, 
                          quantity: newQuantity,
                          desiredPrice: newPrice
                        };
                      });
                    }
                  }}
                  onFocus={() => {
                    setShowQuantityDropdown(true);
                    setQuantitySearch("");
                  }}
                  placeholder="جستجو یا انتخاب تعداد"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
                <button
                  type="button"
                  onClick={() => setShowQuantityDropdown(!showQuantityDropdown)}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                ></button>
              </div>

              {showQuantityDropdown && (
                <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-48 overflow-y-auto">
                  {filteredQuantityOptions.length > 0 ? (
                    filteredQuantityOptions.map((qty) => (
                      <button
                        key={qty}
                        type="button"
                        onClick={() => {
                          setFormData((prev) => {
                            const newPrice = productPrice !== undefined && productPrice !== null 
                              ? (productPrice * qty).toString() 
                              : prev.desiredPrice;
                            return { 
                              ...prev, 
                              quantity: qty,
                              desiredPrice: newPrice
                            };
                          });
                          setQuantitySearch("");
                          setShowQuantityDropdown(false);
                          if (submitMessage) setSubmitMessage("");
                        }}
                        className={`w-full text-right px-4 py-2 hover:bg-gray-100 transition-colors ${
                          formData.quantity === qty
                            ? "bg-indigo-50 font-semibold"
                            : ""
                        }`}
                      >
                        {qty}
                      </button>
                    ))
                  ) : quantitySearch &&
                    !filteredQuantityOptions.some(
                      (opt) => opt.toString() === quantitySearch
                    ) ? (
                    <div className="px-4 py-2 text-sm text-gray-500 border-b border-gray-200">
                      تعداد دلخواه: {quantitySearch}
                    </div>
                  ) : (
                    <div className="px-4 py-2 text-sm text-gray-500">
                      گزینه‌ای یافت نشد
                    </div>
                  )}
                </div>
              )}
              {formData.desiredPrice &&
                parseFloat(formData.desiredPrice) > 0 &&
                formData.quantity > 0 && (
                  <p className="text-sm text-green-700">
                    <span className="font-medium">قیمت هر عدد:</span>{" "}
                    {formatDecimalNumber(
                      parseFloat(formData.desiredPrice) / formData.quantity
                    )}{" "}
                    افغانی
                  </p>
                )}
            </div>

            {/* Desired Price */}
            <div>
              <label
                htmlFor="desiredPrice"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                قیمت کلی دلخواه (افغانی - AFN)
              </label>
              <input
                type="number"
                id="desiredPrice"
                name="desiredPrice"
                min="0"
                step="1"
                value={formData.desiredPrice}
                onChange={(e) => {
                  handleInputChange(e);
                  if (submitMessage) setSubmitMessage("");
                }}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                placeholder="هر قیمتی.."
              />
              {formData.desiredPrice &&
                parseFloat(formData.desiredPrice) > 0 &&
                formData.quantity > 0 && (
                  <div className="mt-2 space-y-1">
                    <p className="text-sm text-gray-700">
                      <span className="font-medium">تعداد مورد نظر:</span>{" "}
                      {formatNumber(formData.quantity)} عدد
                    </p>
                    <p className="text-sm text-gray-600 pt-1 border-t border-gray-200">
                      <span className="font-medium">مبلغ کل:</span>{" "}
                      {formatNumber(parseFloat(formData.desiredPrice))} افغانی
                    </p>
                  </div>
                )}
            </div>

            {/* Customer Phone */}
            <div>
              <label
                htmlFor="customerPhone"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                شماره تماس
              </label>
              <input
                type="tel"
                id="customerPhone"
                name="customerPhone"
                value={formData.customerPhone}
                onChange={(e) => {
                  handleInputChange(e);
                  if (submitMessage) setSubmitMessage("");
                }}
                maxLength={11}
                className="w-full px-4 py-3 text-center border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                placeholder="تلفن همراه جهت تکمیل سفارش"
              />
            </div>

            {/* Submit Message */}
            {submitMessage && (
              <div
                className={`p-4 rounded-lg ${
                  submitMessage.includes("موفقیت")
                    ? "bg-green-100 text-green-800 border border-green-200"
                    : "bg-red-100 text-red-800 border border-red-200"
                }`}
              >
                {submitMessage}
              </div>
            )}

            {/* Buttons */}
            <div className="flex gap-3 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                className="flex-1"
                disabled={isSubmitting}
              >
                انصراف
              </Button>
              <Button
                type="submit"
                className="flex-1 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <div className="flex items-center space-x-2">
                    <svg
                      className="animate-spin h-5 w-5 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    <span className="text-white">در حال ثبت...</span>
                  </div>
                ) : (
                  "ثبت سفارش"
                )}
              </Button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
