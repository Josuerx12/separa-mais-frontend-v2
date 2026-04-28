import { useRef, useState } from "react";
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
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  requestNewMaterialRequestSchema,
  type TRequestNewMaterialRequest,
} from "@/zod/shemas/request-new-material-request.schema";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { MaterialRequestService } from "@/services/material-request.service";
import { useCompany } from "@/store/company.store";
import { toast } from "react-toastify";
import { Switch } from "@/components/ui/switch";

const RequestNewMaterialRequestDialog = () => {
  const [isOpen, setIsOpen] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);
  const query = useQueryClient();

  const { companySlug } = useCompany();

  function handleOpen() {
    setIsOpen((prev) => !prev);
  }

  const {
    handleSubmit,
    register,
    reset,
    getValues,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(requestNewMaterialRequestSchema),
    defaultValues: {
      enableNotifications: true,
    },
  });

  const { mutate } = useMutation({
    mutationKey: ["requestNewMaterialRequest"],
    mutationFn: MaterialRequestService.create,
    onSuccess: () => {
      reset();
      handleOpen();
      query.invalidateQueries({ queryKey: ["material-requests-kanban"] });
      toast.success(
        "Solicitação de separação de materiais criada com sucesso.",
      );
    },
    onError: () => {
      toast.error(
        "Ocorreu um erro ao solicitar a separação de materiais. Tente novamente.",
      );
    },
  });

  function onSubmit(data: TRequestNewMaterialRequest) {
    mutate({
      slug: companySlug,
      data,
    });
  }

  return (
    <Dialog onOpenChange={handleOpen} open={isOpen}>
      <form ref={formRef} onSubmit={handleSubmit(onSubmit)}>
        <DialogTrigger asChild>
          <button
            type="button"
            className="inline-flex items-center justify-center rounded-xl bg-slate-900 px-5 py-3 text-sm font-bold tracking-wide text-white transition hover:bg-slate-800"
          >
            Solicitar separação de materiais
          </button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-sm">
          <DialogHeader>
            <DialogTitle>Solicitar separação de materiais</DialogTitle>
            <DialogDescription>
              Preencha os campos abaixo para solicitar a separação de materiais.
            </DialogDescription>
          </DialogHeader>

          <label className="mb-2 basis-60 flex-1 block text-sm font-medium text-gray-900">
            <span>Previsão de coleta</span>
            <input
              type="date"
              {...register("collectForecast")}
              className="mt-1 block w-full p-1 rounded-md border-gray-300 shadow-sm focus:border-slate-500 focus:ring-slate-500 sm:text-sm"
            />
            {errors.collectForecast && (
              <p className="text-red-500">
                <span className="font-semibold">Error:</span>
                {errors.collectForecast?.message}
              </p>
            )}
          </label>

          <label className="mb-2 basis-60 flex-1 block text-sm font-medium text-gray-900">
            <span>Id de Saída</span>
            <input
              type="string"
              placeholder="123456 (Obrigatório)"
              {...register("exitId")}
              className="mt-1 block w-full p-1 rounded-md border-gray-300 shadow-sm focus:border-slate-500 focus:ring-slate-500 sm:text-sm"
            />
            {errors.exitId && (
              <p className="text-red-500">
                <span className="font-semibold">Error:</span>
                {errors.exitId?.message}
              </p>
            )}
          </label>

          <label className="mb-2 basis-60 flex-1 block text-sm font-medium text-gray-900">
            <span>Descrição</span>
            <textarea
              rows={5}
              cols={5}
              placeholder="Informe uma descrição (Opcional)"
              {...register("description")}
              className="mt-1 block w-full p-1 rounded-md border-gray-300 shadow-sm focus:border-slate-500 focus:ring-slate-500 sm:text-sm"
            />
            {errors.description && (
              <p className="text-red-500">
                <span className="font-semibold">Error:</span>
                {errors.description?.message}
              </p>
            )}
          </label>

          <label className="mb-2 basis-60 flex-1 block text-sm font-medium text-gray-900">
            <span>Contato Adicional</span>
            <input
              type="string"
              placeholder="022997979633 (Opicional)"
              {...register("additionalContact")}
              className="mt-1 block w-full p-1 rounded-md border-gray-300 shadow-sm focus:border-slate-500 focus:ring-slate-500 sm:text-sm"
            />
            {errors.additionalContact && (
              <p className="text-red-500">
                <span className="font-semibold">Error:</span>
                {errors.additionalContact?.message}
              </p>
            )}
          </label>

          <div className="flex items-center space-x-2">
            <Switch
              id="enableNotifications"
              {...register("enableNotifications")}
              defaultChecked={getValues("enableNotifications")}
            />
            <label htmlFor="enableNotifications">Receber notificações</label>
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

export default RequestNewMaterialRequestDialog;
