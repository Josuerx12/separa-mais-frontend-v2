import { useForm } from "react-hook-form";
import { Button } from "../../ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../../ui/dialog";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  AddCompanyUserSchema,
  type TAddCompanyUser,
} from "@/zod/shemas/add-company-user.schema";
import { Switch } from "@/components/ui/switch";
import { useAuth } from "@/store/auth.store";
import { CompanyUserService } from "@/services/company-user.service";
import { useCompany } from "@/store/company.store";
import { toast } from "react-toastify";
import { useRef, useState } from "react";

const CreateCompanyUserDialog = () => {
  const { user } = useAuth();
  const { companySlug } = useCompany();
  const queryClient = useQueryClient();

  const [isOpen, setIsOpen] = useState(false);

  function handleOpen() {
    setIsOpen((prev) => !prev);
  }

  const {
    handleSubmit,
    register,
    reset,
    formState: { errors },
    getValues,
  } = useForm({
    resolver: zodResolver(AddCompanyUserSchema),
    defaultValues: {
      isRequester: true,
      isAdmin: false,
      isAlmoxarife: false,
      email: "",
      name: "",
      phone: "",
    },
  });

  const { mutate } = useMutation({
    mutationKey: ["createCompanyUser"],
    mutationFn: (data: TAddCompanyUser) =>
      CompanyUserService.createCompanyUser(companySlug!, data),
    onSuccess: () => {
      reset();
      handleOpen();
      toast.success("Usuário adicionado com sucesso");
      queryClient.invalidateQueries({ queryKey: ["companyUsers"] });
    },
  });

  function onSubmit(data: TAddCompanyUser) {
    mutate(data);
  }

  const formRef = useRef<HTMLFormElement>(null);

  return (
    <Dialog onOpenChange={handleOpen} open={isOpen}>
      <form ref={formRef} onSubmit={handleSubmit(onSubmit)}>
        <DialogTrigger asChild>
          <button
            type="button"
            className="inline-flex items-center justify-center rounded-xl bg-slate-900 px-5 py-3 text-sm font-bold tracking-wide text-white transition hover:bg-slate-800"
          >
            Adicionar usuario
          </button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-sm">
          <DialogHeader>
            <DialogTitle>Adicionar novo usuário</DialogTitle>
            <DialogDescription>
              Preencha os campos abaixo para adicionar um novo usuário à sua
              empresa. O usuário receberá um email com as instruções para
              acessar o sistema.
            </DialogDescription>
          </DialogHeader>

          <label className="mb-2 block text-sm font-medium text-gray-900">
            <span>Nome</span>
            <input
              type="text"
              {...register("name")}
              className="mt-1 block w-full p-1 rounded-md border-gray-300 shadow-sm focus:border-slate-500 focus:ring-slate-500 sm:text-sm"
            />
            {errors.name && (
              <p className="text-red-500">
                <span className="font-semibold">Error:</span>{" "}
                {errors.name?.message}
              </p>
            )}
          </label>

          <div className="flex flex-wrap gap-2">
            <label className="mb-2 basis-60 flex-1 block text-sm font-medium text-gray-900">
              <span>E-mail</span>
              <input
                type="email"
                {...register("email")}
                className="mt-1 block w-full p-1 rounded-md border-gray-300 shadow-sm focus:border-slate-500 focus:ring-slate-500 sm:text-sm"
              />
              {errors.email && (
                <p className="text-red-500">
                  <span className="font-semibold">Error:</span>
                  {errors.email?.message}
                </p>
              )}
            </label>
            <label className="mb-2 basis-60 flex-1 block text-sm font-medium text-gray-900">
              <span>Telefone</span>
              <input
                type="phone"
                {...register("phone")}
                className="mt-1 block w-full p-1 rounded-md border-gray-300 shadow-sm focus:border-slate-500 focus:ring-slate-500 sm:text-sm"
              />
              {errors.phone && (
                <p className="text-red-500">
                  <span className="font-semibold">Error:</span>
                  {errors.phone?.message}
                </p>
              )}
            </label>
          </div>

          <div className="flex gap-4 flex-wrap">
            <div className="flex items-center space-x-2">
              <Switch
                id="isRequester"
                {...register("isRequester")}
                defaultChecked={getValues("isRequester")}
              />
              <label htmlFor="isRequester">Usuário solicitante</label>
            </div>
            <div className="flex items-center space-x-2">
              <Switch
                id="isAlmoxarife"
                {...register("isAlmoxarife")}
                defaultChecked={getValues("isAlmoxarife")}
              />
              <label htmlFor="isAlmoxarife">Usuário Almoxarife</label>
            </div>
            {(user?.permissions.isAdmin || user?.permissions.isOwner) && (
              <div className="flex items-center space-x-2">
                <Switch
                  id="isAdmin"
                  {...register("isAdmin")}
                  defaultChecked={getValues("isAdmin")}
                />
                <label htmlFor="isAdmin">Usuário Admin</label>
              </div>
            )}
          </div>

          <DialogFooter>
            <DialogClose asChild>
              <Button
                onClick={() => {
                  reset();
                }}
                variant="outline"
              >
                Cancelar
              </Button>
            </DialogClose>
            <Button onClick={() => formRef.current?.requestSubmit()}>
              Adicionar
            </Button>
          </DialogFooter>
        </DialogContent>
      </form>
    </Dialog>
  );
};

export default CreateCompanyUserDialog;
