import { useState, useEffect } from 'react';
import { Plus, ChevronLeft, ChevronRight } from 'lucide-react';
import { Customer } from '@/types/customer';
import CustomerList from '@/components/customers/CustomerList';
import CustomerSearch from '@/components/customers/CustomerSearch';
import CustomerForm from '@/components/forms/CustomerForm';
import { Button } from '@/components/ui/button';
import { useCustomers } from '@/contexts/CustomerContext';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { useToast } from '@/hooks/use-toast';
import { formatCNPJ, formatPhone } from '@/lib/utils';

const ITEMS_PER_PAGE = 8;

export default function Sacados() {
  const { toast } = useToast();
  const { customers, addNewCustomer, updateCustomer, deleteCustomer } = useCustomers();
  const [filteredCustomers, setFilteredCustomers] = useState<Customer[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [deleteCustomerId, setDeleteCustomerId] = useState<string | null>(null);
  const [showNewCustomerModal, setShowNewCustomerModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);

  useEffect(() => {
    setFilteredCustomers(customers);
  }, [customers]);

  const totalPages = Math.ceil(filteredCustomers.length / ITEMS_PER_PAGE);
  const paginatedCustomers = filteredCustomers.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const handleSearch = (query: string) => {
    if (!query.trim()) {
      setFilteredCustomers(customers);
    } else {
      const filtered = customers.filter(customer => 
        customer.razaoSocial.toLowerCase().includes(query.toLowerCase()) ||
        customer.nomeFantasia?.toLowerCase().includes(query.toLowerCase()) ||
        customer.cnpj.includes(query) ||
        customer.email.toLowerCase().includes(query.toLowerCase())
      );
      setFilteredCustomers(filtered);
    }
    setCurrentPage(1);
  };

  const handleNewCustomer = (data: Customer) => {
    addNewCustomer(data);
    setShowNewCustomerModal(false);
    toast({
      title: "Sacado cadastrado",
      description: "O sacado foi cadastrado com sucesso.",
    });
  };

  const handleEdit = (customer: Customer) => {
    setSelectedCustomer(customer);
    setShowEditModal(true);
  };

  const handleEditSubmit = (data: Customer) => {
    if (selectedCustomer) {
      updateCustomer(selectedCustomer.id, data);
      setShowEditModal(false);
      setSelectedCustomer(null);
      toast({
        title: "Sacado atualizado",
        description: "O sacado foi atualizado com sucesso.",
      });
    }
  };

  const handleDelete = (customerId: string) => {
    setDeleteCustomerId(customerId);
  };

  const confirmDelete = () => {
    if (deleteCustomerId) {
      deleteCustomer(deleteCustomerId);
      setDeleteCustomerId(null);
      toast({
        title: "Sacado excluído",
        description: "O sacado foi excluído com sucesso.",
      });
    }
  };

  const handleView = (customer: Customer) => {
    setSelectedCustomer(customer);
    setShowViewModal(true);
  };

  return (
    <div className="h-[calc(100vh-12rem)] bg-white dark:bg-[#1C1C1C] rounded-lg shadow-lg flex flex-col">
      <div className="flex justify-between items-center gap-4 p-6 border-b border-gray-200 dark:border-gray-800">
        <div className="w-full max-w-sm">
          <CustomerSearch onSearch={handleSearch} />
        </div>
        <Button onClick={() => setShowNewCustomerModal(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Novo Sacado
        </Button>
      </div>

      <div className="flex-1 p-6">
        <CustomerList
          customers={paginatedCustomers}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onView={handleView}
        />
      </div>

      {/* Pagination */}
      <div className="p-4 border-t border-gray-200 dark:border-gray-800 flex items-center justify-between">
        <div className="text-sm text-muted-foreground">
          Mostrando {((currentPage - 1) * ITEMS_PER_PAGE) + 1} a {Math.min(currentPage * ITEMS_PER_PAGE, filteredCustomers.length)} de {filteredCustomers.length} resultados
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
            disabled={currentPage === 1}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            <Button
              key={page}
              variant={currentPage === page ? "default" : "outline"}
              size="sm"
              onClick={() => setCurrentPage(page)}
            >
              {page}
            </Button>
          ))}
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
            disabled={currentPage === totalPages}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Modals remain the same */}
      <Dialog open={showNewCustomerModal} onOpenChange={setShowNewCustomerModal}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>Novo Sacado</DialogTitle>
          </DialogHeader>
          <CustomerForm onSubmit={handleNewCustomer} />
        </DialogContent>
      </Dialog>

      <Dialog open={showEditModal} onOpenChange={setShowEditModal}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>Editar Sacado</DialogTitle>
          </DialogHeader>
          <CustomerForm 
            onSubmit={handleEditSubmit}
            initialData={selectedCustomer || undefined}
          />
          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={() => setShowEditModal(false)}>
              Cancelar
            </Button>
            <Button type="submit" form="customer-form">
              Atualizar Cadastro
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={showViewModal} onOpenChange={setShowViewModal}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Detalhes do Sacado</DialogTitle>
          </DialogHeader>
          {selectedCustomer && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h3 className="font-medium text-sm text-muted-foreground mb-1">Razão Social</h3>
                  <p>{selectedCustomer.razaoSocial}</p>
                </div>
                <div>
                  <h3 className="font-medium text-sm text-muted-foreground mb-1">Nome Fantasia</h3>
                  <p>{selectedCustomer.nomeFantasia}</p>
                </div>
                <div>
                  <h3 className="font-medium text-sm text-muted-foreground mb-1">CNPJ</h3>
                  <p>{formatCNPJ(selectedCustomer.cnpj)}</p>
                </div>
                <div>
                  <h3 className="font-medium text-sm text-muted-foreground mb-1">Telefone</h3>
                  <p>{selectedCustomer.telefone ? formatPhone(selectedCustomer.telefone) : '-'}</p>
                </div>
                <div className="col-span-2">
                  <h3 className="font-medium text-sm text-muted-foreground mb-1">E-mail</h3>
                  <p>{selectedCustomer.email}</p>
                </div>
              </div>

              {selectedCustomer.endereco && (
                <>
                  <div className="h-px bg-border" />
                  <div>
                    <h3 className="font-medium mb-3">Endereço</h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="col-span-2">
                        <h4 className="font-medium text-sm text-muted-foreground mb-1">Logradouro</h4>
                        <p>{selectedCustomer.endereco.logradouro}, {selectedCustomer.endereco.numero}</p>
                      </div>
                      {selectedCustomer.endereco.complemento && (
                        <div className="col-span-2">
                          <h4 className="font-medium text-sm text-muted-foreground mb-1">Complemento</h4>
                          <p>{selectedCustomer.endereco.complemento}</p>
                        </div>
                      )}
                      <div>
                        <h4 className="font-medium text-sm text-muted-foreground mb-1">Bairro</h4>
                        <p>{selectedCustomer.endereco.bairro}</p>
                      </div>
                      <div>
                        <h4 className="font-medium text-sm text-muted-foreground mb-1">CEP</h4>
                        <p>{selectedCustomer.endereco.cep}</p>
                      </div>
                      <div>
                        <h4 className="font-medium text-sm text-muted-foreground mb-1">Cidade</h4>
                        <p>{selectedCustomer.endereco.cidade}</p>
                      </div>
                      <div>
                        <h4 className="font-medium text-sm text-muted-foreground mb-1">Estado</h4>
                        <p>{selectedCustomer.endereco.estado}</p>
                      </div>
                    </div>
                  </div>
                </>
              )}
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowViewModal(false)}>
              Fechar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AlertDialog open={!!deleteCustomerId} onOpenChange={() => setDeleteCustomerId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja excluir este sacado? Esta ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} className="bg-red-500 hover:bg-red-600">
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}