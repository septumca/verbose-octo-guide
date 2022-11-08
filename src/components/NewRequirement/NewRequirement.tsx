import { useMutation, useQuery } from "@tanstack/react-query";
import { useRef } from "react";
import { getAuthData } from "../../utils/auth";
import { CreateRequirement, createRequirement, EventDetailData, fetchRequirementSuggestionsForUser, RequirementSuggestion } from "../../utils/service";
import { removeEmptyStrings, useInputData, useMutatorSuccess, useOnClickOutside, useToggler } from "../../utils/utils";
import { Button } from "../Button/Button";
import { QUERY_TAG } from "../EventDetail/EventDetail";
import HorizontalLine from "../HorizontalLine";
import { Input, TextArea } from "../Input/Input";

const useRequirementNewQueries = () => {
  const USER_REQUIREMENTS_TAG = ['user', 'requirements'];
  const onSuccessHandler = useMutatorSuccess<EventDetailData>(QUERY_TAG);
  const onUserRequirementsSuccessHandler = useMutatorSuccess<RequirementSuggestion[]>(USER_REQUIREMENTS_TAG);

  const { data: requirementSuggestions } = useQuery(USER_REQUIREMENTS_TAG, () => {
    const { authData } = getAuthData();
    if (authData === undefined) {
      return [];
    }
    const userId = authData.id;
    return fetchRequirementSuggestionsForUser(userId);
  }, { initialData: [], refetchOnWindowFocus: false });

  const addRequirementMut = useMutation(
    createRequirement,
    {
      onSuccess: (requirement) => {
        onSuccessHandler(d => ({ ...d, requirements: [...d.requirements, requirement] }));
        onUserRequirementsSuccessHandler(d => {
          let processed = false;
          for(let i=0; i<d.length; i++) {
            if(d[i].name === requirement.name) {
              d[i].score += 1;
              processed = true;
              break;
            }
          }

          if (!processed) {
            return [...d, { name: requirement.name, score: 1 }];
          }
          d.sort((a, b) => b.score - a.score);
          return d;
        });
      }
    }
  );

  return {
    requirementSuggestions,
    addRequirementMut,
  }
}

type RequirementProps = {
  eventId: number,
  onSaveRequirement: () => void,
  onCancel: () => void,
}

function NewRequirement({
  eventId,
  onSaveRequirement,
  onCancel,
}: RequirementProps) {
  const reqsRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const [ requirementSuggestionsVisibile, toggleRequirmentSuggestions ] = useToggler(false);
  const { data: reqData, handleInputChange, setData } = useInputData({ name: '', description: '', size: 1 });
  const { requirementSuggestions, addRequirementMut } = useRequirementNewQueries();

  useOnClickOutside(reqsRef, toggleRequirmentSuggestions);

  const handleSave = async () => {
    let data = {
      ...reqData,
      event: eventId,
      size: parseInt(reqData.size, 10)
    } as CreateRequirement;
    removeEmptyStrings(data);
    await addRequirementMut.mutate(data);
    onSaveRequirement();
  }

  const onSelectSuggestion = (suggestedName: string) => () => {
    setData(d => ({ ...d, name: suggestedName }));
    if (inputRef.current !== null) {
      inputRef.current.value = suggestedName;
    }
    toggleRequirmentSuggestions();
  }

  return (
    <div>
      <div className="relative">
        <span>Name</span>
        <Input
          forwardRef={inputRef}
          placeholder="Requirement Name"
          aria-label="Requirement name"
          type="text"
          name="name"
          autoComplete="off"
          required={true}
          onFocus={toggleRequirmentSuggestions}
          onChange={handleInputChange}
        />
        {requirementSuggestionsVisibile && requirementSuggestions.length > 0 && <div ref={reqsRef} className="z-10 bg-white border border-slate-300 rounded w-48 inline-block absolute top-12 left-0">
          <div>Suggested names</div>
          <HorizontalLine />
          {requirementSuggestions.map(({ name }) => <button className="p-1 w-full text-left hover:bg-gray-100" key={name} onClick={onSelectSuggestion(name)}>{name}</button>)}
        </div>}
      </div>
      <div>
        <span>Size</span>
        <Input
          placeholder="1"
          aria-label="Requirement size"
          type="number"
          name="size"
          onChange={handleInputChange}
        />
      </div>
      <div>
        <div>Description</div>
        <TextArea
          name="description"
          rows={6}
          onChange={handleInputChange}
        />
      </div>
      <div>
        <Button className="mr-1" disabled={reqData.name === ''} onClick={handleSave}>💾 Save</Button>
        <Button onClick={onCancel}>❌ Cancel</Button>
      </div>
    </div>
  )
}

export default NewRequirement;
