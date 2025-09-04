import Create from './Create';
import './TodoModal.css';

type Props = {
  defaultValues: { title: string; description: string; status: string };
  onSubmit:any,
  onClose: () => void;
};

const TodoModal = ({ defaultValues, onSubmit, onClose }: Props) => {
  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h3>Edit Todo</h3>
        <Create defaultValues={defaultValues} onSubmit={onSubmit} />
        <button onClick={onClose}>Close</button>
      </div>
    </div>
  );
};

export default TodoModal;
