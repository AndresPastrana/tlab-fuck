import React, { useState } from "react";
import DynamicTextInputs from "../../shared/DynamicTextInputs";
import { isDefenseValid } from "../../../utils/validators";
import SelectProject from "../../shared/professors/SelectProject";
import { CrumbItem } from "../../../types";
import Breadcrumbs from "../../shared/Breadcrumbs";
import SelectCourt from "../../shared/SelectCourt";
import DefenseService from "../../../services/DefenseService";
import { useNavigate } from "react-router-dom";
import ErrorMessage from "../../shared/ErrorMessage";
import { toast } from "sonner";

const items: CrumbItem[] = [
  { label: "Home", href: "/admin" },
  { label: "Defensas", href: "/admin/defense" },
  { label: "Crear nueva defensa" },
];

export const DefenseCreationComponent: React.FC = () => {
  //   const { token } = useAuth();
  const [keyWords, setKeyWords] = useState<string[]>([]);
  const [errors, setErrors] = useState<Record<string, string>>();
  const navigate = useNavigate();
  const handleKeyWordsChange = (newKeyWords: string[]) => {
    setKeyWords(newKeyWords);
  };

  const handleKeyWordsSubmit = async (newKeyWords: string[]) => {
    // You can perform any asynchronous operation here, e.g., send to server
    console.log("Submitting key_words:", newKeyWords);
  };

  const handleCreateDefense = async (
    event: React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);

    // Get values from the form data
    const recoms = formData.get("recoms") as string;
    const evaluation = parseInt(formData.get("evaluation") as string, 10);
    const docFile = formData.get("docFile") as File;
    const presFile = formData.get("presFile") as File;
    const project = formData.get("project");
    const court = formData.get("court");
    //  YYYY/ MM / DD
    const date = formData.get("date");

    // Stringify and append keyWords as a single value
    const keyWordsString = JSON.stringify(keyWords);
    formData.append("keyWords", keyWordsString);

    // Validate the defense

    const defense = {
      court,
      project,
      keyWords,
      recoms,
      evaluation,
      docFile,
      presFile,
      date,
    };

    const validationResult = isDefenseValid(defense);

    if (validationResult.isValid) {
      await DefenseService.createDefense(formData, {});

      navigate("/admin/defense");
      toast.success("Nueva Defensa creada correctamente !");
      // TODO: Use the service to create a new defense
    } else {
      setErrors(validationResult.errors);
      // Handle validation errors, e.g., display to the user
      console.error("Validation errors:", validationResult.errors);
    }
  };

  return (
    <div>
      <Breadcrumbs items={items} />
      <form
        encType="multipart/form-data "
        className="flex flex-col gap-3"
        onSubmit={handleCreateDefense}
      >
        <div>
          <label className="">Seleciona el proyecto defendido</label>
          <SelectProject />
        </div>
        <div>
          <label className="">Seleciona el tribunal de la defensa</label>
          <SelectCourt />
        </div>
        <div className="flex flex-col gap-1 input-ghost">
          <label htmlFor="date">Selecciona la fecha de la defensa</label>
          <input
            required={true}
            id="date"
            className="max-w-xs input"
            name="date"
            type="date"
          />
        </div>
        <div className="flex flex-col sm:flex-row items-center gap-4 mt-6">
          <div className="flex flex-col gap-2  basis-10/12  sm:basis-full w-full">
            <label>Recomendaciones:</label>
            <textarea
              required
              minLength={25}
              maxLength={300}
              placeholder="Recomendaciones para el acta de defensa..."
              name="recoms"
              className=" textarea input-bordered textarea-sm w-full "
            />
          </div>
          <div className="flex flex-row sm:flex-col w-full justify-start gap-3 mt-3 items-center ">
            <label>Evaluacion:</label>
            <input
              type="number"
              required
              min={3}
              max={5}
              name="evaluation"
              className="input input-bordered max-w-[100px]"
            />
          </div>
        </div>

        <div>
          <p>
            Palabras clave{" "}
            <span className="text-gray-400 text-sm">
              (Agregue palabras clave para mejorar la busqueda)
            </span>
          </p>
          <div className="flex flex-col max-h-[200px] overflow-y-scroll max-w-md ">
            <DynamicTextInputs
              initialInputs={keyWords}
              onInputsChange={handleKeyWordsChange}
              onSubmit={handleKeyWordsSubmit}
              showBtn={true}
            />
            <ErrorMessage errors={errors?.keyWords} />
          </div>
        </div>

        <div className="flex flex-col">
          <label>Documento de la defensa:</label>
          <input
            required
            className="file-input w-full max-w-xs file-input-bordered"
            type="file"
            name="docFile"
          />
          <ErrorMessage errors={errors?.docFile} />
        </div>
        <div className="flex flex-col">
          <label>Presentacion de la defensa:</label>
          <input
            required
            className="file-input w-full max-w-xs file-input-bordered"
            type="file"
            name="presFile"
          />
          <ErrorMessage errors={errors?.presFile} />
        </div>
        <div className="flex justify-center">
          <button
            className="btn my-5 w-full max-w-lg   bg-green-600 hover:bg-green-700 text-gray-50"
            type="submit"
          >
            Guardar Defensa
          </button>
        </div>
      </form>
    </div>
  );
};

export default DefenseCreationComponent;
