import { useMutation } from "@tanstack/react-query";
import { CreateRequirement, createRequirement } from "../../utils/service";
import { removeEmptyStrings, useInputData } from "../../utils/utils";
import { QUERY_TAG, useEventDetailsSuccess } from "../EventDetail/EventDetail";

const useRequirementNewQueries = () => {
  const onSuccessHandler = useEventDetailsSuccess(QUERY_TAG);

  const addRequirementMut = useMutation(
    createRequirement,
    {
      onSuccess: (requirement) => {
        onSuccessHandler(d => ({ ...d, requirements: [...d.requirements, requirement] }));
      }
    }
  );

  return {
    addRequirementMut
  }
}

type RequirementProps = {
  eventId: number,
  onSaveRequirement: () => void,
}

function NewRequirement({
  eventId,
  onSaveRequirement,
}: RequirementProps) {
  const { data: reqData, handleInputChange } = useInputData({ name: '', description: '', size: 1 });
  const { addRequirementMut } = useRequirementNewQueries();

  const handleSave = async () => {
    let data = {
      ...reqData,
      event: eventId,
    } as CreateRequirement;
    removeEmptyStrings(data);
    await addRequirementMut.mutate(data);
    onSaveRequirement();
  }

  return (
    <div>
      <div>
        <span>Name</span>
        <input
          placeholder="Requirement Name"
          aria-label="Requirement name"
          type="text"
          name="name"
          required={true}
          onChange={handleInputChange}
        />
      </div>
      <div>
        <span>Size</span>
        <input
          placeholder="1"
          aria-label="Requirement size"
          type="number"
          name="size"
          onChange={handleInputChange}
        />
      </div>
      <div>
        <div>Description</div>
        <textarea
          name="description"
          rows={6}
          onChange={handleInputChange}
        />
      </div>
      <div>
        <button disabled={reqData.name === ''} onClick={handleSave}>Save</button>
      </div>
    </div>
  )
}

export default NewRequirement;
