import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Camera, ChevronDown, KeyRound, Mail } from 'lucide-react';
import { useUser } from '@/contexts/UserContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useToast } from '@/hooks/use-toast';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';

interface Country {
  name: string;
  code: string;
  format: string;
}

const countries: Country[] = [
  { name: 'Brasil', code: '+55', format: '(00) 00000-0000' },
  { name: 'Estados Unidos', code: '+1', format: '(000) 000-0000' },
  { name: 'Portugal', code: '+351', format: '000 000 000' },
  { name: 'Reino Unido', code: '+44', format: '00000 000000' },
];

export default function Profile() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user, updateUser } = useUser();
  const [isEditing, setIsEditing] = useState(false);
  const [selectedCountry, setSelectedCountry] = useState(countries[0]);
  const [showEmailChange, setShowEmailChange] = useState(false);
  const [showPasswordChange, setShowPasswordChange] = useState(false);
  const [editedUser, setEditedUser] = useState(user);
  const [emailForm, setEmailForm] = useState({
    currentEmail: '',
    newEmail: '',
    confirmEmail: ''
  });
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const handleGenderChange = (value: string) => {
    setEditedUser(prev => ({ ...prev, gender: value }));
    localStorage.setItem('userGender', value);
  };

  const handleSave = () => {
    updateUser(editedUser);
    setIsEditing(false);
    toast({
      title: "Perfil atualizado",
      description: "Seu perfil foi atualizado com sucesso.",
    });
  };

  const handleCancel = () => {
    setEditedUser(user);
    setIsEditing(false);
  };

  const handleEmailChange = () => {
    if (emailForm.newEmail === emailForm.confirmEmail) {
      updateUser({ email: emailForm.newEmail });
      setShowEmailChange(false);
      toast({
        title: "E-mail atualizado",
        description: "Seu e-mail foi atualizado com sucesso.",
      });
    }
  };

  const handlePasswordChange = () => {
    setShowPasswordChange(false);
    toast({
      title: "Senha atualizada",
      description: "Sua senha foi atualizada com sucesso.",
    });
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white dark:bg-[#1C1C1C] rounded-lg shadow-lg">
      <div className="flex items-center gap-4 mb-6">
        <Button variant="ghost" size="icon" onClick={() => navigate('/')}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <h1 className="text-2xl font-bold">Configurações do Perfil</h1>
      </div>

      <div className="mb-6 flex items-center gap-6">
        <div className="relative">
          <Avatar className="h-24 w-24">
            <AvatarImage src={isEditing ? editedUser.avatar : user.avatar} />
            <AvatarFallback>
              {user.firstName[0]}{user.lastName[0]}
            </AvatarFallback>
          </Avatar>
          {isEditing && (
            <Button 
              size="icon"
              variant="secondary"
              className="absolute bottom-0 right-0 rounded-full"
            >
              <Camera className="h-4 w-4" />
            </Button>
          )}
        </div>
        <div>
          <h2 className="text-xl font-semibold">{user.firstName} {user.lastName}</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400">{user.role}</p>
        </div>
      </div>

      <div className="space-y-6">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="firstName">Nome</Label>
            <Input
              id="firstName"
              value={isEditing ? editedUser.firstName : user.firstName}
              onChange={(e) => setEditedUser({ ...editedUser, firstName: e.target.value })}
              disabled={!isEditing}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="lastName">Sobrenome</Label>
            <Input
              id="lastName"
              value={isEditing ? editedUser.lastName : user.lastName}
              onChange={(e) => setEditedUser({ ...editedUser, lastName: e.target.value })}
              disabled={!isEditing}
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="phone">Telefone</Label>
            <div className="flex gap-2">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="w-[120px] flex justify-between items-center">
                    {selectedCountry.code}
                    <ChevronDown className="h-4 w-4 opacity-50" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  {countries.map((country) => (
                    <DropdownMenuItem
                      key={country.code}
                      onClick={() => setSelectedCountry(country)}
                    >
                      <span>{country.name} ({country.code})</span>
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
              <Input
                id="phone"
                value={isEditing ? editedUser.phone : user.phone}
                onChange={(e) => setEditedUser({ ...editedUser, phone: e.target.value })}
                disabled={!isEditing}
                placeholder={selectedCountry.format}
                className="flex-1"
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="role">Cargo</Label>
            <Input
              id="role"
              value={isEditing ? editedUser.role : user.role}
              onChange={(e) => setEditedUser({ ...editedUser, role: e.target.value })}
              disabled={!isEditing}
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="gender">Gênero</Label>
          <Select
            value={isEditing ? editedUser.gender : user.gender}
            onValueChange={handleGenderChange}
            disabled={!isEditing}
          >
            <SelectTrigger>
              <SelectValue placeholder="Selecione seu gênero" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="male">Masculino</SelectItem>
              <SelectItem value="female">Feminino</SelectItem>
              <SelectItem value="other">Outro</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <Label htmlFor="email">E-mail</Label>
            {isEditing && (
              <Button
                variant="ghost"
                size="sm"
                className="h-8 text-blue-600"
                onClick={() => setShowEmailChange(true)}
              >
                <Mail className="w-4 h-4 mr-2" />
                Alterar E-mail
              </Button>
            )}
          </div>
          <Input
            id="email"
            type="email"
            value={isEditing ? editedUser.email : user.email}
            onChange={(e) => setEditedUser({ ...editedUser, email: e.target.value })}
            disabled={!isEditing}
          />
        </div>

        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <Label>Senha</Label>
            {isEditing && (
              <Button
                variant="ghost"
                size="sm"
                className="h-8 text-blue-600"
                onClick={() => setShowPasswordChange(true)}
              >
                <KeyRound className="w-4 h-4 mr-2" />
                Alterar Senha
              </Button>
            )}
          </div>
          <Input
            type="password"
            value="••••••••"
            disabled
          />
        </div>

        <div className="flex justify-end gap-4 mt-6">
          {!isEditing ? (
            <Button onClick={() => setIsEditing(true)}>
              Editar Perfil
            </Button>
          ) : (
            <>
              <Button variant="outline" onClick={handleCancel}>
                Cancelar
              </Button>
              <Button onClick={handleSave}>
                Salvar Alterações
              </Button>
            </>
          )}
        </div>
      </div>

      <Dialog open={showEmailChange} onOpenChange={setShowEmailChange}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Alterar Endereço de E-mail</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>E-mail Atual</Label>
              <Input
                type="email"
                value={emailForm.currentEmail}
                onChange={(e) => setEmailForm({ ...emailForm, currentEmail: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label>Novo E-mail</Label>
              <Input
                type="email"
                value={emailForm.newEmail}
                onChange={(e) => setEmailForm({ ...emailForm, newEmail: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label>Confirmar Novo E-mail</Label>
              <Input
                type="email"
                value={emailForm.confirmEmail}
                onChange={(e) => setEmailForm({ ...emailForm, confirmEmail: e.target.value })}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowEmailChange(false)}>
              Cancelar
            </Button>
            <Button onClick={handleEmailChange}>
              Atualizar E-mail
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={showPasswordChange} onOpenChange={setShowPasswordChange}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Alterar Senha</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Senha Atual</Label>
              <Input
                type="password"
                value={passwordForm.currentPassword}
                onChange={(e) => setPasswordForm({ ...passwordForm, currentPassword: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label>Nova Senha</Label>
              <Input
                type="password"
                value={passwordForm.newPassword}
                onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label>Confirmar Nova Senha</Label>
              <Input
                type="password"
                value={passwordForm.confirmPassword}
                onChange={(e) => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowPasswordChange(false)}>
              Cancelar
            </Button>
            <Button onClick={handlePasswordChange}>
              Atualizar Senha
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}