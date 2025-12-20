"use client";

import { createContext, useContext, useState, ReactNode } from "react";

interface OrderModalContextType {
  isModalOpen: boolean;
  openModal: (productId: string, productName: string, userId?: string, productPrice?: number) => void;
  closeModal: () => void;
  productId: string;
  productName: string;
  productPrice?: number;
  userId?: string;
}

const OrderModalContext = createContext<OrderModalContextType | undefined>(
  undefined
);

export function OrderModalProvider({ children }: { children: ReactNode }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [productId, setProductId] = useState("");
  const [productName, setProductName] = useState("");
  const [productPrice, setProductPrice] = useState<number | undefined>(undefined);
  const [userId, setUserId] = useState<string | undefined>(undefined);

  const openModal = (
    prodId: string,
    prodName: string,
    usrId?: string,
    prodPrice?: number
  ) => {
    setProductId(prodId);
    setProductName(prodName);
    setProductPrice(prodPrice);
    setUserId(usrId);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    // Optional: Clear data after closing
    setTimeout(() => {
      setProductId("");
      setProductName("");
      setProductPrice(undefined);
      setUserId(undefined);
    }, 300); // Wait for modal close animation
  };

  return (
    <OrderModalContext.Provider
      value={{
        isModalOpen,
        openModal,
        closeModal,
        productId,
        productName,
        productPrice,
        userId,
      }}
    >
      {children}
    </OrderModalContext.Provider>
  );
}

export function useOrderModal() {
  const context = useContext(OrderModalContext);
  if (context === undefined) {
    throw new Error("useOrderModal must be used within OrderModalProvider");
  }
  return context;
}
