import React, { useState } from 'react';
import './Modal.css'; // Add styling as needed

type CustomField = {
  id: string;
  label: string;
  type: 'text' | 'textarea' | 'checkbox' | 'select';
  options?: string[];
};

type Props = {
  onAdd: (field: CustomField) => void;
  onClose: () => void;
};

export const CustomFieldModal: React.FC<Props> = ({ onAdd, onClose }) => {
  const [label, setLabel] = useState('');
  const [type, setType] = useState<'text' | 'textarea' | 'checkbox' | 'select'>('text');
  const [options, setOptions] = useState<string[]>([]);
  const [optionInput, setOptionInput] = useState('');

  const handleAddOption = () => {
    if (optionInput.trim()) {
      setOptions(prev => [...prev, optionInput.trim()]);
      setOptionInput('');
    }
  };

  const handleSubmit = () => {
    onAdd({
      id: Date.now().toString(),
      label,
      type,
      options: type === 'select' || type === 'checkbox' ? options : undefined,
    });
    onClose();
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h3>Add Custom Field</h3>
        <input
          placeholder="Label name"
          value={label}
          onChange={e => setLabel(e.target.value)}
        />
        <select value={type} onChange={e => setType(e.target.value as any)}>
          <option value="text">Text Input</option>
          <option value="textarea">Textarea</option>
          <option value="checkbox">Checkbox</option>
          <option value="select">Select</option>
        </select>

        {(type === 'select' || type === 'checkbox') && (
          <div>
            <input
              placeholder="Add option"
              value={optionInput}
              onChange={e => setOptionInput(e.target.value)}
            />
            <button type="button" onClick={handleAddOption}>Add Option</button>
            <ul>
              {options.map((opt, i) => (
                <li key={i}>{opt}</li>
              ))}
            </ul>
          </div>
        )}

        <button onClick={handleSubmit}>Add Field</button>
        <button onClick={onClose}>Cancel</button>
      </div>
    </div>
  );
};
















//thunk

// import React, { useState } from "react";
// import { useAppDispatch } from "../store/hooks"; 
// import { addCustomFieldThunk } from "../store/slices/customFieldSlice"; 
// import "./Modal.css";

// const CustomFieldModal: React.FC<{ onClose: () => void }> = ({ onClose }) => {
//   const dispatch = useAppDispatch();

//   const [label, setLabel] = useState("");
//   const [type, setType] = useState<"text" | "textarea" | "checkbox" | "select">("text");
//   const [options, setOptions] = useState<string[]>([]);
//   const [optionInput, setOptionInput] = useState("");

//   const handleAddOption = () => {
//     if (optionInput.trim()) {
//       setOptions((prev) => [...prev, optionInput.trim()]);
//       setOptionInput("");
//     }
//   };

//   const handleSubmit = () => {
//     dispatch(
//       addCustomFieldThunk({
//         id: Date.now().toString(),
//         label,
//         type,
//         options: type === "select" || type === "checkbox" ? options : undefined,
//       })
//     );
//     onClose();
//   };

//   return (
//     <div className="modal-overlay">
//       <div className="modal-content">
//         <h3>Add Custom Field</h3>

//         <input
//           placeholder="Label name"
//           value={label}
//           onChange={(e) => setLabel(e.target.value)}
//         />

//         <select value={type} onChange={(e) => setType(e.target.value as any)}>
//           <option value="text">Text Input</option>
//           <option value="textarea">Textarea</option>
//           <option value="checkbox">Checkbox</option>
//           <option value="select">Select</option>
//         </select>

//         {(type === "select" || type === "checkbox") && (
//           <div>
//             <input
//               placeholder="Add option"
//               value={optionInput}
//               onChange={(e) => setOptionInput(e.target.value)}
//             />
//             <button type="button" onClick={handleAddOption}>
//               Add Option
//             </button>
//             <ul>
//               {options.map((opt, i) => (
//                 <li key={i}>{opt}</li>
//               ))}
//             </ul>
//           </div>
//         )}

//         <button onClick={handleSubmit}>Add Field</button>
//         <button onClick={onClose}>Cancel</button>
//       </div>
//     </div>
//   );
// };

// export default CustomFieldModal;

