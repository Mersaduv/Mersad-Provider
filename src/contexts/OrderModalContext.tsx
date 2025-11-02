"use client";

import { createContext, useContext, useState, ReactNode } from "react";

interface OrderModalContextType {
  isModalOpen: boolean;
  openModal: (productId: string, productName: string, userId?: string) => void;
  closeModal: () => void;
  productId: string;
  productName: string;
  userId?: string;
}

const OrderModalContext = createContext<OrderModalContextType | undefined>(
  undefined
);

export function OrderModalProvider({ children }: { children: ReactNode }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [productId, setProductId] = useState("");
  const [productName, setProductName] = useState("");
  const [userId, setUserId] = useState<string | undefined>(undefined);

  const openModal = (
    prodId: string,
    prodName: string,
    usrId?: string
  ) => {
    setProductId(prodId);
    setProductName(prodName);
    setUserId(usrId);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    // Optional: Clear data after closing
    setTimeout(() => {
      setProductId("");
      setProductName("");
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
