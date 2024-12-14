import { useState } from "react";
import { Header } from "@/components/Header";
import { AdminDashboard } from "@/components/AdminDashboard";

const Admin = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="container mx-auto px-6 py-8">
        <AdminDashboard />
      </div>
    </div>
  );
};

export default Admin;