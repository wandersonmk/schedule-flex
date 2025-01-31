import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface ProfessionalFormFieldsProps {
  formData: {
    name: string;
    specialty: string;
    email: string;
    phone: string;
  };
  onInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export const ProfessionalFormFields = ({
  formData,
  onInputChange,
}: ProfessionalFormFieldsProps) => {
  return (
    <div className="grid grid-cols-2 gap-4">
      <div className="space-y-2">
        <Label htmlFor="edit-name">Nome</Label>
        <Input
          id="edit-name"
          name="name"
          value={formData.name}
          onChange={onInputChange}
          required
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="edit-specialty">Especialidade</Label>
        <Input
          id="edit-specialty"
          name="specialty"
          value={formData.specialty}
          onChange={onInputChange}
          required
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="edit-email">Email</Label>
        <Input
          id="edit-email"
          name="email"
          type="email"
          value={formData.email}
          onChange={onInputChange}
          required
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="edit-phone">Telefone</Label>
        <Input
          id="edit-phone"
          name="phone"
          value={formData.phone}
          onChange={onInputChange}
          required
        />
      </div>
    </div>
  );
};