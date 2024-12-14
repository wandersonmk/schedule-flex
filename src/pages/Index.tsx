import { Header } from "@/components/Header";
import { Hero } from "@/components/Hero";
import { Calendar } from "@/components/Calendar";
import { BookingForm } from "@/components/BookingForm";

const Index = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <Hero />
      <div className="container mx-auto px-6 py-16">
        <div className="grid md:grid-cols-2 gap-8">
          <Calendar />
          <BookingForm />
        </div>
      </div>
    </div>
  );
};

export default Index;