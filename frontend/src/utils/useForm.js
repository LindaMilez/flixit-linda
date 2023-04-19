import { useState } from "react";

export const useForm = () => {
  const [formInput, setFormEntries] = useState({});
  const updateNewInput = (event) => {
    const { name, value, type, checked } = event.target;
    if (type === "checkbox") {
      setFormEntries((entries) => ({
        ...entries,
        [name]: { ...entries[name], value: checked },
      }));
    } else {
      setFormEntries((entries) => ({
        ...entries,
        [name]: { ...entries[name], value },
      }));
    }
  };
  const onFocusOut = (event) => {
    const { name } = event.target;
    setFormEntries(entries => ({...entries, [name]: { ...entries[name], touched: true }}));
  };
  return [formInput, updateNewInput, onFocusOut];
};
