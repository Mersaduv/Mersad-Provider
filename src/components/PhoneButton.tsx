"use client";

import React from "react";
import { phoneNumber } from "@/lib/utils";

export default function PhoneButton() {
  const handlePhoneClick = (e: React.MouseEvent) => {
    e.preventDefault();

    navigator.clipboard.writeText(phoneNumber).then(() => {
      console.log("شماره کپی شد:", phoneNumber);
    });

    window.location.href = `tel:${phoneNumber}`;
  };

  return (
    <button
      onClick={handlePhoneClick}
      className="w-full flex cursor-pointer justify-center items-center p-4 bg-yellow-500 hover:bg-yellow-600 text-gray-900 font-bold text-2xl rounded-2xl ring-2 ring-yellow-500 outline-none"
    >
      جهت استعلام قیمت لطفا تماس بگیرید
    </button>
  );
}
